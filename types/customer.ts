export type CustomerStatus = "Active" | "Inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContact: string; // ISO date string, e.g. "2024-11-12"
  createdAt: string; // ISO date string
  notes: string;
}

// Shape used when creating/editing a customer (id + createdAt are set by the server)
export type CustomerInput = Omit<Customer, "id" | "createdAt">;

// ----- Filters -----

export interface DateRange {
  from?: string; // ISO date string
  to?: string; // ISO date string
}

export interface CustomerFilters {
  status: CustomerStatus[];
  companies: string[];
  dateRange: DateRange;
  phone: string;
  email: string;
}

export const EMPTY_FILTERS: CustomerFilters = {
  status: [],
  companies: [],
  dateRange: {},
  phone: "",
  email: "",
};

export interface SavedFilter {
  id: string;
  name: string;
  filters: CustomerFilters;
  order: number; // used for drag-and-drop reordering
}

// ----- Sorting & pagination (used by the table component) -----

export type SortableField = "name" | "email" | "lastContact";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortableField;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number; // 1-indexed
  pageSize: 10 | 25 | 50;
}