# Unsere-Steuern.de 🇩🇪

Eine interaktive Web-App zur Visualisierung von Lebenseinkommen und Steuerlast in Deutschland.

## Über das Projekt

Unsere-Steuern.de hilft Menschen zu verstehen, wie sich ihr Einkommen, Vermögen und ihre Steuerlast über ihr Arbeitsleben entwickeln. Durch verschiedene Personas und einen interaktiven Rechner können Nutzer:innen:

- Verschiedene Lebenswege und deren finanzielle Auswirkungen erkunden
- Ihre persönliche Steuerbelastung berechnen
- Vermögensaufbau über die Zeit visualisieren
- Auswirkungen von Erbschaften verstehen

## Technischer Stack

- **Framework**: [Next.js 14](https://nextjs.org/) mit App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/react)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

```bash
# Repository klonen
git clone https://github.com/TimAssmann/unsere-steuern.de.git

# Ins Projektverzeichnis wechseln
cd unsere-steuern.de

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Beitragen

Wir freuen uns über Beiträge! So kannst du mitmachen:

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Entwicklungsrichtlinien

- Schreibe Tests für neue Features
- Folge dem funktionalen React-Paradigma
- Nutze TypeScript für type safety
- Formatiere deinen Code mit Prettier
- Folge den ESLint-Regeln des Projekts

### Testen

```bash
# Unit Tests ausführen
npm test

# Tests im Watch Mode
npm run test:watch
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE.md](LICENSE.md)

## Danksagung

- [Next.js](https://nextjs.org/) für das großartige Framework
- [Vercel](https://vercel.com/) für das Hosting
- [shadcn/ui](https://ui.shadcn.com/) für die UI Components
- Allen Contributor:innen für ihre Unterstützung
