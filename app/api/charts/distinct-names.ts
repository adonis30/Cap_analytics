// /pages/api/charts/distinct-names.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/database';
import ChartMetadata from '@/lib/database/models/chartMetadata.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { category } = req.query;
    if (!category) return res.status(400).json({ error: "Category is required" });

    const names = await ChartMetadata.distinct('name', { category });
    return res.status(200).json({ category, names });
  } catch (error) {
    console.error('Distinct name error:', error);
    res.status(500).json({ error: 'Failed to fetch chart names' });
  }
}
