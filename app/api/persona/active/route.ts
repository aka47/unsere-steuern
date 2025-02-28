import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PersonaRepository } from "@/lib/repositories/persona-repository";

// GET /api/persona/active - Get the active persona for the current user
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
    const persona = await PersonaRepository.getActiveForUser(session.user.id);

    if (!persona) {
      return NextResponse.json(
        { error: "No active persona found" },
        { status: 404 }
      );
    }

    return NextResponse.json(persona);
  } catch (error) {
    console.error("Error getting active persona:", error);
    return NextResponse.json(
      { error: "Failed to get active persona" },
      { status: 500 }
    );
  }
}

// POST /api/persona/active - Set a persona as active
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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      );
    }

    const persona = await PersonaRepository.setActive(id);

    return NextResponse.json(persona);
  } catch (error) {
    console.error("Error setting active persona:", error);
    return NextResponse.json(
      { error: "Failed to set active persona" },
      { status: 500 }
    );
  }
}