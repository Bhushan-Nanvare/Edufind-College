"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSavedStatus } from "@/lib/api";
import type { SavedCollege } from "@/lib/types";

const STATUSES = [
  { value: "INTERESTED", label: "Interested" },
  { value: "APPLIED", label: "Applied" },
  { value: "GOT_ADMIT", label: "Got Admit" },
  { value: "REJECTED", label: "Rejected" },
];

export function ApplicationTracker({ items }: { items: SavedCollege[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateSavedStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-colleges"] }),
  });

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href={`/colleges/${item.collegeId}`} className="text-lg font-bold hover:text-primary">
                {item.college.name}
              </Link>
              <p className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {item.college.city}, {item.college.state}
              </p>
            </div>
            <Select
              value={item.status}
              onValueChange={(status) => mutation.mutate({ id: item.id, status })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
