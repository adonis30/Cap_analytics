import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Server-side log test');
  console.warn('Server-side warn test');
  console.error('Server-side error test');
  res.status(200).json({ message: 'Check server console and terminal for logs' });
}