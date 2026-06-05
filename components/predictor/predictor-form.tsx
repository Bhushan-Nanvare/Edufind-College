"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const predictorSchema = z.object({
  exam: z.string().min(1, "Please select an exam"),
  rank: z.coerce.number().positive("Rank must be a positive number"),
  category: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof predictorSchema>;

const EXAM_MAP: Record<string, string> = {
  "JEE Main": "JEE_MAIN",
  "JEE Advanced": "JEE_ADVANCED",
  NEET: "NEET",
  CAT: "CAT",
  "MHT-CET": "MHT_CET",
};

const CATEGORY_MAP: Record<string, string> = {
  General: "GENERAL",
  OBC: "OBC",
  SC: "SC",
  ST: "ST",
};

export function PredictorForm({
  onSubmit,
}: {
  onSubmit: (params: { exam: string; rank: number; category: string }) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(predictorSchema),
    defaultValues: { exam: "", rank: undefined, category: "" },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      exam: EXAM_MAP[data.exam],
      rank: data.rank,
      category: CATEGORY_MAP[data.category],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
        <FormField
          control={form.control}
          name="exam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="JEE Main">JEE Main</SelectItem>
                  <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
                  <SelectItem value="NEET">NEET</SelectItem>
                  <SelectItem value="CAT">CAT</SelectItem>
                  <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rank</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 15000" className="h-12 bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="General">General (OPEN)</SelectItem>
                  <SelectItem value="OBC">OBC-NCL</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="h-12 w-full">
          <Target className="mr-2 h-5 w-5" /> Predict Now
        </Button>
      </form>
    </Form>
  );
}
