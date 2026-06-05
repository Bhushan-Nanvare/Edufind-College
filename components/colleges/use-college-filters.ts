"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCollegeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      state: searchParams.get("state") || undefined,
      city: searchParams.get("city") || undefined,
      minFees: searchParams.get("minFees") ? Number(searchParams.get("minFees")) : undefined,
      maxFees: searchParams.get("maxFees") ? Number(searchParams.get("maxFees")) : undefined,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
      examAccepted: searchParams.get("examAccepted") || undefined,
      type: searchParams.get("type") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    }),
    [searchParams],
  );

  const setFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      if (key !== "page") params.delete("page");
      router.push(`/colleges?${params.toString()}`);
    },
    [router, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.push("/colleges");
  }, [router]);

  const fetchParams = filters;

  return { filters, fetchParams, setFilter, resetFilters };
}
