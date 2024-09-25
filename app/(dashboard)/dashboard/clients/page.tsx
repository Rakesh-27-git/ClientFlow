import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAllClients } from "@/actions/clients";
import { User } from "@prisma/client";

export default async function page() {
  const clients: User[] = (await getAllClients()) || [];
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
