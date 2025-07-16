// app/api/charts/distinct-countries/route.ts

import { NextResponse } from "next/server";
import ChartMetadata from "@/lib/database/models/chartMetadata.model";
import { connectToDatabase } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const countries = await ChartMetadata.distinct("country");
    return NextResponse.json({ countries }, { status: 200 });
  } catch (error) {
    console.error("[API] Failed to fetch distinct countries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
