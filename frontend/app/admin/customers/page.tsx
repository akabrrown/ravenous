import { getAdminCustomers } from "@/lib/actions";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Customers</h1>
          <p className="text-gray-500 mt-2">Manage user accounts, roles, and view customer information.</p>
        </div>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
