"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  CustomerFilters,
  CustomerStatus,
  EMPTY_FILTERS,
  SavedFilter,
} from "@/types/customer";
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
import { Filter, Trash2 } from "lucide-react";

interface FiltersPanelProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  companyOptions: string[];
  activeFilterCount: number;
}

const STATUS_OPTIONS: CustomerStatus[] = ["Active", "Inactive"];
const STORAGE_KEY = "crm-saved-filters";

const PREBUILT_TEMPLATES: SavedFilter[] = [
  {
    id: "template-active",
    name: "Active Customers",
    filters: { ...EMPTY_FILTERS, status: ["Active"] },
    order: -3,
  },
  {
    id: "template-recent",
    name: "Recent Contacts",
    filters: {
      ...EMPTY_FILTERS,
      dateRange: { from: "2024-01-01", to: "" },
    },
    order: -2,
  },
  {
    id: "template-inactive",
    name: "Inactive Leads",
    filters: { ...EMPTY_FILTERS, status: ["Inactive"] },
    order: -1,
  },
];

function loadSavedFilters(): SavedFilter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedFilters(filters: SavedFilter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  companyOptions,
  activeFilterCount,
}: FiltersPanelProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    setSavedFilters(loadSavedFilters());
  }, []);

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

  function handleSaveFilter() {
    if (!saveName.trim()) return;
    const newSaved: SavedFilter = {
      id: `saved-${Date.now()}`,
      name: saveName.trim(),
      filters,
      order: savedFilters.length,
    };
    const updated = [...savedFilters, newSaved];
    setSavedFilters(updated);
    persistSavedFilters(updated);
    setSaveName("");
  }

  function handleApplySaved(saved: SavedFilter) {
    onFiltersChange(saved.filters);
  }

  function handleDeleteSaved(id: string) {
    const updated = savedFilters.filter((s) => s.id !== id);
    setSavedFilters(updated);
    persistSavedFilters(updated);
  }

  const allSavedForDisplay = [...PREBUILT_TEMPLATES, ...savedFilters];

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
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Filter name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
              <Button size="sm" onClick={handleSaveFilter}>
                Save Filter
              </Button>
            </div>
          </div>

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

          <div className="space-y-2">
            <span className="text-sm font-medium">Saved Filters</span>
            <div className="space-y-1">
              {allSavedForDisplay.map((saved) => (
                <div
                  key={saved.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <button
                    onClick={() => handleApplySaved(saved)}
                    className="text-sm text-left flex-1"
                  >
                    {saved.name}
                  </button>
                  {!saved.id.startsWith("template-") && (
                    <button onClick={() => handleDeleteSaved(saved.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}