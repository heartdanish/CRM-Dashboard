import { NextRequest, NextResponse } from "next/server";
import { customersStore } from "@/lib/customers-store";
import { Customer, CustomerInput } from "@/types/customer";

export async function GET() {
  return NextResponse.json(customersStore.data);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CustomerInput;

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const newCustomer: Customer = {
    ...body,
    id: `cust_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };

  customersStore.data = [newCustomer, ...customersStore.data];
  return NextResponse.json(newCustomer, { status: 201 });
}