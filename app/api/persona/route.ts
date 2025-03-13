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
  name: z.string().default("Standard Profile"),
  description: z.string().default("Ein durchschnittliches Profil mit typischen Werten"),
  icon: z.string().default("👤"),
  initialAge: z.number().default(20),
  currentAge: z.number(),
  currentIncome: z.number(),
  currentIncomeFromWealth: z.number().default(0),
  savingsRate: z.number(),
  inheritanceAge: z.number().nullable(),
  inheritanceAmount: z.number(),
  inheritanceTaxClass: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  vatRate: z.number().default(19),
  vatApplicableRate: z.number().default(70),
  incomeGrowth: z.number().default(1.02),
  yearlySpendingFromWealth: z.number(),
  currentWealth: z.number(),
  inheritanceHousing: z.number().default(0),
  inheritanceCompany: z.number().default(0),
  inheritanceFinancial: z.number().default(0),
  inheritanceTaxable: z.number().default(0),
  inheritanceTax: z.number().default(0),
  yearlyOverrides: z.array(z.object({
    age: z.number(),
    income: z.number(),
    wealth: z.number()
  })).optional()
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

    // If updating existing persona
    if (validatedData.id) {
      const updatedPersona = await PersonaRepository.update(validatedData.id, validatedData);
      return NextResponse.json(updatedPersona);
    }

    // If creating new persona, generate a unique ID
    const newPersona = {
      ...validatedData,
      id: crypto.randomUUID()
    };

    const createdPersona = await PersonaRepository.create(newPersona, session.user.id);
    return NextResponse.json(createdPersona);

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