"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersonas } from "@/hooks/use-personas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, User, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PersonasPage() {
  const router = useRouter();
  const { personas, activePersona, loading, deletePersona, setPersonaActive } = usePersonas();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deletePersona(id);
    if (success) {
      // Show success message
    }
    setDeletingId(null);
  };

  const handleSetActive = async (id: string) => {
    await setPersonaActive(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/personas/${id}`);
  };

  const handleCreate = () => {
    router.push("/personas/new");
  };

  if (loading && personas.length === 0) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Your Personas</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Personas</h1>
        <Button onClick={handleCreate}>Create New Persona</Button>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-10">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No personas yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first persona to start exploring tax scenarios.
          </p>
          <Button className="mt-4" onClick={handleCreate}>
            Create Your First Persona
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="relative">
              {activePersona?.id === persona.id && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Active
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{persona.icon || "👤"}</span>
                  <CardTitle>{persona.name}</CardTitle>
                </div>
                <CardDescription>{persona.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span>{persona.currentAge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income:</span>
                    <span>{formatCurrency(persona.currentIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wealth:</span>
                    <span>{formatCurrency(persona.currentWealth)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(persona.id!)}
                    title="Lebenseinkommen bearbeiten"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(persona.id!)}
                    disabled={deletingId === persona.id || personas.length === 1}
                    title={personas.length === 1 ? "Kann nicht die einzige Persona löschen" : "Persona löschen"}
                  >
                    {deletingId === persona.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {activePersona?.id !== persona.id && (
                  <Button
                    variant="secondary"
                    onClick={() => handleSetActive(persona.id!)}
                    className="ml-auto"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Set Active
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}