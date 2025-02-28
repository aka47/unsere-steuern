import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PersonaRepository } from "@/lib/repositories/persona-repository";

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

// POST /api/persona - Create a new persona
export async function POST(
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
    const personaData = await request.json();

    // Map income growth type to function
    const incomeGrowthMap: Record<string, (age: number) => number> = {
      fast: (age: number) => (age <= 45 ? 1.05 : 1.02),
      moderate: (age: number) => (age <= 45 ? 1.03 : 1.01),
      slow: (age: number) => (age <= 45 ? 1.02 : 1.0),
      ceo: (age: number) => {
        if (age <= 50) return 1.05;
        if (age <= 60) return 1.2;
        return 1;
      },
      default: (age: number) => (age <= 45 ? 1.02 : 1.0)
    };

    const incomeGrowth = incomeGrowthMap[personaData.incomeGrowthType] || incomeGrowthMap.default;

    const persona = await PersonaRepository.create(
      { ...personaData, incomeGrowth, id: "" },
      session.user.id
    );

    return NextResponse.json(persona);
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { error: "Failed to create persona" },
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

    // Handle income growth function if provided
    let incomeGrowth;
    if (updateData.incomeGrowthType) {
      const incomeGrowthMap: Record<string, (age: number) => number> = {
        fast: (age: number) => (age <= 45 ? 1.05 : 1.02),
        moderate: (age: number) => (age <= 45 ? 1.03 : 1.01),
        slow: (age: number) => (age <= 45 ? 1.02 : 1.0),
        ceo: (age: number) => {
          if (age <= 50) return 1.05;
          if (age <= 60) return 1.2;
          return 1;
        },
        default: (age: number) => (age <= 45 ? 1.02 : 1.0)
      };

      incomeGrowth = incomeGrowthMap[updateData.incomeGrowthType] || incomeGrowthMap.default;
    }

    const persona = await PersonaRepository.update(id, {
      ...updateData,
      ...(incomeGrowth ? { incomeGrowth } : {})
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