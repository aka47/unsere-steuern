import { prisma } from "@/lib/prisma";
import type { Persona as PersonaType } from "@/types/persona";

// Helper function to convert yearly overrides to JSON
const yearlyOverridesToJson = (yearlyOverrides?: { age: number; income: number; wealth: number }[]) => {
  if (!yearlyOverrides) return null;
  return JSON.stringify(yearlyOverrides);
};

// Helper function to parse yearly overrides from JSON
const parseYearlyOverrides = (json: string | null) => {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as { age: number; income: number; wealth: number }[];
  } catch (e) {
    console.error("Error parsing yearly overrides:", e);
    return undefined;
  }
};

// Helper function to map income growth type to function
const getIncomeGrowthFunction = (type: string) => {
  switch (type) {
    case "fast":
      return (age: number) => (age <= 45 ? 1.05 : 1.02);
    case "moderate":
      return (age: number) => (age <= 45 ? 1.03 : 1.01);
    case "slow":
      return (age: number) => (age <= 45 ? 1.02 : 1.0);
    case "ceo":
      return (age: number) => {
        if (age <= 50) return 1.05;
        if (age <= 60) return 1.2;
        return 1;
      };
    default:
      return (age: number) => (age <= 45 ? 1.02 : 1.0);
  }
};

// Convert DB Persona to application Persona
const mapToPersona = (dbPersona: Record<string, unknown>): PersonaType => {
  return {
    id: dbPersona.id as string,
    name: dbPersona.name as string,
    description: dbPersona.description as string,
    icon: dbPersona.icon as string,
    initialAge: dbPersona.initialAge as number,
    currentAge: dbPersona.currentAge as number,
    currentIncome: dbPersona.currentIncome as number,
    currentIncomeFromWealth: dbPersona.currentIncomeFromWealth as number,
    savingsRate: dbPersona.savingsRate as number,
    inheritanceAge: dbPersona.inheritanceAge as number | null,
    inheritanceAmount: dbPersona.inheritanceAmount as number,
    inheritanceTaxClass: dbPersona.inheritanceTaxClass as 1 | 2 | 3,
    vatRate: dbPersona.vatRate as number,
    vatApplicableRate: dbPersona.vatApplicableRate as number,
    incomeGrowth: getIncomeGrowthFunction(dbPersona.incomeGrowthType as string),
    yearlySpendingFromWealth: dbPersona.yearlySpendingFromWealth as number,
    currentWealth: dbPersona.currentWealth as number,
    yearlyOverrides: parseYearlyOverrides(dbPersona.yearlyOverridesJson as string | null),
  };
};

// Convert application Persona to DB Persona
const mapToDbPersona = (persona: PersonaType, userId: string) => {
  // Determine income growth type based on the function
  let incomeGrowthType = "default";

  // This is a simplistic approach - in a real app, you might want a more robust way to identify functions
  const growth25 = persona.incomeGrowth(25);
  const growth50 = persona.incomeGrowth(50);
  const growth60 = persona.incomeGrowth(60);

  if (growth25 === 1.05 && growth50 === 1.05 && growth60 === 1.2) {
    incomeGrowthType = "ceo";
  } else if (growth25 === 1.05 && growth50 === 1.02) {
    incomeGrowthType = "fast";
  } else if (growth25 === 1.03 && growth50 === 1.01) {
    incomeGrowthType = "moderate";
  } else if (growth25 === 1.02 && growth50 === 1.0) {
    incomeGrowthType = "slow";
  }

  return {
    userId,
    name: persona.name,
    description: persona.description,
    icon: persona.icon,
    initialAge: persona.initialAge,
    currentAge: persona.currentAge,
    currentIncome: persona.currentIncome,
    currentIncomeFromWealth: persona.currentIncomeFromWealth,
    savingsRate: persona.savingsRate,
    inheritanceAge: persona.inheritanceAge,
    inheritanceAmount: persona.inheritanceAmount,
    inheritanceTaxClass: persona.inheritanceTaxClass,
    vatRate: persona.vatRate,
    vatApplicableRate: persona.vatApplicableRate,
    yearlySpendingFromWealth: persona.yearlySpendingFromWealth,
    currentWealth: persona.currentWealth,
    yearlyOverridesJson: yearlyOverridesToJson(persona.yearlyOverrides),
    incomeGrowthType,
  };
};

