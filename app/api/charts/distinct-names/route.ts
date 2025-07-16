// app/api/charts/distinct-names/route.ts

import { NextResponse } from "next/server";
import ChartMetadata from "@/lib/database/models/chartMetadata.model";
import { connectToDatabase } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const country = searchParams.get("country");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await connectToDatabase();

    const query: any = { category };
    if (country && country !== "All") query.country = country;

    const names = await ChartMetadata.distinct("name", query);

    return NextResponse.json({ category, country, names }, { status: 200 });
  } catch (error) {
    console.error("[API] Failed to fetch distinct chart names:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
