import { NextRequest, NextResponse } from "next/server";
import { searchColleges } from "@/lib/colleges";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const result = await searchColleges({
      search: searchParams.get("search") ?? undefined,
      state: searchParams.get("state") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      minFees: searchParams.get("minFees") ? parseInt(searchParams.get("minFees")!, 10) : undefined,
      maxFees: searchParams.get("maxFees") ? parseInt(searchParams.get("maxFees")!, 10) : undefined,
      minRating: searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined,
      examAccepted: searchParams.get("examAccepted") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not load colleges" }, { status: 500 });
  }
}
