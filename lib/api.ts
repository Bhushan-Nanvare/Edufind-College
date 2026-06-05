import type {
  CollegeDetail,
  CollegeListResponse,
  PredictorResult,
  SavedCollege,
} from "@/lib/types";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function listColleges(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  return fetchJson<CollegeListResponse>(`/api/colleges?${search.toString()}`);
}

export function getCollegeStates() {
  return fetchJson<string[]>("/api/colleges/states");
}

export function getCollegeById(id: string) {
  return fetchJson<CollegeDetail>(`/api/colleges/${id}`);
}

export function compareColleges(ids: string) {
  return fetchJson<CollegeDetail[]>(`/api/colleges/compare?ids=${encodeURIComponent(ids)}`);
}

export function predictColleges(params: { exam: string; rank: number; category: string }) {
  const search = new URLSearchParams({
    exam: params.exam,
    rank: String(params.rank),
    category: params.category,
  });
  return fetchJson<PredictorResult[]>(`/api/predictor?${search.toString()}`);
}

export function getSavedColleges() {
  return fetchJson<SavedCollege[]>("/api/saved");
}

export function saveCollege(collegeId: number) {
  return fetchJson<SavedCollege>("/api/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collegeId }),
  });
}

export function updateSavedStatus(id: number, status: string) {
  return fetchJson<SavedCollege>(`/api/saved/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function removeSavedCollege(id: number) {
  return fetch(`/api/saved/${id}`, { method: "DELETE" });
}

export function submitReview(data: { collegeId: number; rating: number; text: string }) {
  return fetchJson<{ id: number }>("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function registerUser(data: { name: string; email: string; password: string }) {
  return fetchJson<{ user: { id: number; name: string; email: string } }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
