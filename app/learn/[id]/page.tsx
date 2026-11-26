import Header from "@/components/Header";
import UnitView from "@/components/UnitView";
import { content } from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [...new Set(content.units.map((u) => String(u.id)))].map((id) => ({ id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const units = content.units.filter((u) => String(u.id) === id);
  if (!units.length) notFound();
  return (<><Header /><UnitView units={units} /></>);
}
