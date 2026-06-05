import { NextResponse } from "next/server";
import { getUniqueStates } from "@/lib/colleges";

export async function GET() {
  try {
    const states = await getUniqueStates();
    return NextResponse.json(states);
  } catch {
    return NextResponse.json({ error: "Could not load states" }, { status: 500 });
  }
}
