"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { PredictorForm } from "@/components/predictor/predictor-form";
import { PredictorResults } from "@/components/predictor/predictor-results";
import { predictColleges } from "@/lib/api";

export default function PredictorPage() {
  const [params, setParams] = useState<{ exam: string; rank: number; category: string } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["predictor", params],
    queryFn: () => predictColleges(params!),
    enabled: !!params,
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Target className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">College Admission Predictor</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Enter your exam rank and category to see colleges where you have a realistic chance of admission.
        </p>
      </div>

      <div className="mx-auto mb-12 max-w-4xl rounded-xl border bg-card p-6 shadow-sm">
        <PredictorForm onSubmit={setParams} />
      </div>

      {params && (
        <div className="mx-auto max-w-4xl">
          <PredictorResults results={data} isLoading={isLoading} isError={isError} />
        </div>
      )}
    </div>
  );
}
