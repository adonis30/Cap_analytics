import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY}`
    );
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch news." }, { status: 500 });
  }
}
