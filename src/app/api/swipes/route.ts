import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, itemType, itemId, choice } = body;

  if (!sessionId || !itemType || !itemId || !choice) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const swipe = await prisma.swipe.create({
    data: {
      sessionId,
      itemType,
      candidateId: itemType === "candidate" ? itemId : null,
      measureId: itemType === "measure" ? itemId : null,
      choice,
    },
  });

  return NextResponse.json(swipe);
}
