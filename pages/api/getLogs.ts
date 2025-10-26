import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

async function streamToString(stream: any) {
  return await new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err: any) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const bucketName = process.env.S3_BUCKET_NAME || process.env.NEXT_PUBLIC_S3_BUCKET || process.env.AWS_S3_BUCKET;
  const prefix = 'frank/';

  if (bucketName) {
    try {
      const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
      const s3 = new S3Client({ region });

      // List objects under the prefix and fetch them in lexicographic (timestamp) order
      const listCmd = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix });
      const listResp = await s3.send(listCmd);

      const contents = listResp.Contents || [];
      // Sort by Key to get chronological order if keys include timestamp
      contents.sort((a, b) => (a.Key || '').localeCompare(b.Key || ''));

      let aggregated = '';
      for (const obj of contents) {
        if (!obj.Key) continue;
        try {
          const get = new GetObjectCommand({ Bucket: bucketName, Key: obj.Key });
          const response = await s3.send(get);
          const body = await streamToString(response.Body as any);
          aggregated += `\n---- ${obj.Key} ----\n` + body + '\n';
        } catch (err) {
          console.error('Failed to read S3 object', obj.Key, err);
        }
      }

      if (aggregated.length > 0) {
        return res.status(200).json({ source: 's3', content: aggregated });
      }
    } catch (err) {
      console.error('Failed to list/read logs from S3:', err);
      // fallthrough to try local file
    }
  }

  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'chat_logs.txt');
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      return res.status(200).json({ source: 'local', content });
    } else {
      return res.status(404).json({ message: 'Log file not found' });
    }
  } catch (error) {
    console.error('Error reading local log file:', error);
    return res.status(500).json({ message: 'Error reading log file' });
  }
}
