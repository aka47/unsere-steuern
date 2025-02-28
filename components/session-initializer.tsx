"use client";

import { useEffect } from "react";
import { SessionStorage } from "@/lib/session-storage";

/**
 * Component that initializes session storage on the client side
 * This is used to ensure we have default personas for non-authenticated users
 */
export function SessionInitializer() {
  useEffect(() => {
    // Initialize session storage with default personas if empty
    SessionStorage.initializeWithDefaults();
  }, []);

  // This component doesn't render anything
  return null;
}