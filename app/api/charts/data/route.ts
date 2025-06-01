import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import ChartMetadata from '@/lib/database/models/chartMetadata.model';
import ChartData from '@/lib/database/models/chartData.model';

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

    // ——— Wrap ChartData lookup in its own try…catch ———
    try {
      const chartData = await ChartData.find({ metadataId: metadata._id });
       
      return NextResponse.json({ metadata, data: chartData });
    } catch (innerError) {
      console.error("Error fetching chart data:", innerError);
      return NextResponse.json(
        { error: 'Failed to fetch chart data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in /api/charts/data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
