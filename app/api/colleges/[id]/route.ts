import { NextResponse } from "next/server";
import { getCollegeDetail } from "@/lib/colleges";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const college = await getCollegeDetail(params.id);
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    return NextResponse.json(college);
  } catch {
    return NextResponse.json({ error: "Could not load college" }, { status: 500 });
  }
}
