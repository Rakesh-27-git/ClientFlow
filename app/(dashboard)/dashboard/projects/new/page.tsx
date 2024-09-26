import { getUserClients } from "@/actions/clients";
import ProjectForm from "@/components/Forms/ProjectForm";
import { getAuthUser } from "@/config/useAuth";
import React from "react";

export default async function page() {
  const user = await getAuthUser();
  const userId = user?.id ?? "";
  const clients = await getUserClients(userId);
  const userClients = (clients ?? [])
    .filter((client) => client.userId !== null)
    .map((client) => ({
      label: client.name,
      value: client.userId as string,
      id: client.id,
    }));

  return (
    <div className="p-8">
      <ProjectForm clients={userClients} userId={userId} />
    </div>
  );
}
