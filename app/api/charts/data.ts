// /pages/api/charts/data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/database';
import ChartMetadata from '@/lib/database/models/chartMetadata.model';
import ChartData from '@/lib/database/models/chartData.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Chart name is required" });

    const metadata = await ChartMetadata.findOne({ name });
    if (!metadata) return res.status(404).json({ error: 'Chart not found' });

    const data = await ChartData.find({ metadataId: metadata._id });
    return res.status(200).json({ metadata, data });
  } catch (error) {
    console.error('Fetch chart data error:', error);
    res.status(500).json({ error: 'Failed to retrieve chart data' });
  }
}
