import { NextResponse } from 'next/server';
import ChartMetadata from '@/lib/database/models/chartMetadata.model';
import { connectToDatabase } from '@/lib/database';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country'); // 👈 new param

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    await connectToDatabase();

    const query: Record<string, any> = { category };

    if (country) {
      query.country = country; // 👈 add country filter if provided
    }

    const names = await ChartMetadata.distinct('name', query);

    return NextResponse.json({ category, country, names }, { status: 200 });
  } catch (error) {
    console.error('[API] Failed to fetch distinct chart names:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
