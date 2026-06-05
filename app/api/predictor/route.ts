import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCollegeSummary } from "@/lib/utils";
import { predictorQuerySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const parsed = predictorQuerySchema.safeParse({
    exam: request.nextUrl.searchParams.get("exam"),
    rank: request.nextUrl.searchParams.get("rank"),
    category: request.nextUrl.searchParams.get("category"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid exam, rank, or category value" }, { status: 400 });
  }

  const { exam, rank: studentRank, category } = parsed.data;

  try {
    const cutoffs = await prisma.rankCutoff.findMany({
      where: {
        exam,
        category,
        closingRank: { gte: studentRank - 2000 },
      },
      include: { college: true },
      orderBy: { closingRank: "asc" },
      take: 50,
    });

    const results = cutoffs.map((cutoff: { closingRank: number; college: Parameters<typeof formatCollegeSummary>[0] }) => {
      const { closingRank, college } = cutoff;
      let chance: string;
      if (closingRank > studentRank + 5000) chance = "High Chance";
      else if (closingRank >= studentRank) chance = "Moderate Chance";
      else chance = "Low Chance";

      return { college: formatCollegeSummary(college), closingRank, chance };
    });

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Could not run predictor. Please try again." }, { status: 500 });
  }
}
