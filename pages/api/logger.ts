import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const logDir = path.join(process.cwd(), 'logs');
        const logFile = path.join(logDir, 'chat_logs.txt');

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // Format the data
        const timestamp = new Date().toISOString();
        const logEntry = `\n[${timestamp}]\n${JSON.stringify(req.body, null, 2)}\n------------------------\n`;

        // Append to log file
        fs.appendFileSync(logFile, logEntry);

        // If S3 bucket is configured, upload the log file to S3
        const bucketName = process.env.S3_BUCKET_NAME || process.env.NEXT_PUBLIC_S3_BUCKET || process.env.AWS_S3_BUCKET;
        if (bucketName) {
            try {
                // Create S3 client - credentials/region will be loaded from environment or instance role
                const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
                const s3Client = new S3Client({ region });

                const fileBody = fs.readFileSync(logFile);
                const key = 'frank/chat_logs.txt';

                const put = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                    Body: fileBody,
                    ContentType: 'text/plain'
                });

                await s3Client.send(put);
            } catch (s3Err) {
                // Log S3 errors but don't fail the request so local logging still works
                console.error('Failed to upload logs to S3:', s3Err);
            }
        }

        res.status(200).json({ message: 'Log written successfully' });
    } catch (error) {
        console.error('Error writing log:', error);
        res.status(500).json({ message: 'Error writing log' });
    }
}