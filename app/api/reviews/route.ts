import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
    }

    const { collegeId, rating, text } = parsed.data;

    const existing = await prisma.review.findFirst({
      where: { userId, collegeId },
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, text },
        include: { user: { select: { name: true } } },
      });
    } else {
      review = await prisma.review.create({
        data: { userId, collegeId, rating, text },
        include: { user: { select: { name: true } } },
      });
    }

    const avg = await prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
    });

    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: avg._avg.rating ?? 0 },
    });

    return NextResponse.json(
      {
        id: review.id,
        rating: review.rating,
        text: review.text,
        reviewerName: review.user.name,
        createdAt: review.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Could not submit review" }, { status: 500 });
  }
}
