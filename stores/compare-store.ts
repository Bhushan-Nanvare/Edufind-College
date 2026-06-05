import { create } from "zustand";
import { toast } from "sonner";

interface CompareState {
  collegeIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  collegeIds: [],
  add: (id: string) => {
    const current = get().collegeIds;
    if (current.includes(id)) return;
    if (current.length >= 3) {
      toast.error("You can only compare up to 3 colleges at a time.");
      return;
    }
    set({ collegeIds: [...current, id] });
    toast.success("Added to compare list");
  },
  remove: (id: string) => {
    set({ collegeIds: get().collegeIds.filter((existingId) => existingId !== id) });
    toast.success("Removed from compare list");
  },
  clear: () => set({ collegeIds: [] }),
  isInCompare: (id: string) => get().collegeIds.includes(id),
}));
