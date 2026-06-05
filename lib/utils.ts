import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCollegeSummary(college: {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  fees: number;
  rating: number;
  logoUrl: string | null;
  examAccepted: string;
  established: number | null;
  totalStudents: number | null;
  campusSize: string | null;
}) {
  return {
    id: college.id,
    name: college.name,
    slug: college.slug,
    city: college.city,
    state: college.state,
    type: college.type,
    fees: college.fees,
    rating: college.rating,
    logoUrl: college.logoUrl,
    examAccepted: college.examAccepted ? college.examAccepted.split(",").filter(Boolean) : [],
    established: college.established,
    totalStudents: college.totalStudents,
    campusSize: college.campusSize,
  };
}
