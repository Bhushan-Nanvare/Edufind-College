import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-sm text-amber-500">
      <Star className="h-4 w-4 fill-current" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}
