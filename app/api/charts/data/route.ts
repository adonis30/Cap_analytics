// app/api/charts/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ChartData from '@/lib/database/models/chartData.model';
import ChartMetadata from '@/lib/database/models/chartMetadata.model';
import { connectToDatabase } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Missing chart name' }, { status: 400 });
    }

    await connectToDatabase();

    const metadata = await ChartMetadata.findOne({ name });

    if (!metadata) {
      return NextResponse.json({ error: 'Chart metadata not found' }, { status: 404 });
    }

    const chartData = await ChartData.find({ metadataId: metadata._id });

    return NextResponse.json({
      metadata,
      data: chartData,
    });

  } catch (error) {
    console.error('[API] Failed to load chart data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
