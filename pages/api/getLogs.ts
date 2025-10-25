import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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
  const key = 'chat_logs.txt';

  if (bucketName) {
    try {
      const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
      const s3 = new S3Client({ region });
      const get = new GetObjectCommand({ Bucket: bucketName, Key: key });
      const response = await s3.send(get);
      // response.Body can be a stream
      const body = await streamToString(response.Body as any);
      return res.status(200).json({ source: 's3', content: body });
    } catch (err) {
      console.error('Failed to read logs from S3:', err);
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
