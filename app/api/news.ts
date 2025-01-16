import axios from "axios";

// pages/api/news.js (or .ts for TypeScript)
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { data } = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&apiKey=NEWS_API_KEY`
    );
    res.json(data);
  };
  