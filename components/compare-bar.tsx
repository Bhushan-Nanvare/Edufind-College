"use client";

import Link from "next/link";
import { BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compare-store";

export function CompareBar() {
  const { collegeIds, remove, clear } = useCompareStore();

  if (collegeIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-background px-4 py-2 shadow-lg">
      <BarChart3 className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">{collegeIds.length} selected</span>
      <div className="flex gap-1">
        {collegeIds.map((id) => (
          <Button key={id} variant="secondary" size="sm" onClick={() => remove(id)}>
            #{id} <X className="ml-1 h-3 w-3" />
          </Button>
        ))}
      </div>
      <Button size="sm" asChild>
        <Link href={`/compare?ids=${collegeIds.join(",")}`}>Compare</Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={clear}>
        Clear
      </Button>
    </div>
  );
}
