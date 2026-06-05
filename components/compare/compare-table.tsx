"use client";

import Link from "next/link";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollegeTypeBadge } from "@/components/shared/college-type-badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCompareStore } from "@/stores/compare-store";
import type { CollegeDetail } from "@/lib/types";

export function CompareTable({ colleges }: { colleges: CollegeDetail[] }) {
  const { remove } = useCompareStore();

  const getLatestPlacement = (college: CollegeDetail) => {
    if (!college.placements?.length) return null;
    return [...college.placements].sort((a, b) => b.year - a.year)[0];
  };

  const renderRow = (
    label: string,
    renderCell: (college: CollegeDetail) => React.ReactNode,
    isHeader = false,
  ) => (
    <tr className={`border-b last:border-0 ${isHeader ? "bg-muted/30" : "hover:bg-muted/10"}`}>
      <th className="sticky left-0 w-48 shrink-0 border-r bg-muted/10 p-4 text-left align-top font-medium text-muted-foreground">
        {label}
      </th>
      {colleges.map((c) => (
        <td key={c.id} className="min-w-[250px] w-1/3 border-r p-4 align-top last:border-0">
          {renderCell(c)}
        </td>
      ))}
      {Array.from({ length: 3 - colleges.length }).map((_, i) => (
        <td key={`empty-${i}`} className="min-w-[250px] w-1/3 border-r bg-muted/5 p-4 last:border-0" />
      ))}
    </tr>
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <th className="sticky left-0 z-10 min-w-[150px] border-b border-r bg-muted/10 p-4" />
            {colleges.map((c) => (
              <td key={c.id} className="relative min-w-[250px] w-1/3 border-b border-r p-6 text-center last:border-r-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(c.id.toString())}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-white p-2 shadow-sm">
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt={c.name} className="object-contain" />
                  ) : (
                    <span className="font-bold text-primary">{c.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <Link href={`/colleges/${c.id}`}>
                  <h3 className="text-base font-bold transition-colors hover:text-primary">{c.name}</h3>
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.city}, {c.state}
                </p>
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <td key={`empty-header-${i}`} className="min-w-[250px] w-1/3 border-b border-r bg-muted/5 p-6 text-center last:border-r-0">
                <Link href="/colleges">
                  <div className="mx-auto mb-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    <Plus className="h-6 w-6" />
                  </div>
                </Link>
                <p className="text-sm font-medium text-muted-foreground">Add College</p>
              </td>
            ))}
          </tr>

          {renderRow("Rating", (c) => (
            <div className="flex justify-center">{c.rating > 0 ? <StarRating rating={c.rating} /> : "-"}</div>
          ))}
          {renderRow("Institution Type", (c) => (
            <div className="flex justify-center">
              <CollegeTypeBadge type={c.type} />
            </div>
          ))}
          {renderRow("Annual Fees", (c) => (
            <div className="text-center font-medium">₹{(c.fees / 100000).toFixed(2)} Lakhs</div>
          ))}
          {renderRow("Exams Accepted", (c) => (
            <div className="flex flex-wrap justify-center gap-1.5">
              {c.examAccepted.map((exam) => (
                <span key={exam} className="rounded-md bg-muted px-2 py-1 text-xs">
                  {exam}
                </span>
              ))}
            </div>
          ))}
          {renderRow("Latest Placement", (c) => {
            const latest = getLatestPlacement(c);
            if (!latest) return <div className="text-center text-muted-foreground">-</div>;
            return (
              <div className="space-y-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="font-semibold text-primary">{latest.avgSalary} LPA</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Highest</p>
                  <p className="font-medium">{latest.highestSalary} LPA</p>
                </div>
              </div>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
