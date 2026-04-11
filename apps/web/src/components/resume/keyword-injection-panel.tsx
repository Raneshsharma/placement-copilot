"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, CheckCircle } from "lucide-react";

interface MissingKeyword {
  keyword: string;
  relevance: number;
  count?: number;
}

interface KeywordInjectionPanelProps {
  missingKeywords: MissingKeyword[];
  onInject?: (keyword: string) => void;
  onInjectAll?: () => void;
}

export function KeywordInjectionPanel({ missingKeywords, onInject, onInjectAll }: KeywordInjectionPanelProps) {
  if (missingKeywords.length === 0) {
    return (
      <Card className="p-4 bg-surface-container-highest shadow-ambient-sm">
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm font-medium text-on-surface">All keywords matched!</p>
          <p className="text-xs text-on-surface-variant mt-1">Your resume covers all important keywords.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-surface-container-highest shadow-ambient-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-sm text-on-surface">Missing Keywords</h3>
          <p className="text-xs text-on-surface-variant">{missingKeywords.length} keywords to add</p>
        </div>
        {onInjectAll && (
          <Button size="sm" variant="ghost" onClick={onInjectAll} className="text-primary hover:bg-primary-container">
            Add All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {missingKeywords.map((kw) => (
          <div key={kw.keyword} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-mid surface-shift">
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface">{kw.keyword}</span>
              {kw.relevance >= 80 && <Badge variant="success" className="text-[10px] px-1">High relevance</Badge>}
            </div>
            {onInject && (
              <Button size="sm" variant="ghost" onClick={() => onInject(kw.keyword)}>
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}