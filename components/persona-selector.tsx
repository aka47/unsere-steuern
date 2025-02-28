"use client";

import { useState } from "react";
import { usePersonas } from "@/hooks/use-personas";
import { Persona } from "@/types/persona";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, User } from "lucide-react";

export function PersonaSelector() {
  const { personas, activePersona, loading, setPersonaActive } = usePersonas();
  const [open, setOpen] = useState(false);

  const handleSelect = async (persona: Persona) => {
    if (persona.id && persona.id !== activePersona?.id) {
      await setPersonaActive(persona.id);
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            disabled={loading}
          >
            {activePersona ? (
              <div className="flex items-center gap-2">
                {activePersona.icon ? (
                  <span>{activePersona.icon}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="truncate">{activePersona.name}</span>
              </div>
            ) : (
              "Select persona"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search personas..." />
            <CommandList>
              <CommandEmpty>No personas found.</CommandEmpty>
              <CommandGroup>
                {personas.map((persona) => (
                  <CommandItem
                    key={persona.id}
                    value={persona.id}
                    onSelect={() => handleSelect(persona)}
                    className="flex items-center gap-2"
                  >
                    {persona.icon ? (
                      <span>{persona.icon}</span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{persona.name}</span>
                    {activePersona?.id === persona.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          // Navigate to create persona page
          window.location.href = "/personas/new";
        }}
        title="Neue Persona erstellen"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}