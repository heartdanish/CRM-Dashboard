import { NextRequest, NextResponse } from "next/server";
import { customersStore } from "@/lib/customers-store";
import { CustomerInput } from "@/types/customer";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json()) as Partial<CustomerInput>;
  const index = customersStore.data.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  customersStore.data[index] = { ...customersStore.data[index], ...body };
  return NextResponse.json(customersStore.data[index]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = customersStore.data.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  customersStore.data.splice(index, 1);
  return NextResponse.json({ success: true });
}