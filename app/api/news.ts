import axios from "axios";

// pages/api/news.js (or .ts for TypeScript)
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { data } = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&apiKey=852ef605e8ef45b19821c29549e78674`
    );
    res.json(data);
  };
  