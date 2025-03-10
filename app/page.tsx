import { TaxHero } from "@/components/ui/animated-hero"

export default function Home() {
  return (
    <main>
      <TaxHero />
      <div className="fixxed sbottom-0 left-1/2 -stranslate-x-1/2 mx-auto w-2/3 mb-12 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-3">
          Wir fordern volle Transparenz!
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300">
          Die verwendeten Zahlen in diesem Steuer Rechner sind das beste was wir heute haben, leider.
          <br />
          Sie entsprechen nicht den Ansprüchen die jedes Unternehmen seinen Geldgebern gegenüber erfüllen muss.
          Dieser Rechner kann deshalb nicht die Transparenz und Klarheit liefern, die möglich und geboten ist bei einem so wichtigen Thema.
          <br /><br />
          Kein Investor würde sein Geld in einem Unternehmen investieren, ohne nicht diese Zahlen im Detail zu kennen. <br />
          Als Bürger und Wähler sollten wir das auch.
        </p>
      </div>
    </main>
  )
}

