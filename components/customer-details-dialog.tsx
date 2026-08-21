"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { CustomerFormDialog } from "@/components/customer-form-dialog";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
}

export function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to delete customer. Please try again.");
    },
  });

  if (!customer) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{customer.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-sm">{customer.company || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Contact</p>
                <p className="text-sm">{customer.lastContact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">{customer.createdAt}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted p-3 rounded-md min-h-[60px]">
                {customer.notes || "No notes yet."}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <AlertDialog>
              <AlertDialogTrigger
  className={buttonVariants({ variant: "destructive", className: "gap-2" })}
>
  <Trash2 className="h-4 w-4" />
  Delete
</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {customer.name}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(customer.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="gap-2" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomerFormDialog
        mode="edit"
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
        hideDefaultTrigger
      />
    </>
  );
}