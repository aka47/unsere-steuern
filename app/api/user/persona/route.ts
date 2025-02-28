import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch a user's persona
export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId from query params
    const activePersona = session.user.personas?.active

    // Use type assertion to access the personaId field

    return NextResponse.json(activePersona);
  } catch (error) {
    console.error("Error fetching persona:", error);
    return NextResponse.json(
      { error: "Error fetching persona" },
      { status: 500 }
    );
  }
}

// POST: Update a user's persona
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, personaId } = await request.json();

    // Ensure the user is only updating their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { activePersonaId: personaId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating persona:", error);
    return NextResponse.json(
      { error: "Error updating persona" },
      { status: 500 }
    );
  }
}

// DELETE: Clear a user's persona
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    // Ensure the user is only updating their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { activePersonaId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing persona:", error);
    return NextResponse.json(
      { error: "Error clearing persona" },
      { status: 500 }
    );
  }
}