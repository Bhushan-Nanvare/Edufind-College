"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, ExternalLink, Plus, CheckCircle, BookmarkPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollegeTypeBadge } from "@/components/shared/college-type-badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCompareStore } from "@/stores/compare-store";
import { saveCollege } from "@/lib/api";
import type { CollegeDetail } from "@/lib/types";

export function CollegeDetailView({ college }: { college: CollegeDetail }) {
  const { data: session } = useSession();
  const { add, isInCompare } = useCompareStore();
  const queryClient = useQueryClient();
  const inCompare = isInCompare(college.id.toString());

  const saveMutation = useMutation({
    mutationFn: () => saveCollege(college.id),
    onSuccess: () => {
      toast.success("College saved to your list!");
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save college"),
  });

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground">
            <Link href="/colleges">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Colleges
            </Link>
          </Button>

          <div className="flex flex-col gap-6 pb-8 pt-4 md:flex-row md:items-end">
            <Avatar className="h-24 w-24 shrink-0 border-4 border-background bg-white shadow-sm md:h-32 md:w-32">
              <AvatarImage src={college.logoUrl || undefined} alt={college.name} className="object-contain p-2" />
              <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
                {college.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <CollegeTypeBadge type={college.type} />
                {college.rating > 0 && <StarRating rating={college.rating} />}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" /> {college.city}, {college.state}
                </span>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" /> Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 flex shrink-0 flex-row gap-3 md:mt-0 md:flex-col">
              <Button
                variant={inCompare ? "secondary" : "default"}
                size="lg"
                onClick={() => add(college.id.toString())}
                disabled={inCompare}
                className="w-full shadow-sm md:w-auto"
              >
                {inCompare ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Added to Compare
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Compare
                  </>
                )}
              </Button>
              {session?.user && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="w-full bg-background md:w-auto"
                >
                  <BookmarkPlus className="mr-2 h-4 w-4 text-primary" />
                  {saveMutation.isPending ? "Saving..." : "Save College"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 h-12 w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Courses & Fees
            </TabsTrigger>
            <TabsTrigger value="placements" className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Placements
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">About</h3>
              <p className="leading-relaxed text-muted-foreground">
                {college.description || "No description available."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {college.established && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Established</p>
                  <p className="text-xl font-bold">{college.established}</p>
                </div>
              )}
              {college.totalStudents && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-xl font-bold">{college.totalStudents.toLocaleString()}</p>
                </div>
              )}
              {college.campusSize && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Campus</p>
                  <p className="text-xl font-bold">{college.campusSize}</p>
                </div>
              )}
              {college.nirf && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">NIRF Rank</p>
                  <p className="text-xl font-bold">#{college.nirf}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left">Course</th>
                    <th className="p-4 text-left">Duration</th>
                    <th className="p-4 text-right">Annual Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course) => (
                    <tr key={course.id} className="border-t">
                      <td className="p-4 font-medium">{course.name}</td>
                      <td className="p-4">{course.duration} years</td>
                      <td className="p-4 text-right">₹{course.fees.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="placements" className="space-y-4">
            {college.placements.map((p) => (
              <div key={p.id} className="rounded-xl border bg-card p-6 shadow-sm">
                <h4 className="mb-4 font-bold">Placement Statistics ({p.year})</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Package</p>
                    <p className="text-2xl font-bold text-primary">{p.avgSalary} LPA</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Highest Package</p>
                    <p className="text-2xl font-bold">{p.highestSalary} LPA</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Placement Rate</p>
                    <p className="text-2xl font-bold">{p.placementPercent}%</p>
                  </div>
                </div>
                {p.topRecruiters.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.topRecruiters.map((r) => (
                      <span key={r} className="rounded-md bg-muted px-2 py-1 text-xs">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {college.reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              college.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{review.reviewerName}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
