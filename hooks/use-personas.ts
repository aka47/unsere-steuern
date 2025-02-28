import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Persona } from "@/types/persona";
import { SessionStorage } from "@/lib/session-storage";
import { prisma } from "@/lib/prisma";
import { PersonaRepository } from "@/lib/repositories/persona-repository";

// Shared utility functions
const mapIncomeGrowthTypeToFunction = (type: string): ((age: number) => number) => {
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

/**
 * Hook for managing personas
 * Uses database storage for authenticated users and session storage for non-authenticated users
 */
export function usePersonas() {
  const { data: session, status } = useSession();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Determine if we should use database or session storage
  const useDatabase = status === "authenticated";
  const userId = session?.user?.id;

  // Initialize session storage with defaults if needed
  useEffect(() => {
    if (!isInitialized && typeof window !== "undefined") {
      SessionStorage.initializeWithDefaults();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Database operations
  const dbOperations = {
    fetchPersonas: async () => {
      if (!userId) return [];
      return await PersonaRepository.getAllForUser(userId);
    },

    fetchActivePersona: async () => {
      if (!userId) return null;
      return await PersonaRepository.getActiveForUser(userId);
    },

    createPersona: async (personaData: Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType: string }) => {
      if (!userId) return null;
      // Convert incomeGrowthType to function
      const incomeGrowth = mapIncomeGrowthTypeToFunction(personaData.incomeGrowthType);

      // Create persona with repository
      return await PersonaRepository.create(
        { ...personaData, incomeGrowth, id: "" },
        userId
      );
    },

    updatePersona: async (id: string, updateData: Partial<Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType?: string }>) => {
      if (!userId) return null;
      // Handle income growth function if provided
      let incomeGrowth;
      if (updateData.incomeGrowthType) {
        incomeGrowth = mapIncomeGrowthTypeToFunction(updateData.incomeGrowthType);
      }

      // Update persona with repository
      return await PersonaRepository.update(id, {
        ...updateData,
        ...(incomeGrowth ? { incomeGrowth } : {}),
      });
    },

    deletePersona: async (id: string) => {
      if (!userId) return false;
      await PersonaRepository.delete(id);
      return true;
    },

    setPersonaActive: async (id: string) => {
      if (!userId) return false;
      await PersonaRepository.setActive(id);
      return true;
    }
  };

  // Session storage operations
  const sessionOperations = {
    fetchPersonas: () => {
      return SessionStorage.getPersonas();
    },

    fetchActivePersona: () => {
      return SessionStorage.getActivePersona();
    },

    createPersona: (personaData: Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType: string }) => {
      // Convert incomeGrowthType to function
      const incomeGrowth = mapIncomeGrowthTypeToFunction(personaData.incomeGrowthType);

      // Create persona in session
      const newPersona: Persona = {
        ...personaData,
        id: `temp_${Date.now()}`,
        incomeGrowth,
      };

      return SessionStorage.addPersona(newPersona);
    },

    updatePersona: (id: string, updateData: Partial<Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType?: string }>) => {
      // Handle income growth function if provided
      let incomeGrowth;
      if (updateData.incomeGrowthType) {
        incomeGrowth = mapIncomeGrowthTypeToFunction(updateData.incomeGrowthType);
      }

      // Update persona in session
      return SessionStorage.updatePersona(id, {
        ...updateData,
        ...(incomeGrowth ? { incomeGrowth } : {}),
      });
    },

    deletePersona: (id: string) => {
      return SessionStorage.deletePersona(id);
    },

    setPersonaActive: (id: string) => {
      const persona = SessionStorage.setActivePersona(id);
      return !!persona;
    }
  };

  // Choose the appropriate operations based on authentication status
  const operations = useDatabase ? dbOperations : sessionOperations;

  // Fetch all personas
  const fetchPersonas = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPersonas = await operations.fetchPersonas();
      setPersonas(fetchedPersonas);
      setError(null);
    } catch (err) {
      console.error("Error fetching personas:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch personas");
    } finally {
      setLoading(false);
    }
  }, [operations]);

  // Fetch active persona
  const fetchActivePersona = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedActivePersona = await operations.fetchActivePersona();
      setActivePersona(fetchedActivePersona);
      setError(null);
    } catch (err) {
      console.error("Error fetching active persona:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch active persona");
    } finally {
      setLoading(false);
    }
  }, [operations]);

  // Create a new persona
  const createPersona = useCallback(async (personaData: Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType: string }) => {
    try {
      setLoading(true);
      const newPersona = await operations.createPersona(personaData);

      if (newPersona) {
        // Update local state
        setPersonas(prev => [newPersona, ...prev]);

        // If this is the first persona, set it as active
        if (personas.length === 0) {
          setActivePersona(newPersona);
        }
      }

      setError(null);
      return newPersona;
    } catch (err) {
      console.error("Error creating persona:", err);
      setError(err instanceof Error ? err.message : "Failed to create persona");
      return null;
    } finally {
      setLoading(false);
    }
  }, [operations, personas.length]);

  // Update an existing persona
  const updatePersona = useCallback(async (id: string, updateData: Partial<Omit<Persona, "id" | "incomeGrowth"> & { incomeGrowthType?: string }>) => {
    try {
      setLoading(true);
      const updatedPersona = await operations.updatePersona(id, updateData);

      if (updatedPersona) {
        // Update local state
        setPersonas(prev => prev.map(p => p.id === id ? updatedPersona : p));

        // Update active persona if needed
        if (activePersona?.id === id) {
          setActivePersona(updatedPersona);
        }
      }

      setError(null);
      return updatedPersona;
    } catch (err) {
      console.error("Error updating persona:", err);
      setError(err instanceof Error ? err.message : "Failed to update persona");
      return null;
    } finally {
      setLoading(false);
    }
  }, [operations, activePersona]);

  // Delete a persona
  const deletePersona = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const success = await operations.deletePersona(id);

      if (success) {
        // Update local state
        setPersonas(prev => prev.filter(p => p.id !== id));

        // If the active persona was deleted, fetch the new active persona
        if (activePersona?.id === id) {
          await fetchActivePersona();
        }
      }

      setError(null);
      return success;
    } catch (err) {
      console.error("Error deleting persona:", err);
      setError(err instanceof Error ? err.message : "Failed to delete persona");
      return false;
    } finally {
      setLoading(false);
    }
  }, [operations, activePersona, fetchActivePersona]);

  // Set a persona as active
  const setPersonaActive = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const success = await operations.setPersonaActive(id);

      if (success) {
        // Fetch the updated active persona
        await fetchActivePersona();
      }

      setError(null);
      return success;
    } catch (err) {
      console.error("Error setting active persona:", err);
      setError(err instanceof Error ? err.message : "Failed to set active persona");
      return false;
    } finally {
      setLoading(false);
    }
  }, [operations, fetchActivePersona]);

  // Migrate session personas to database when user logs in
  const migrateSessionPersonasToDatabase = useCallback(async () => {
    if (!useDatabase || !userId) return;

    try {
      const sessionPersonas = SessionStorage.getPersonas();
      const sessionActivePersona = SessionStorage.getActivePersona();

      if (sessionPersonas.length === 0) return;

      // Create each session persona in the database
      for (const persona of sessionPersonas) {
        // Skip if the persona already has a non-temporary ID
        if (!persona.id.startsWith('temp_')) continue;

        // Create the persona in the database
        await dbOperations.createPersona({
          ...persona,
          incomeGrowthType: persona.id === sessionActivePersona?.id ? 'default' : 'default',
        });
      }

      // Fetch updated personas from database
      await fetchPersonas();

      // Set the active persona if needed
      if (sessionActivePersona) {
        // Find the corresponding database persona (might have a different ID now)
        const matchingPersona = personas.find((p: Persona) =>
          p.name === sessionActivePersona.name &&
          p.description === sessionActivePersona.description
        );

        if (matchingPersona) {
          await setPersonaActive(matchingPersona.id);
        }
      }

      // Clear session storage after migration
      SessionStorage.clearPersonas();
    } catch (err) {
      console.error("Error migrating session personas to database:", err);
    }
  }, [useDatabase, userId, dbOperations, fetchPersonas, personas, setPersonaActive]);

  // Load personas and active persona on mount and when session changes
  useEffect(() => {
    if (status === "authenticated" && userId) {
      // When user logs in, migrate session personas to database
      migrateSessionPersonasToDatabase().then(() => {
        // Then fetch from database
        Promise.all([fetchPersonas(), fetchActivePersona()]);
      });
    } else if (status === "unauthenticated") {
      // When not authenticated, fetch from session storage
      fetchPersonas();
      fetchActivePersona();
    }
  }, [status, userId, fetchPersonas, fetchActivePersona, migrateSessionPersonasToDatabase]);

  return {
    personas,
    activePersona,
    loading,
    error,
    fetchPersonas,
    fetchActivePersona,
    createPersona,
    updatePersona,
    deletePersona,
    setPersonaActive,
  };
}