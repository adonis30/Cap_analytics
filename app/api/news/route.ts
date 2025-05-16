// app/api/news/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res = await axios.get(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY}`);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error('News fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
