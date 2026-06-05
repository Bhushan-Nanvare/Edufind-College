"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationTracker } from "@/components/saved/application-tracker";
import { getSavedColleges } from "@/lib/api";
import type { SavedCollege } from "@/lib/types";

export default function SavedPage() {
  const { data: session, status } = useSession();

  const { data: savedColleges, isLoading } = useQuery({
    queryKey: ["saved-colleges"],
    queryFn: getSavedColleges,
    enabled: !!session?.user,
  });

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <LockKeyhole className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Sign in to view saved colleges</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Create an account to save colleges, track your application status, and keep everything in one place.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto animate-pulse space-y-8 px-4 py-12">
        <div className="h-10 w-1/4 rounded bg-muted" />
        <div className="h-[400px] rounded-xl bg-muted" />
      </div>
    );
  }

  if (!savedColleges?.length) {
    return (
      <div className="container mx-auto flex flex-col items-center bg-muted/10 px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Bookmark className="h-10 w-10 text-primary opacity-50" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Your list is empty</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Start exploring colleges and click save to add them to your tracking board.
        </p>
        <Button asChild size="lg">
          <Link href="/colleges">Browse Colleges</Link>
        </Button>
      </div>
    );
  }

  const grouped: Record<string, SavedCollege[]> = {
    INTERESTED: savedColleges.filter((c) => c.status === "INTERESTED"),
    APPLIED: savedColleges.filter((c) => c.status === "APPLIED"),
    GOT_ADMIT: savedColleges.filter((c) => c.status === "GOT_ADMIT"),
    REJECTED: savedColleges.filter((c) => c.status === "REJECTED"),
  };

  const labels: Record<string, string> = {
    INTERESTED: "Interested",
    APPLIED: "Applied",
    GOT_ADMIT: "Got Admit",
    REJECTED: "Rejected",
  };

  return (
    <div className="min-h-screen bg-muted/10 py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Saved Applications</h1>
          <p className="mt-2 text-muted-foreground">Track your college application journey</p>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(
            ([status, items]) =>
              items.length > 0 && (
                <section key={status}>
                  <h2 className="mb-4 text-lg font-semibold">
                    {labels[status]} ({items.length})
                  </h2>
                  <ApplicationTracker items={items} />
                </section>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
