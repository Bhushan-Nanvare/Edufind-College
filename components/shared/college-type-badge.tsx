import { Badge } from "@/components/ui/badge";

export function CollegeTypeBadge({ type }: { type: string }) {
  const label = type === "GOVERNMENT" ? "Government" : type === "PRIVATE" ? "Private" : "Deemed";
  return <Badge variant="secondary">{label}</Badge>;
}
