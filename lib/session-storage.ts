"use client";

import { Persona, defaultPersona } from "@/types/persona";

// Session storage keys
const SESSION_PERSONAS_KEY = "umsteuern_personas";
const SESSION_ACTIVE_PERSONA_KEY = "umsteuern_active_persona";

/**
 * Utility for managing session-based storage of personas
 */
export const SessionStorage = {
  /**
   * Get all personas from session storage
   */
  getPersonas: (): Persona[] => {
    if (typeof window === "undefined") return [];

    try {
      const storedPersonas = localStorage.getItem(SESSION_PERSONAS_KEY);
      if (!storedPersonas) return [];

      return JSON.parse(storedPersonas);
    } catch (error) {
      console.error("Error retrieving personas from session:", error);
      return [];
    }
  },

  /**
   * Save personas to session storage
   */
  savePersonas: (personas: Persona[]): void => {
    if (typeof window === "undefined") return;

    try {
      const storedPersonas = personas.map(persona => ({
        ...persona,
        // Directly store incomeGrowth as it is
      }));

      localStorage.setItem(SESSION_PERSONAS_KEY, JSON.stringify(storedPersonas));
    } catch (error) {
      console.error("Error saving personas to session:", error);
    }
  },

  /**
   * Get active persona from session storage
   */
  getActivePersona: (): Persona | null => {
    if (typeof window === "undefined") return null;

    try {
      const storedActivePersona = localStorage.getItem(SESSION_ACTIVE_PERSONA_KEY);
      if (!storedActivePersona) return null;

      const activePersona = JSON.parse(storedActivePersona);

      return activePersona;
    } catch (error) {
      console.error("Error retrieving active persona from session:", error);
      return null;
    }
  },

  /**
   * Save active persona to session storage
   */
  saveActivePersona: (persona: Persona | null): void => {
    if (typeof window === "undefined") return;

    try {
      if (!persona) {
        localStorage.removeItem(SESSION_ACTIVE_PERSONA_KEY);
        return;
      }

      const storedPersona = {
        ...persona,
        // Directly store incomeGrowth as it is
      };

      localStorage.setItem(SESSION_ACTIVE_PERSONA_KEY, JSON.stringify(storedPersona));
    } catch (error) {
      console.error("Error saving active persona to session:", error);
    }
  },

  /**
   * Add a persona to session storage
   */
  addPersona: (persona: Persona): Persona => {
    const personas = SessionStorage.getPersonas();

    // Generate a temporary ID if none exists
    const newPersona = {
      ...persona,
      id: persona.id || `temp_${Date.now()}`,
    };

    // Add to the list
    personas.unshift(newPersona);
    SessionStorage.savePersonas(personas);

    // If this is the first persona, make it active
    if (personas.length === 1) {
      SessionStorage.saveActivePersona(newPersona);
    }

    return newPersona;
  },

  /**
   * Update a persona in session storage
   */
  updatePersona: (id: string, updates: Partial<Persona>): Persona | null => {
    const personas = SessionStorage.getPersonas();
    const index = personas.findIndex(p => p.id === id);

    if (index === -1) return null;

    // Update the persona
    const updatedPersona = {
      ...personas[index],
      ...updates,
    };

    personas[index] = updatedPersona;
    SessionStorage.savePersonas(personas);

    // Update active persona if needed
    const activePersona = SessionStorage.getActivePersona();
    if (activePersona && activePersona.id === id) {
      SessionStorage.saveActivePersona(updatedPersona);
    }

    return updatedPersona;
  },

  /**
   * Delete a persona from session storage
   */
  deletePersona: (id: string): boolean => {
    const personas = SessionStorage.getPersonas();
    const filteredPersonas = personas.filter(p => p.id !== id);

    if (filteredPersonas.length === personas.length) {
      return false; // Persona not found
    }

    SessionStorage.savePersonas(filteredPersonas);

    // Update active persona if needed
    const activePersona = SessionStorage.getActivePersona();
    if (activePersona && activePersona.id === id) {
      // Set a new active persona if available, otherwise null
      SessionStorage.saveActivePersona(filteredPersonas.length > 0 ? filteredPersonas[0] : null);
    }

    return true;
  },

  /**
   * Set a persona as active in session storage
   */
  setActivePersona: (id: string): Persona | null => {
    const personas = SessionStorage.getPersonas();
    const persona = personas.find(p => p.id === id);

    if (!persona) return null;

    SessionStorage.saveActivePersona(persona);
    return persona;
  },

  /**
   * Clear all personas from session storage
   */
  clearPersonas: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(SESSION_PERSONAS_KEY);
    localStorage.removeItem(SESSION_ACTIVE_PERSONA_KEY);
  },

  /**
   * Initialize session with default personas if empty
   */
  initializeWithDefaults: (): void => {
    const personas = SessionStorage.getPersonas();

    if (personas.length === 0) {
      // Create a default persona
      const defaultSessionPersona = {
        ...defaultPersona,
        id: `temp_${Date.now()}`,
      };

      SessionStorage.savePersonas([defaultSessionPersona]);
      SessionStorage.saveActivePersona(defaultSessionPersona);
    }
  },
};