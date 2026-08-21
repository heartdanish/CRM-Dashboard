import { Customer, CustomerStatus } from "@/types/customer";

// --- tiny seeded RNG so the "random" data is stable across reloads ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randomDate(startYear = 2022, endYear = 2024): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const t = start + rand() * (end - start);
  return new Date(t).toISOString().split("T")[0];
}

const FIRST_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ian", "Julia", "Kevin", "Laura", "Marcus", "Nina", "Oscar", "Priya",
  "Quentin", "Rachel", "Samuel", "Tara", "Umar", "Victoria", "William",
  "Ximena", "Yusuf", "Zoe",
];

const LAST_NAMES = [
  "Green", "Ross", "Davis", "Smith", "Johnson", "Brown", "Wilson", "Taylor",
  "Anderson", "Thomas", "Moore", "Martin", "Lee", "Walker", "Hall", "Allen",
  "Young", "King", "Wright", "Scott",
];

const COMPANIES = [
  "Acme Corp", "Globex", "Stark Industries", "Innovatech", "Wayne Enterprises",
  "Umbrella Corp", "Initech", "Hooli", "Soylent Corp", "Cyberdyne Systems",
];

const STATUSES: CustomerStatus[] = ["Active", "Inactive"];

const NOTES_SAMPLES = [
  "Met at industry conference. Interested in enterprise plan.",
  "Followed up via email, awaiting response.",
  "Scheduled demo call for next week.",
  "Signed contract, onboarding in progress.",
  "Requested pricing details for team plan.",
  "No response after multiple attempts.",
  "Very engaged, likely to convert soon.",
  "Renewed subscription for another year.",
  "",
];

function makeEmail(first: string, last: string, company: string): string {
  const domain = company.toLowerCase().replace(/[^a-z]/g, "") + ".com";
  return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`;
}

function makePhone(): string {
  return `+1 (${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
}

function generateCustomers(count: number): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const company = pick(COMPANIES);
    const createdAt = randomDate(2022, 2023);
    const lastContact = randomDate(2023, 2024);

    customers.push({
      id: `cust_${String(i + 1).padStart(4, "0")}`,
      name: `${first} ${last}`,
      email: makeEmail(first, last, company),
      phone: makePhone(),
      company,
      status: pick(STATUSES),
      lastContact,
      createdAt,
      notes: pick(NOTES_SAMPLES),
    });
  }

  return customers;
}

// 150 customers, matching the "Showing 1 to 10 of 150 entries" in the spec
export const MOCK_CUSTOMERS: Customer[] = generateCustomers(150);

// Convenience export: unique company names, used for the filter dropdown
export const COMPANY_OPTIONS: string[] = Array.from(
  new Set(MOCK_CUSTOMERS.map((c) => c.company))
).sort();