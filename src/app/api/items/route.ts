import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { SwipeItem, CandidateData, BallotMeasureData } from "@/lib/types";

export async function GET() {
  try {
  const [candidates, measures] = await Promise.all([
    prisma.candidate.findMany({
      include: {
        jurisdiction: true,
        topics: { include: { topic: true } },
        stances: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.ballotMeasure.findMany({
      include: {
        jurisdiction: true,
        topics: { include: { topic: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const items: SwipeItem[] = [];

  for (const c of candidates) {
    const data: CandidateData = {
      id: c.id,
      name: c.name,
      office: c.office,
      party: c.party ?? undefined,
      jurisdiction: {
        id: c.jurisdiction.id,
        name: c.jurisdiction.name,
        abbreviation: c.jurisdiction.abbreviation,
        type: c.jurisdiction.type,
      },
      shortSummary: c.shortSummary,
      longSummary: c.longSummary ?? undefined,
      imageUrl: c.imageUrl ?? undefined,
      websiteUrl: c.websiteUrl ?? undefined,
      electionDate: c.electionDate ?? undefined,
      topics: c.topics.map((ct) => ({
        id: ct.topic.id,
        name: ct.topic.name,
        slug: ct.topic.slug,
        description: ct.topic.description ?? undefined,
        icon: ct.topic.icon ?? undefined,
      })),
      stances: c.stances.map((s) => ({
        id: s.id,
        topic: s.topic,
        position: s.position,
        summary: s.summary,
      })),
    };
    items.push({ type: "candidate", data });
  }

  for (const m of measures) {
    const data: BallotMeasureData = {
      id: m.id,
      title: m.title,
      measureCode: m.measureCode ?? undefined,
      jurisdiction: {
        id: m.jurisdiction.id,
        name: m.jurisdiction.name,
        abbreviation: m.jurisdiction.abbreviation,
        type: m.jurisdiction.type,
      },
      electionDate: m.electionDate ?? undefined,
      category: m.category ?? undefined,
      shortSummary: m.shortSummary,
      longSummary: m.longSummary ?? undefined,
      yesMeans: m.yesMeans ?? undefined,
      noMeans: m.noMeans ?? undefined,
      proArguments: m.proArguments ? JSON.parse(m.proArguments) : undefined,
      conArguments: m.conArguments ? JSON.parse(m.conArguments) : undefined,
      topics: m.topics.map((mt) => ({
        id: mt.topic.id,
        name: mt.topic.name,
        slug: mt.topic.slug,
        description: mt.topic.description ?? undefined,
        icon: mt.topic.icon ?? undefined,
      })),
    };
    items.push({ type: "measure", data });
  }

  // Interleave candidates and measures for variety
  const interleaved = interleave<SwipeItem>(
    items.filter((i): i is SwipeItem & { type: "candidate" } => i.type === "candidate"),
    items.filter((i): i is SwipeItem & { type: "measure" } => i.type === "measure")
  );

  return NextResponse.json(interleaved);
  } catch (error: any) {
    console.error("API /api/items error:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error", stack: error?.stack },
      { status: 500 }
    );
  }
}

function interleave<T>(a: T[], b: T[]): T[] {
  const result: T[] = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}
