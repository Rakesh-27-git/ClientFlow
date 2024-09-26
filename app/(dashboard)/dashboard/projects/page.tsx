import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { Project } from "@prisma/client";
import { getAllProjects } from "@/actions/projects";
import { getAuthUser } from "@/config/useAuth";

export default async function page() {
  const user = await getAuthUser();
  const projects: Project[] = (await getAllProjects(user?.id)) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Projects"
        linkTitle="Add Project"
        href="/dashboard/projects/new"
        data={projects}
        model="project"
      />
      <div className="py-8">
        <DataTable data={projects} columns={columns} />
      </div>
    </div>
  );
}
