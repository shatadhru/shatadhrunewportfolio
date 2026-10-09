"use client";

import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

import { ThemeInjector } from "@/components/basic/theme/ThemeInjector";
import { DevToolsProtection } from "@/components/basic/security/DevToolsProtection";
import { SiteSettingsProvider } from "@/components/basic/context/SiteSettingsContext";

function Providor({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SiteSettingsProvider>
        <ThemeInjector />
        <DevToolsProtection />
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </SiteSettingsProvider>
    </ThemeProvider>
  );
}

export default Providor;

