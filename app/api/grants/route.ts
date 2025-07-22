// app/api/grants/route.ts

import { grants } from "@/lib/actions/grants.actions";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ grants });
}
