import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") || "";

  const where: any = {};
  if (stage && stage !== "Todos") where.stage = stage;

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const lead = await prisma.lead.create({ data: result.data });
  return NextResponse.json(lead, { status: 201 });
}
