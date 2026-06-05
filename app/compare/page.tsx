"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareChart } from "@/components/compare/compare-chart";
import { useCompareStore } from "@/stores/compare-store";
import { compareColleges } from "@/lib/api";

function CompareContent() {
  const searchParams = useSearchParams();
  const { collegeIds } = useCompareStore();

  const idsFromUrl = searchParams.get("ids");
  const ids = idsFromUrl || collegeIds.join(",");

  const { data: colleges, isLoading } = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => compareColleges(ids),
    enabled: ids.length > 0,
  });

  if (!ids) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Plus className="h-10 w-10 text-primary opacity-50" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">No colleges to compare</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Add colleges to your comparison list from the college directory to see them side-by-side.
        </p>
        <Button asChild size="lg">
          <Link href="/colleges">Browse Colleges</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:px-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="-ml-4 mb-4 text-muted-foreground">
          <Link href="/colleges">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Compare Colleges</h1>
        <p className="mt-2 text-muted-foreground">
          Side-by-side comparison of {colleges?.length || ids.split(",").length} institutions
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      ) : colleges && colleges.length > 0 ? (
        <div className="space-y-12">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <CompareTable colleges={colleges} />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold">Annual Fees Comparison</h3>
              <div className="h-[300px]">
                <CompareChart
                  colleges={colleges}
                  dataKey="fees"
                  yAxisLabel="Fees (Lakhs)"
                  formatValue={(v) => `₹${(v / 100000).toFixed(1)}L`}
                />
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold">Average Placement Salary</h3>
              <div className="h-[300px]">
                <CompareChart
                  colleges={colleges}
                  dataKey="avgSalary"
                  yAxisLabel="Salary (LPA)"
                  formatValue={(v) => `${v} LPA`}
                  extractData={(c) => {
                    if (!c.placements?.length) return 0;
                    const latest = [...c.placements].sort((a, b) => b.year - a.year)[0];
                    return latest.avgSalary;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-destructive">Error loading comparison data.</div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
