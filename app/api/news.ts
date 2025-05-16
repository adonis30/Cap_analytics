// /pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { investor } = req.query;

  if (!investor || typeof investor !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid investor parameter' });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY in environment variables' });
  }

  const url = `https://newsapi.org/v2/top-headlines?category=business&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return res.status(200).json({ articles: [] }); // ✅ Changed from 404 to 200
    }

    return res.status(200).json(data);
  } catch (err: any) {
    console.error('News API fetch failed:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
