"use client";

import Link from "next/link";
import { MapPin, IndianRupee, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollegeTypeBadge } from "@/components/shared/college-type-badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCompareStore } from "@/stores/compare-store";
import type { CollegeSummary } from "@/lib/types";

export function CollegeCard({ college }: { college: CollegeSummary }) {
  const { add, isInCompare } = useCompareStore();
  const inCompare = isInCompare(college.id.toString());

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/colleges/${college.id}`}>
              <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                {college.name}
              </h3>
            </Link>
            <div className="mt-1 flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {college.city}, {college.state}
            </div>
          </div>
          <Avatar className="h-12 w-12 border bg-white">
            <AvatarImage src={college.logoUrl || undefined} alt={college.name} className="object-contain p-1" />
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {college.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-5 pt-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <CollegeTypeBadge type={college.type} />
          {college.rating > 0 && <StarRating rating={college.rating} />}
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <p className="mb-0.5 text-xs text-muted-foreground">Fees (Annual)</p>
            <p className="flex items-center font-medium">
              <IndianRupee className="mr-0.5 h-3 w-3" />
              {(college.fees / 100000).toFixed(2)} Lakhs
            </p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-muted-foreground">Exams Accepted</p>
            <p className="truncate font-medium" title={college.examAccepted.join(", ")}>
              {college.examAccepted.slice(0, 2).join(", ")}
              {college.examAccepted.length > 2 && " +"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center gap-3 border-t p-5 pt-0">
        <Button
          variant={inCompare ? "secondary" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => add(college.id.toString())}
          disabled={inCompare}
        >
          {inCompare ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Added
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Compare
            </>
          )}
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link href={`/colleges/${college.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
