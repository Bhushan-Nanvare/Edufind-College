import { NextRequest, NextResponse } from "next/server";
import { getCollegesForCompare } from "@/lib/colleges";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ error: "ids query parameter is required" }, { status: 400 });
  }

  const ids = idsParam.split(",").map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id));

  try {
    const colleges = await getCollegesForCompare(ids);
    return NextResponse.json(colleges);
  } catch {
    return NextResponse.json({ error: "Could not compare colleges" }, { status: 500 });
  }
}
