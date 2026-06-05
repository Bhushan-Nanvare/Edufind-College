"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollegeTypeBadge } from "@/components/shared/college-type-badge";
import type { PredictorResult } from "@/lib/types";

function chanceVariant(chance: string) {
  if (chance === "High Chance") return "default";
  if (chance === "Moderate Chance") return "secondary";
  return "outline";
}

export function PredictorResults({
  results,
  isLoading,
  isError,
}: {
  results?: PredictorResult[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Loading predictions...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        Failed to load predictions. Please try again.
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="rounded-xl border bg-muted/20 p-8 text-center text-muted-foreground">
        No colleges found for your rank. Try a different exam or category.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{results.length} colleges match your profile</p>
      {results.map((result) => (
        <Card key={result.college.id} className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={chanceVariant(result.chance)}>{result.chance}</Badge>
                <CollegeTypeBadge type={result.college.type} />
              </div>
              <Link href={`/colleges/${result.college.id}`} className="text-lg font-bold hover:text-primary">
                {result.college.name}
              </Link>
              <p className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {result.college.city}, {result.college.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Closing Rank</p>
              <p className="text-2xl font-bold text-primary">{result.closingRank.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
