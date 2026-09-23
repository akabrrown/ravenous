"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUser, updateUserRole } from "@/lib/actions";

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  avatarUrl: string | null;
  createdAt: Date;
};

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This may fail if they have associated bookings or quotes.")) return;
    
    try {
      await deleteUser(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (e) {
      alert("Failed to delete user. They likely have records tied to their account.");
    }
  };

  const handleRoleChange = async (id: string, newRole: Customer["role"]) => {
    await updateUserRole(id, newRole);
    setCustomers(customers.map(c => c.id === id ? { ...c, role: newRole } : c));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {customer.avatarUrl ? (
                      <img 
                        src={customer.avatarUrl} 
                        alt={customer.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="font-medium text-gray-900">{customer.fullName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  {customer.phone && (
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(customer.createdAt))}
                </TableCell>
                <TableCell>
                  <select
                    value={customer.role}
                    onChange={(e) => handleRoleChange(customer.id, e.target.value as Customer["role"])}
                    className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border outline-none ${
                      customer.role === "admin" 
                        ? "bg-purple-100 text-purple-800 border-purple-200" 
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
