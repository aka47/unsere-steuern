"use client";

import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export const InfoTooltip = ({
  content,
  side = "top",
}: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};