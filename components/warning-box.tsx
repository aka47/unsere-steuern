import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WarningBoxProps {
  header?: string;
  description?: string;
}

export function WarningBox({ header, description }: WarningBoxProps) {
  const headerText = header || "Dieser Steuerrechner ist noch im entstehen!";
  const descriptionText = description || "Die hier dargestellten Berechnungen und Zahlen sind noch nicht vollständig, die Zahlen sind noch nicht 100% korrekt und spiegeln nicht die volle Komplexität des Steuersystems wider. Unser aktuelles Steuersystem, das anhand der Einkommenssteuer zeigt was fair und ausgewogen bedeutet, belastet Arbeitseinkommen stark, während für Vermögenseinkünfte sehr vorteilhaftere Regelungen gelten. Diese Unterschiede in der Besteuerung führen zu einer systematischen Ungleichbehandlung von Arbeits- und Kapitaleinkommen. Was diese gravierende Unterschiede jeden für uns kostet an einem kleinen Vermögen für jede Einkommensteuerzahlende Person, das kann sicher jeder hier für sich ausrechnen.\n\nDie Summe ist noch nicht 100%, aber eines solltet ihr nicht hoffen, das es bedeutend weniger Vermögen wird, welches ihr dafür verschenkt habt.";

  return (
    <Alert variant="destructive" className="my-6 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-800 mb-2">{headerText}</AlertTitle>
      <AlertDescription className="text-yellow-700 whitespace-pre-line">
        {descriptionText}
      </AlertDescription>
    </Alert>
  );
}