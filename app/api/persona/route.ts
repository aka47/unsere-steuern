"use server"

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PersonaRepository } from "@/lib/repositories/persona-repository";
import { z } from "zod";

// GET /api/persona - Get all personas for the current user
export async function GET(
  _req: NextRequest
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const personas = await PersonaRepository.getAllForUser(session.user.id);
    return NextResponse.json(personas);
  } catch (error) {
    console.error("Error getting personas:", error);
    return NextResponse.json(
      { error: "Failed to get personas" },
      { status: 500 }
    );
  }
}

// Validation schema for persona data
const personaSchema = z.object({
  id: z.string().optional(),
  currentIncome: z.number(),
  currentAge: z.number(),
  savingsRate: z.number(),
  inheritanceAge: z.number().nullable(),
  inheritanceAmount: z.number(),
  yearlySpendingFromWealth: z.number(),
  currentWealth: z.number()
});

// POST /api/persona - Create a new persona
export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = personaSchema.parse(body);

    const persona = validatedData.id
      ? await PersonaRepository.update(validatedData.id, validatedData)
      : await PersonaRepository.create(validatedData, session.user.id);

    return NextResponse.json(persona);
  } catch (error) {
    console.error("Error saving persona:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save persona" },
      { status: 500 }
    );
  }
}

// PUT /api/persona - Update an existing persona
export async function PUT(
  request: NextRequest
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      );
    }

    const persona = await PersonaRepository.update(id, {
      ...updateData,
    });

    return NextResponse.json(persona);
  } catch (error) {
    console.error("Error updating persona:", error);
    return NextResponse.json(
      { error: "Failed to update persona" },
      { status: 500 }
    );
  }
}

// DELETE /api/persona - Delete a persona
export async function DELETE(
  request: NextRequest
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      );
    }

    await PersonaRepository.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting persona:", error);
    return NextResponse.json(
      { error: "Failed to delete persona" },
      { status: 500 }
    );
  }
}