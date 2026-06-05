export interface CollegeSummary {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  fees: number;
  rating: number;
  logoUrl: string | null;
  examAccepted: string[];
  established: number | null;
  totalStudents: number | null;
  campusSize: string | null;
}

export interface Course {
  id: number;
  name: string;
  duration: number;
  fees: number;
}

export interface Placement {
  id: number;
  avgSalary: number;
  highestSalary: number;
  placementPercent: number;
  topRecruiters: string[];
  year: number;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  reviewerName: string;
  createdAt: string;
}

export interface CollegeDetail extends CollegeSummary {
  description: string | null;
  naacGrade: string | null;
  nirf: number | null;
  approvals: string[];
  website: string | null;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
}

export interface CollegeListResponse {
  colleges: CollegeSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface PredictorResult {
  college: CollegeSummary;
  closingRank: number;
  chance: string;
}

export interface SavedCollege {
  id: number;
  collegeId: number;
  status: string;
  createdAt: string;
  college: CollegeSummary;
}
