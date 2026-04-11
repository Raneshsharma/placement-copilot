"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Briefcase } from "lucide-react";

interface RoleSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  locationValue?: string;
  onLocationChange?: (value: string) => void;
  jobTypeValue?: string;
  onJobTypeChange?: (value: string) => void;
  salaryRangeValue?: string;
  onSalaryRangeChange?: (value: string) => void;
}

export function RoleSearchBar({
  searchValue,
  onSearchChange,
  locationValue,
  onLocationChange,
  jobTypeValue,
  onJobTypeChange,
  salaryRangeValue,
  onSalaryRangeChange,
}: RoleSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Input
          placeholder="Search roles, companies, skills..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11"
        />
        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {onLocationChange && (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
            <Input
              placeholder="Location"
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-9 h-11 w-36"
            />
          </div>
        )}
        {onJobTypeChange && (
          <Select value={jobTypeValue} onValueChange={onJobTypeChange}>
            <SelectTrigger className="h-11 w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        )}
        {onSalaryRangeChange && (
          <Select value={salaryRangeValue} onValueChange={onSalaryRangeChange}>
            <SelectTrigger className="h-11 w-36">
              <SelectValue placeholder="Salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50">$0 - $50k</SelectItem>
              <SelectItem value="50-80">$50k - $80k</SelectItem>
              <SelectItem value="80-120">$80k - $120k</SelectItem>
              <SelectItem value="120-180">$120k - $180k</SelectItem>
              <SelectItem value="180+">$180k+</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
