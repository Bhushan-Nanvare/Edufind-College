import { prisma } from "@/lib/prisma";
import { formatCollegeSummary } from "@/lib/utils";

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  examAccepted?: string;
  type?: string;
  page: number;
  limit: number;
}

export async function searchColleges(filters: CollegeFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { city: { contains: filters.search, mode: "insensitive" } },
      { state: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.state) where.state = { contains: filters.state, mode: "insensitive" };
  if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
  if (filters.minFees != null || filters.maxFees != null) {
    where.fees = {
      ...(filters.minFees != null ? { gte: filters.minFees } : {}),
      ...(filters.maxFees != null ? { lte: filters.maxFees } : {}),
    };
  }
  if (filters.minRating != null) where.rating = { gte: filters.minRating };
  if (filters.examAccepted) where.examAccepted = { contains: filters.examAccepted, mode: "insensitive" };
  if (filters.type) where.type = filters.type as "GOVERNMENT" | "PRIVATE" | "DEEMED";

  const offset = (filters.page - 1) * filters.limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { rating: "desc" },
      take: filters.limit,
      skip: offset,
    }),
    prisma.college.count({ where }),
  ]);

  return {
    colleges: colleges.map(formatCollegeSummary),
    total,
    page: filters.page,
    limit: filters.limit,
  };
}

export async function getCollegeDetail(idOrSlug: string) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const college = await prisma.college.findFirst({
    where: isNumeric ? { id: parseInt(idOrSlug, 10) } : { slug: idOrSlug },
  });

  if (!college) return null;

  const [courses, placements, rawReviews] = (await Promise.all([
    prisma.course.findMany({ where: { collegeId: college.id } }),
    prisma.placement.findMany({ where: { collegeId: college.id } }),
    prisma.review.findMany({
      where: { collegeId: college.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])) as [
    Array<{ id: number; name: string; duration: number; fees: number }>,
    Array<{ id: number; avgSalary: number; highestSalary: number; placementPercent: number; topRecruiters: string | null; year: number }>,
    Array<{ id: number; rating: number; text: string; createdAt: Date; user: { name: string } }>,
  ];

  return {
    ...formatCollegeSummary(college),
    description: college.description,
    naacGrade: college.naacGrade,
    nirf: college.nirf,
    approvals: college.approvals ? college.approvals.split(",").filter(Boolean) : [],
    website: college.website,
    courses: courses.map((c) => ({ id: c.id, name: c.name, duration: c.duration, fees: c.fees })),
    placements: placements.map((p) => ({
      id: p.id,
      avgSalary: p.avgSalary,
      highestSalary: p.highestSalary,
      placementPercent: p.placementPercent,
      topRecruiters: p.topRecruiters ? p.topRecruiters.split(",").filter(Boolean) : [],
      year: p.year,
    })),
    reviews: rawReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.text,
      reviewerName: r.user.name,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function getCollegesForCompare(ids: number[]) {
  if (ids.length === 0 || ids.length > 3) return [];

  const colleges = (await prisma.college.findMany({ where: { id: { in: ids } } })) as Array<{
    id: number;
  }>;

  return Promise.all(
    colleges.map(async (college) => {
      const detail = await getCollegeDetail(String(college.id));
      return detail!;
    }),
  );
}

export async function getUniqueStates() {
  const rows = (await prisma.college.findMany({
    select: { state: true },
    distinct: ["state"],
    orderBy: { state: "asc" },
  })) as Array<{ state: string }>;
  return rows.map((r) => r.state);
}