export const PersonaRepository = {
  // Get all personas for a user
  async getAllForUser(userId: string): Promise<PersonaType[]> {
    const personas = await prisma.persona.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return personas.map(mapToPersona);
  },

  // Get a specific persona by ID
  async getById(id: string): Promise<PersonaType | null> {
    const persona = await prisma.persona.findUnique({
      where: { id },
    });

    if (!persona) return null;
    return mapToPersona(persona);
  },

  // Get the active persona for a user
  async getActiveForUser(userId: string): Promise<PersonaType | null> {
    // First check if user has an activePersonaId
    const _user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If no active persona ID or persona not found, get the first persona marked as active
    const activePersona = await prisma.persona.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (activePersona) return mapToPersona(activePersona);

    // If no active persona, get the first persona
    const firstPersona = await prisma.persona.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    if (firstPersona) return mapToPersona(firstPersona);

    return null;
  },

  // Create a new persona
  async create(persona: PersonaType, userId: string): Promise<PersonaType> {
    const dbPersona = mapToDbPersona(persona, userId);

    // Check if this is the first persona for the user
    const personaCount = await prisma.persona.count({
      where: { userId },
    });

    // If it's the first persona, mark it as active
    const dataWithActive = {
      ...dbPersona,
      isActive: personaCount === 0
    };

    const createdPersona = await prisma.persona.create({
      data: dataWithActive,
    });

    // If it's the first persona, update the user's activePersonaId
    if (personaCount === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { activePersonaId: createdPersona.id },
      });
    }

    return mapToPersona(createdPersona);
  },

  // Update an existing persona
  async update(id: string, persona: Partial<PersonaType>): Promise<PersonaType> {
    const existingPersona = await prisma.persona.findUnique({
      where: { id },
    });

    if (!existingPersona) {
      throw new Error(`Persona with ID ${id} not found`);
    }

    // Create update data with only the fields that are provided
    const updateData: Record<string, unknown> = {};

    if (persona.name !== undefined) updateData.name = persona.name;
    if (persona.description !== undefined) updateData.description = persona.description;
    if (persona.icon !== undefined) updateData.icon = persona.icon;
    if (persona.initialAge !== undefined) updateData.initialAge = persona.initialAge;
    if (persona.currentAge !== undefined) updateData.currentAge = persona.currentAge;
    if (persona.currentIncome !== undefined) updateData.currentIncome = persona.currentIncome;
    if (persona.currentIncomeFromWealth !== undefined) updateData.currentIncomeFromWealth = persona.currentIncomeFromWealth;
    if (persona.savingsRate !== undefined) updateData.savingsRate = persona.savingsRate;
    if (persona.inheritanceAge !== undefined) updateData.inheritanceAge = persona.inheritanceAge;
    if (persona.inheritanceAmount !== undefined) updateData.inheritanceAmount = persona.inheritanceAmount;
    if (persona.inheritanceTaxClass !== undefined) updateData.inheritanceTaxClass = persona.inheritanceTaxClass;
    if (persona.vatRate !== undefined) updateData.vatRate = persona.vatRate;
    if (persona.vatApplicableRate !== undefined) updateData.vatApplicableRate = persona.vatApplicableRate;
    if (persona.yearlySpendingFromWealth !== undefined) updateData.yearlySpendingFromWealth = persona.yearlySpendingFromWealth;
    if (persona.currentWealth !== undefined) updateData.currentWealth = persona.currentWealth;
    if (persona.yearlyOverrides !== undefined) updateData.yearlyOverridesJson = yearlyOverridesToJson(persona.yearlyOverrides);

    // Handle income growth function
    if (persona.incomeGrowth) {
      // Determine income growth type based on the function
      const growth25 = persona.incomeGrowth(25);
      const growth50 = persona.incomeGrowth(50);
      const growth60 = persona.incomeGrowth(60);

      let incomeGrowthType = "default";

      if (growth25 === 1.05 && growth50 === 1.05 && growth60 === 1.2) {
        incomeGrowthType = "ceo";
      } else if (growth25 === 1.05 && growth50 === 1.02) {
        incomeGrowthType = "fast";
      } else if (growth25 === 1.03 && growth50 === 1.01) {
        incomeGrowthType = "moderate";
      } else if (growth25 === 1.02 && growth50 === 1.0) {
        incomeGrowthType = "slow";
      }

      updateData.incomeGrowthType = incomeGrowthType;
    }

    const updatedPersona = await prisma.persona.update({
      where: { id },
      data: updateData,
    });

    return mapToPersona(updatedPersona);
  },

  // Delete a persona
  async delete(id: string): Promise<void> {
    const persona = await prisma.persona.findUnique({
      where: { id },
      select: { userId: true, isActive: true },
    });

    if (!persona) {
      throw new Error(`Persona with ID ${id} not found`);
    }

    // Delete the persona
    await prisma.persona.delete({
      where: { id },
    });

    // If this was the active persona, update the user's activePersonaId
    if (persona.isActive) {
      // Find another persona to make active
      const anotherPersona = await prisma.persona.findFirst({
        where: { userId: persona.userId },
        orderBy: { createdAt: "asc" },
      });

      if (anotherPersona) {
        // Make this persona active
        await prisma.persona.update({
          where: { id: anotherPersona.id },
          data: { isActive: true },
        });

        // Update the user's activePersonaId
        await prisma.user.update({
          where: { id: persona.userId },
          data: { activePersonaId: anotherPersona.id },
        });
      } else {
        // No other personas, clear the user's activePersonaId
        await prisma.user.update({
          where: { id: persona.userId },
          data: { activePersonaId: null },
        });
      }
    }
  },

  // Set a persona as active
  async setActive(id: string): Promise<PersonaType> {
    const persona = await prisma.persona.findUnique({
      where: { id },
      select: { userId: true, id: true },
    });

    if (!persona) {
      throw new Error(`Persona with ID ${id} not found`);
    }

    // Clear isActive flag on all personas for this user
    await prisma.persona.updateMany({
      where: { userId: persona.userId },
      data: { isActive: false },
    });

    // Set this persona as active
    const updatedPersona = await prisma.persona.update({
      where: { id },
      data: { isActive: true },
    });

    // Update the user's activePersonaId
    await prisma.user.update({
      where: { id: persona.userId },
      data: { activePersonaId: id },
    });

    return mapToPersona(updatedPersona);
  },
};