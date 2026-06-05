"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Award, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollegeCard } from "@/components/colleges/college-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { listColleges } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["colleges", { limit: 6 }],
    queryFn: () => listColleges({ limit: 6, page: 1 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground lg:py-32">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Find the perfect college for your future
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              Discover, compare, and get predicted admissions for top engineering, medical, and management colleges across India.
            </p>
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex w-full max-w-2xl items-center space-x-2 rounded-lg bg-background p-2 shadow-lg"
            >
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for colleges, exams, or courses..."
                className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
          <FeatureCard
            icon={<Search className="h-8 w-8 text-primary" />}
            title="Smart Discovery"
            description="Filter thousands of colleges by fees, location, exams accepted, and rankings to find your match."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-primary" />}
            title="Rank Predictor"
            description="Enter your JEE/NEET rank and category to predict your admission chances at top institutions."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-primary" />}
            title="Side-by-side Compare"
            description="Compare up to 3 colleges simultaneously across fees, placements, and infrastructure."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Popular Colleges</h2>
              <p className="mt-2 text-muted-foreground">Most searched institutions this week</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/colleges">
                View all <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : data?.colleges?.length
                ? data.colleges.map((college) => <CollegeCard key={college.id} college={college} />)
                : (
                  <p className="col-span-full py-10 text-center text-muted-foreground">No colleges found.</p>
                )}
          </div>

          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/colleges">View all colleges</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 rounded-lg bg-primary/10 p-3">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
