"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";




export function FirstWeekMessage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("first_visit");
    const now = Date.now();

    if (!firstVisit) {
      localStorage.setItem("first_visit", now.toString());
      setIsVisible(true);
    } else {
      const elapsedDays = (now - Number(firstVisit)) / (1000 * 60 * 60 * 24);
      if (elapsedDays < 7) setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-green-100 border shadow-lg">
      <CardContent>
        <p>Welcome! This will disappear after a week.</p>
      </CardContent>
    </Card>
  );
}

export function LimitedAppearancesBox() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const viewedCount = Number(localStorage.getItem("view_count") || "0");
    if (viewedCount < 3) setCount(viewedCount);
  }, []);

  const handleClose = () => {
    const newCount = count + 1;
    localStorage.setItem("view_count", newCount.toString());
    setCount(newCount);
  };

  if (count >= 3) return null;

  return (
    <Card className="p-4 bg-yellow-100 border shadow-lg">
      <CardContent>
        <p>This message will disappear after 3 views.</p>
        <Button onClick={handleClose} className="mt-2">Close</Button>
      </CardContent>
    </Card>
  );
}

interface OnboardingProps {
  children: React.ReactNode
}

export function Onboarding({ children }: OnboardingProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 border-zinc-200 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {/* <CardTitle className="text-lg">Willkommen!</CardTitle> */}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

interface CollapsibleBoxProps {
  children: React.ReactNode
  title?: string
}

export function CollapsibleBox({ children, title = "Collapsible Content" }: CollapsibleBoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const collapsed = sessionStorage.getItem("box_collapsed");
    if (collapsed) setIsOpen(false);
  }, []);

  const toggle = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      sessionStorage.setItem("box_collapsed", newState ? "" : "true");
      return newState;
    });
  };

  return (
    <Card className="border shadow-lg m-8">
      <Collapsible defaultOpen open={isOpen} onOpenChange={toggle}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center">
              <CardTitle className="text-lg">{title}</CardTitle>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="px-6 pb-6">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

interface DismissibleBoxProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function DismissibleBox({ children, title = "Welcome!", className = "" }: DismissibleBoxProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("onboarding_dismissed");
    if (dismissed) setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("onboarding_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <Card className={`bg-blue-10 border shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="w-full max-w-1/3">
        {children}
      </CardContent>
    </Card>
  );
}
