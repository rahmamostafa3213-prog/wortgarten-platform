import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { videos } from "@/lib/videos";
import { notFound } from "next/navigation";

export function generateStaticParams() { return videos.map((v) => ({ id: String(v.id) })); }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = videos.find((x) => String(x.id) === id);
  if (!v) notFound();
  return (<><Header /><VideoPlayer v={v} /></>);
}
