import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import { Customer } from "@/types/customer";

// Single shared in-memory array, imported by every API route file so
// GET/POST/PUT/DELETE all see the same data. Resets on server restart.
// Swap this module for a real DB layer later without touching the routes.
export const customersStore: { data: Customer[] } = {
  data: [...MOCK_CUSTOMERS],
};