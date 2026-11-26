import Header from "@/components/Header";
import TestRunner from "@/components/TestRunner";
import { notFound } from "next/navigation";

export function generateStaticParams() { return [{ kind: "placement" }, { kind: "A1" }, { kind: "A2" }]; }
export default async function Page({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!["placement", "A1", "A2"].includes(kind)) notFound();
  return (<><Header /><TestRunner kind={kind as "placement" | "A1" | "A2"} /></>);
}
