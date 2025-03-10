"use client"

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, AlignVerticalDistributeCenter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function TaxHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["deine", "ehrliche", "transparente", "gerechte", "faire", "gute", "unsere", "einfache"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            {/* <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button> */}
          </div>

          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Was sind</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-spektr-cyan-50">Steuern?</span>

            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Steuern zu erheben ist eines der zentralen Privilegien des Staates. Mithilfe dieser können wir
               unser Land in eine bessere Zukunft steuern. Dazu laden wir jeden Bürger ein unsere Steuern,
               damit unser Einkommen und Vermögen, besser zu verstehen.
            </p>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            Unsere Steuern heute. Unsere Möglichkeiten. In Zahlen.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button asChild size="lg" className="gap-4" variant="outline">
              <Link href="/steuerszenarien">
                Unsere Steuer verstehen und verbessern <AlignVerticalDistributeCenter className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-4">
              <Link href="/lebenseinkommen/rechner">
                Deine Steuern berechnen <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TaxHero };
