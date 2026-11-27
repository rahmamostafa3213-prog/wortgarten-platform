import Header from "@/components/Header";
import PracticeRunner from "@/components/PracticeRunner";
import { notFound } from "next/navigation";

const KINDS = ["artikel", "konjugation", "perfekt", "kasus", "satzbau"];
export function generateStaticParams() { return KINDS.map((kind) => ({ kind })); }
export default async function Page({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!KINDS.includes(kind)) notFound();
  return (<><Header /><PracticeRunner kind={kind as never} /></>);
}
