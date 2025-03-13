"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersonas } from "@/hooks/use-personas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";

export default function NewPersonaPage() {
  const router = useRouter();
  const { createPersona } = usePersonas();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "👤",
    initialAge: 25,
    currentAge: 25,
    currentIncome: 50000,
    currentIncomeFromWealth: 0,
    savingsRate: 0.1,
    inheritanceAge: 0,
    inheritanceAmount: 0,
    inheritanceTaxClass: 1 as 1 | 2 | 3,
    vatRate: 0.19,
    vatApplicableRate: 0.7,
    yearlySpendingFromWealth: 0,
    currentWealth: 10000,
    incomeGrowth: 1.02,
    inheritanceHousing: 0,
    inheritanceCompany: 0,
    inheritanceFinancial: 0,
    inheritanceTaxable: 0,
    inheritanceTax: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newPersona = await createPersona(formData);
      if (newPersona) {
        router.push("/personas");
      } else {
        setError("Failed to create persona");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/personas")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Persona</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Persona Details</CardTitle>
            <CardDescription>
              Erstellen Sie eine neue Persona, um verschiedene Perspektiven zu erkunden
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Symbol</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Use an emoji"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this persona"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentAge">Alter heute</Label>
                <Input
                  id="currentAge"
                  name="currentAge"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.currentAge}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialAge">Alter beim ersten Einkommen</Label>
                <Input
                  id="initialAge"
                  name="initialAge"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.initialAge}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentIncome">heutiges Einkommen pro Jahr (€)</Label>
                <Input
                  id="currentIncome"
                  name="currentIncome"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.currentIncome}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWealth">Vermögen heute (€)</Label>
                <Input
                  id="currentWealth"
                  name="currentWealth"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.currentWealth}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="savingsRate">Sparrate (%)</Label>
              <div className="pt-6">
                <Slider
                  id="savingsRate"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={[formData.savingsRate]}
                  onValueChange={(value) => handleSliderChange("savingsRate", value)}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {Math.round(formData.savingsRate * 100)}%
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeGrowth">Jährliches Einkommenswachstum (%)</Label>
              <div className="pt-6">
                <Slider
                  id="incomeGrowth"
                  min={1}
                  max={1.1}
                  step={0.01}
                  value={[formData.incomeGrowth]}
                  onValueChange={(value) => handleSliderChange("incomeGrowth", value)}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {((formData.incomeGrowth - 1) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inheritanceAge">Alter beim Erbe</Label>
              <Input
                id="inheritanceAge"
                name="inheritanceAge"
                type="number"
                min="0"
                max="100"
                value={formData.inheritanceAge}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inheritanceAmount">erhaltene Erbschaft (€)</Label>
              <Input
                id="inheritanceAmount"
                name="inheritanceAmount"
                type="number"
                min="0"
                step="1000"
                value={formData.inheritanceAmount}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inheritanceTaxClass">Erbschaftssteuerklasse</Label>
              <Select
                value={formData.inheritanceTaxClass.toString()}
                onValueChange={(value) => handleSelectChange("inheritanceTaxClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Klasse 1 (Ehepartner, Kinder)</SelectItem>
                  <SelectItem value="2">Klasse 2 (Geschwister, Nichten, Neffen)</SelectItem>
                  <SelectItem value="3">Klasse 3 (Andere)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/personas")}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Erstellen..." : "Erstellen"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}