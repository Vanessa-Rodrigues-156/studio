'use server'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const columns = await prisma.column.findMany();
    const tasks = await prisma.task.findMany();

    return NextResponse.json({ columns, tasks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { sourceColumnId, destinationColumnId, sourceTaskIds, destinationTaskIds } = await req.json();

    await prisma.column.update({
      where: { id: sourceColumnId },
      data: { taskIds: sourceTaskIds },
    });

    await prisma.column.update({
      where: { id: destinationColumnId },
      data: { taskIds: destinationTaskIds },
    });

    return NextResponse.json({ message: "Columns updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update columns" }, { status: 500 });
  }
}