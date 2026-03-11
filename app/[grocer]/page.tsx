import { notFound } from "next/navigation";
import { getGrocer, getAllGrocerIds } from "@/lib/grocer-data";
import GrocerPageClient from "@/components/GrocerPageClient";

export async function generateStaticParams() {
  return getAllGrocerIds().map((id) => ({ grocer: id }));
}

export async function generateMetadata({ params }: { params: Promise<{ grocer: string }> }) {
  const { grocer: grocerParam } = await params;
  const grocer = getGrocer(grocerParam);
  if (!grocer) return {};
  return {
    title: `${grocer.shortName} | Self-Service Excellence Benchmark`,
    description: `Personalized SSEB insights for ${grocer.name} — The 6 Thematic Provocations tailored to your competitive context.`,
  };
}

export default async function GrocerPage({ params }: { params: Promise<{ grocer: string }> }) {
  const { grocer: grocerParam } = await params;
  const grocer = getGrocer(grocerParam);
  if (!grocer) notFound();
  return <GrocerPageClient grocer={grocer} />;
}
