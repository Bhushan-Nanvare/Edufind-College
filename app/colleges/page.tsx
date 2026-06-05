"use client";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CollegeCard } from "@/components/colleges/college-card";
import { CollegeFilters } from "@/components/colleges/college-filters";
import { useCollegeFilters } from "@/components/colleges/use-college-filters";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { listColleges } from "@/lib/api";

function CollegeListingContent() {
  const { filters, fetchParams, setFilter, resetFilters } = useCollegeFilters();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["colleges", fetchParams],
    queryFn: () => listColleges(fetchParams),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter("search", searchValue);
  };

  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 pl-10 text-base"
            placeholder="Search colleges, universities, or locations..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 md:hidden">
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetTitle className="sr-only">Filters</SheetTitle>
            <div className="py-4">
              <CollegeFilters filters={filters} setFilter={setFilter} resetFilters={resetFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-xl border bg-card p-5 shadow-sm">
            <CollegeFilters filters={filters} setFilter={setFilter} resetFilters={resetFilters} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{isLoading ? "Searching..." : `${data?.total || 0} Colleges Found`}</h2>
            {isFetching && !isLoading && (
              <span className="animate-pulse text-sm text-muted-foreground">Updating...</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : data?.colleges?.length
                ? data.colleges.map((college) => <CollegeCard key={college.id} college={college} />)
                : (
                  <div className="col-span-full rounded-xl border bg-muted/20 py-20 text-center">
                    <p className="mb-2 text-lg font-medium">No colleges match your criteria</p>
                    <p className="mb-6 text-muted-foreground">Try adjusting your filters or search term.</p>
                    <Button variant="outline" onClick={resetFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
          </div>

          {data && data.total > (filters.limit || 12) && (
            <div className="mt-10 flex justify-center gap-2">
              <Button variant="outline" disabled={filters.page === 1} onClick={() => setFilter("page", (filters.page || 1) - 1)}>
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm font-medium">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={(filters.page || 1) >= totalPages}
                onClick={() => setFilter("page", (filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center">Loading colleges...</div>}>
      <CollegeListingContent />
    </Suspense>
  );
}
