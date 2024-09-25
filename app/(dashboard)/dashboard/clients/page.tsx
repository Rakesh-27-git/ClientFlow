import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getUserClients } from "@/actions/clients";
import { User } from "@prisma/client";
import { getAuthUser } from "@/config/useAuth";

export default async function page() {
  const user = await getAuthUser();
  const clients: User[] = (await getUserClients(user?.id)) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Clients"
        linkTitle="Add Client"
        href="/dashboard/clients/new"
        data={clients}
        model="client"
      />
      <div className="py-8">
        <DataTable data={clients} columns={columns} />
      </div>
    </div>
  );
}
