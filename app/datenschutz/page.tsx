"use client"

import { PageHeader } from "@/components/ui/page-header"

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Datenschutzerklärung"
        subtitle="Informationen zum Schutz Ihrer persönlichen Daten"
      />
      <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl mx-0">
        <section className="space-y-4">
          <p className="text-muted-foreground">Stand: {new Date().toLocaleDateString('de-DE')}</p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Verantwortlicher</h3>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <p className="font-medium">
              Tim Assmann<br />
              Glogauer Strasse 11a<br />
              10999 Berlin<br />
              Deutschland
            </p>
            <p>
              E-Mail: <a href="mailto:info@kapitalismusfueralle.de" className="text-primary hover:underline">info@kapitalismusfueralle.de</a><br />
              Website: <a href="https://www.kapitalismusfueralle.de" className="text-primary hover:underline">www.kapitalismusfueralle.de</a>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Erhebung und Verarbeitung personenbezogener Daten</h3>
            <p>
              Wir erheben und verarbeiten folgende personenbezogene Daten von Ihnen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>E-Mail-Adresse</li>
              <li>Nickname/Benutzername</li>
              <li>Steuer- und Einkommensdaten</li>
            </ul>
            <p>
              Diese Daten werden ausschließlich für folgende Zwecke verarbeitet:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bereitstellung unserer Dienste zur Steuer- und Einkommensanalyse</li>
              <li>Personalisierung Ihrer Nutzererfahrung</li>
              <li>Kommunikation mit Ihnen bezüglich unserer Dienste</li>
              <li>Verbesserung unserer Angebote durch anonymisierte statistische Auswertungen</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">3. Rechtsgrundlage der Verarbeitung</h3>
            <p>
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage folgender Rechtsgrundlagen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
              <li>Zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO)</li>
              <li>Zur Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO)</li>
              <li>Zur Wahrung berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">4. Speicherdauer</h3>
            <p>
              Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden, erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Danach werden Ihre Daten gelöscht oder anonymisiert.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">5. Weitergabe von Daten</h3>
            <p>
              Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt grundsätzlich nicht, es sei denn:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sie haben ausdrücklich eingewilligt</li>
              <li>Es besteht eine gesetzliche Verpflichtung zur Weitergabe</li>
              <li>Die Weitergabe ist zur Durchsetzung unserer Rechte, insbesondere zur Durchsetzung von Ansprüchen aus dem Vertragsverhältnis, erforderlich</li>
            </ul>
            <p>
              Wir setzen für die Bereitstellung unserer Dienste technische Dienstleister ein, die als Auftragsverarbeiter für uns tätig sind und streng weisungsgebunden handeln. Mit diesen Dienstleistern wurden entsprechende Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO geschlossen.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">6. Cookies und Analysedienste</h3>
            <p>
              Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Diese Cookies sind für die Grundfunktionen der Website erforderlich und werden nach Schließen Ihres Browsers gelöscht (Session-Cookies).
            </p>
            <p>
              Darüber hinaus verwenden wir Analysedienste, um die Nutzung unserer Website zu verbessern. Dabei werden Ihre Daten anonymisiert verarbeitet, sodass kein Rückschluss auf Ihre Person möglich ist.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">7. Ihre Rechte</h3>
            <p>
              Sie haben folgende Rechte bezüglich Ihrer bei uns gespeicherten personenbezogenen Daten:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
              <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p>
              Um diese Rechte auszuüben, kontaktieren Sie uns bitte unter den oben genannten Kontaktdaten.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">8. Beschwerderecht bei der Aufsichtsbehörde</h3>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Zuständig ist die Datenschutzbehörde des Bundeslandes, in dem unser Verein seinen Sitz hat:
            </p>
            <p className="font-medium">
              Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
              Friedrichstraße 219<br />
              10969 Berlin<br />
              Telefon: 030 13889-0<br />
              E-Mail: mailbox@datenschutz-berlin.de
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">9. Datensicherheit</h3>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre personenbezogenen Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">10. Aktualität und Änderung dieser Datenschutzerklärung</h3>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand {new Date().toLocaleDateString('de-DE')}.
            </p>
            <p>
              Aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung anzupassen. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf dieser Website abgerufen werden.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}