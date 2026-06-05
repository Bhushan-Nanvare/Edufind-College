"use client";

import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCollegeStates } from "@/lib/api";

interface CollegeFiltersProps {
  filters: {
    state?: string;
    type?: string;
    maxFees?: number;
    minRating?: number;
    examAccepted?: string;
  };
  setFilter: (key: string, value: string | number | undefined) => void;
  resetFilters: () => void;
}

export function CollegeFilters({ filters, setFilter, resetFilters }: CollegeFiltersProps) {
  const { data: states } = useQuery({ queryKey: ["college-states"], queryFn: getCollegeStates });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>State</Label>
          <Select
            value={filters.state || "all"}
            onValueChange={(val) => setFilter("state", val === "all" ? undefined : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states?.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Institution Type</Label>
          <Select value={filters.type || "all"} onValueChange={(val) => setFilter("type", val === "all" ? undefined : val)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GOVERNMENT">Government</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="DEEMED">Deemed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label>Max Annual Fees</Label>
            <span className="text-sm font-medium">
              {filters.maxFees ? `₹${(filters.maxFees / 100000).toFixed(1)}L` : "Any"}
            </span>
          </div>
          <Slider
            value={[filters.maxFees || 5000000]}
            max={5000000}
            step={50000}
            onValueChange={([val]) => setFilter("maxFees", val === 5000000 ? undefined : val)}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label>Minimum Rating</Label>
          <Select
            value={filters.minRating?.toString() || "all"}
            onValueChange={(val) => setFilter("minRating", val === "all" ? undefined : Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5 & Above</SelectItem>
              <SelectItem value="4">4.0 & Above</SelectItem>
              <SelectItem value="3">3.0 & Above</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Exam Accepted</Label>
          <Select
            value={filters.examAccepted || "all"}
            onValueChange={(val) => setFilter("examAccepted", val === "all" ? undefined : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Exam</SelectItem>
              <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
              <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="CAT">CAT</SelectItem>
              <SelectItem value="MHT_CET">MHT-CET</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
