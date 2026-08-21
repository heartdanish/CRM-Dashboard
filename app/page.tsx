import { CustomerTable } from "@/components/customer-table";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <CustomerTable />
    </main>
  );
}