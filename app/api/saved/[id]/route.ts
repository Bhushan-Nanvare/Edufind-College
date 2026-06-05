import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCollegeSummary } from "@/lib/utils";
import { savedStatusSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const savedId = parseInt(params.id, 10);

  try {
    const body = await request.json();
    const parsed = savedStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const record = await prisma.savedCollege.findFirst({
      where: { id: savedId, userId },
    });

    if (!record) {
      return NextResponse.json({ error: "Saved college not found" }, { status: 404 });
    }

    const updated = await prisma.savedCollege.update({
      where: { id: savedId },
      data: { status: parsed.data.status },
      include: { college: true },
    });

    return NextResponse.json({
      id: updated.id,
      collegeId: updated.collegeId,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      college: formatCollegeSummary(updated.college),
    });
  } catch {
    return NextResponse.json({ error: "Could not update status" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const savedId = parseInt(params.id, 10);

  try {
    const deleted = await prisma.savedCollege.deleteMany({
      where: { id: savedId, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Saved college not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Could not remove saved college" }, { status: 500 });
  }
}
