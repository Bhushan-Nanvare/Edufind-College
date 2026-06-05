import { notFound } from "next/navigation";
import { getCollegeDetail } from "@/lib/colleges";
import { CollegeDetailView } from "@/components/college-detail/college-detail-view";

export default async function CollegeDetailPage({ params }: { params: { id: string } }) {
  const college = await getCollegeDetail(params.id);
  if (!college) notFound();
  return <CollegeDetailView college={college} />;
}
