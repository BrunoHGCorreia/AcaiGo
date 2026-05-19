import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const result = leadSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const lead = await prisma.lead.update({
    where: { id: parseInt(id) },
    data: result.data,
  });
  return NextResponse.json(lead);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
