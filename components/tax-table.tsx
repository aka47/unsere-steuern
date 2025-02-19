import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const data = [
  {
    group: "Unteres Quintil",
    currentTax: "15%",
    flatTax: "20%",
    progressive: "12%",
    lifetime: "18%",
  },
  {
    group: "Zweites Quintil",
    currentTax: "25%",
    flatTax: "20%",
    progressive: "22%",
    lifetime: "19%",
  },
  {
    group: "Drittes Quintil",
    currentTax: "32%",
    flatTax: "20%",
    progressive: "30%",
    lifetime: "20%",
  },
  {
    group: "Viertes Quintil",
    currentTax: "38%",
    flatTax: "20%",
    progressive: "37%",
    lifetime: "21%",
  },
  {
    group: "Oberes Quintil",
    currentTax: "45%",
    flatTax: "20%",
    progressive: "45%",
    lifetime: "22%",
  },
]

export function TaxTable() {
  return (
    <div className="rounded-lg border border-zinc-200">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-50">
            <TableHead className="font-medium">Einkommensgruppe</TableHead>
            <TableHead className="font-medium text-right">Aktuell</TableHead>
            <TableHead className="font-medium text-right">Flat Tax</TableHead>
            <TableHead className="font-medium text-right">Progressive</TableHead>
            <TableHead className="font-medium text-right">Lebenseinkommen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.group} className="hover:bg-zinc-50">
              <TableCell className="font-medium">{item.group}</TableCell>
              <TableCell className="text-right">{item.currentTax}</TableCell>
              <TableCell className="text-right">{item.flatTax}</TableCell>
              <TableCell className="text-right">{item.progressive}</TableCell>
              <TableCell className="text-right">{item.lifetime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

