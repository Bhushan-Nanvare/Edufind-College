import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCollegeSummary } from "@/lib/utils";
import { saveCollegeSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: { college: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      saved.map((item: { id: number; collegeId: number; status: string; createdAt: Date; college: Parameters<typeof formatCollegeSummary>[0] }) => ({
        id: item.id,
        collegeId: item.collegeId,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        college: formatCollegeSummary(item.college),
      })),
    );
  } catch {
    return NextResponse.json({ error: "Could not load saved colleges" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const body = await request.json();
    const parsed = saveCollegeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "collegeId is required and must be a number" }, { status: 400 });
    }

    const { collegeId } = parsed.data;

    const existing = await prisma.savedCollege.findFirst({
      where: { userId, collegeId },
      include: { college: true },
    });

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        collegeId: existing.collegeId,
        status: existing.status,
        createdAt: existing.createdAt.toISOString(),
        college: formatCollegeSummary(existing.college),
      });
    }

    const created = await prisma.savedCollege.create({
      data: { userId, collegeId, status: "INTERESTED" },
      include: { college: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        collegeId: created.collegeId,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
        college: formatCollegeSummary(created.college),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Could not save college" }, { status: 500 });
  }
}
