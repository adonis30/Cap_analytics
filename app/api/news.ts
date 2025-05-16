// /pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { investor } = req.query;

  const url = `https://newsapi.org/v2/top-headlines?category=business&q=${investor}&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const response = await fetch(url); 
    const data = await response.json();
    console.log("data", data)
    if (!data.articles || data.articles.length === 0) {
      return res.status(404).json({ error: 'No news articles found.' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
