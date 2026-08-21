"use client";
import { buttonVariants } from "@/components/ui/button";
import { CustomerFilters, CustomerStatus, EMPTY_FILTERS } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FiltersPanelProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  companyOptions: string[];
  activeFilterCount: number;
}

const STATUS_OPTIONS: CustomerStatus[] = ["Active", "Inactive"];

export function FiltersPanel({
  filters,
  onFiltersChange,
  companyOptions,
  activeFilterCount,
}: FiltersPanelProps) {
  function toggleStatus(status: CustomerStatus) {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  }

  function toggleCompany(company: string) {
    const newCompanies = filters.companies.includes(company)
      ? filters.companies.filter((c) => c !== company)
      : [...filters.companies, company];
    onFiltersChange({ ...filters, companies: newCompanies });
  }

  function clearAll() {
    onFiltersChange(EMPTY_FILTERS);
  }

  return (
    <Sheet>
        <SheetTrigger
  className={buttonVariants({ variant: "outline", className: "gap-2" })}
>
  <Filter className="h-4 w-4" />
  Filters
  {activeFilterCount > 0 && (
    <Badge variant="secondary" className="ml-1">
      {activeFilterCount}
    </Badge>
  )}
</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <label htmlFor={`status-${status}`} className="text-sm">
                  {status}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Company</span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {companyOptions.map((company) => (
                <div key={company} className="flex items-center gap-2">
                  <Checkbox
                    id={`company-${company}`}
                    checked={filters.companies.includes(company)}
                    onCheckedChange={() => toggleCompany(company)}
                  />
                  <label htmlFor={`company-${company}`} className="text-sm">
                    {company}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Date Range (Last Contact)</span>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={filters.dateRange.from ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, from: e.target.value },
                  })
                }
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="date"
                value={filters.dateRange.to ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, to: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Phone Number</span>
            <Input
              placeholder="e.g. 555"
              value={filters.phone}
              onChange={(e) =>
                onFiltersChange({ ...filters, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Email Contains</span>
            <Input
              placeholder="e.g. @gmail.com"
              value={filters.email}
              onChange={(e) =>
                onFiltersChange({ ...filters, email: e.target.value })
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}