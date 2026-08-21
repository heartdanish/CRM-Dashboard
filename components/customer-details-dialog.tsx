"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Customer,
  SortableField,
  SortDirection,
  CustomerFilters,
  EMPTY_FILTERS,
} from "@/types/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { FiltersPanel } from "@/components/filters-panel";
import { CustomerFormDialog } from "@/components/customer-form-dialog";
import { CustomerDetailsDialog } from "@/components/customer-details-dialog";

async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/api/customers");
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

function countActiveFilters(filters: CustomerFilters): number {
  let count = 0;
  if (filters.status.length > 0) count++;
  if (filters.companies.length > 0) count++;
  if (filters.dateRange.from || filters.dateRange.to) count++;
  if (filters.phone) count++;
  if (filters.email) count++;
  return count;
}

export function CustomerTable() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const [filters, setFilters] = useState<CustomerFilters>(EMPTY_FILTERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  function handleSort(field: SortableField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageSizeChange(value: string) {
    setPageSize(Number(value) as 10 | 25 | 50);
    setPage(1);
  }

  function handleFiltersChange(newFilters: CustomerFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleRowClick(customer: Customer) {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  }

  const companyOptions = Array.from(
    new Set((customers ?? []).map((c) => c.company))
  ).sort();

  const filtered = (customers ?? []).filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.company.toLowerCase().includes(term);

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(c.status);

    const matchesCompany =
      filters.companies.length === 0 || filters.companies.includes(c.company);

    const matchesDateFrom =
      !filters.dateRange.from || c.lastContact >= filters.dateRange.from;
    const matchesDateTo =
      !filters.dateRange.to || c.lastContact <= filters.dateRange.to;

    const matchesPhone =
      !filters.phone ||
      c.phone.replace(/\D/g, "").includes(filters.phone.replace(/\D/g, ""));

    const matchesEmail =
      !filters.email ||
      c.email.toLowerCase().includes(filters.email.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCompany &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesPhone &&
      matchesEmail
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const comparison = aVal.localeCompare(bVal);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = sorted.slice(startIndex, startIndex + pageSize);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load customers. Please try again.
      </div>
    );
  }

  const sortableColumns: { field: SortableField; label: string }[] = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "lastContact", label: "Last Contact" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm"
          />
          <FiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            companyOptions={companyOptions}
            activeFilterCount={countActiveFilters(filters)}
          />
        </div>
        <CustomerFormDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {sortableColumns.map((col) => (
                <TableHead
                  key={col.field}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(col.field)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3" />
                    {sortField === col.field && (
                      <span className="text-xs">
                        ({sortDirection === "asc" ? "↑" : "↓"})
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(customer)}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.lastContact}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + pageSize, sorted.length)} of {sorted.length}{" "}
          entries
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}