"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WarningBox } from "@/components/warning-box"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function DashboardShell() {
  return (
    <div className="flex flex-col bg-zinc-50/40">

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4">


          <WarningBox header="Steuerrechner ist noch im entstehen!"
              description={`Die hier dargestellten Berechnungen und Zahlen sind noch nicht vollständig, die Zahlen sind noch nicht 100% korrekt und spiegeln nicht die volle Komplexität des Steuersystems wider. Unser aktuelles Steuersystem, das anhand der Einkommenssteuer zeigt was fair und ausgewogen bedeutet, belastet Arbeitseinkommen stark, während für Vermögenseinkünfte sehr vorteilhaftere Regelungen gelten. Diese Unterschiede in der Besteuerung führen zu einer systematischen Ungleichbehandlung von Arbeits- und Kapitaleinkommen. Was diese gravierende Unterschiede jeden für uns kostet an einem kleinen Vermögen für jede Einkommensteuerzahlende Person, das kann sicher jeder hier für sich ausrechnen.

              Die Zahlen ist noch nicht 100% korrekt, aber eines solltet ihr nicht hoffen, das es bedeutend weniger Vermögen wird, welches wir verschenken.`} />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Steuerszenarien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Was passiert, wenn wir die Steuern erhöhen oder senken? Vergleichen Sie verschiedene Steuermodelle und ihre Auswirkungen auf unterschiedliche Einkommensgruppen, und die Entwiclung von Wohlstand und Eigentum für die Mehrheit der Menschen in unserem Land.
                </p>
                <div className="mt-4 flex justify-end">
                  <Link href="/steuerszenarien">
                    <Button variant="ghost" className="text-sm">
                      Unsere Gereichtigkeit in Zahlen <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Lebenseinkommen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Berechnen Sie die Entwicklung Ihres Vermögens über Ihr gesamtes Arbeitsleben unter Berücksichtigung von Steuern. Daran können sie sehen, wie stark unsere Steuern heute, oder alternative Vorschläge, ihren Geldbeutel und ihr Vermögensaufbau schmälern oder vereinfachen.
                </p>
                <div className="mt-4 flex justify-end">
                  <Link href="/lebenseinkommen">
                    <Button variant="ghost" className="text-sm">
                      Was ist Ihr Lebenseinkommen? <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Einkommens, Vermögens und Steuerverteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Erfahren Sie, wie sich die Steuerlast, Einkommen und Vermögen auf verschiedene Bevölkerungsgruppen verteilt. Wer trägt wie viel der Steuerlast, wie gerecht ist die Verteilung und wie genau sieht diese Verteilung in Zahlen aus?
                </p>
                <div className="mt-4 flex justify-end">
                  <Link href="/steuern">
                    <Button variant="ghost" className="text-sm">
                      Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

