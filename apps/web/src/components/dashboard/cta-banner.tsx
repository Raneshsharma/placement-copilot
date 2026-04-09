"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  text: string;
  cta: string;
  href: string;
}

export function CTABanner({ text, cta, href }: CTABannerProps) {
  return (
    <Link
      href={href}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-accent rounded-xl text-white hover:bg-accent/90 transition-colors"
    >
      <p className="font-medium text-lg">{text}</p>
      <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
        {cta}
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
