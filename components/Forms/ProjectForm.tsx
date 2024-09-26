"use client";

import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { Project } from "@prisma/client";
import { ProjectProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import FormSelectInput from "../FormInputs/FormSelectInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { updateUser } from "@/actions/users";
import { generateSlug } from "@/lib/generateSlug";
import TextArea from "../FormInputs/TextAreaInput";
import { createProject, updateProjectById } from "@/actions/projects";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ProjectFormProps = {
  editingId?: string | undefined;
  userId: string;
  initialData?: Project | undefined | null;
  clients: SelectOptionProps[];
};
export default function ProjectForm({
  editingId,
  initialData,
  userId,
  clients,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate ? initialData.startDate.toString() : "",
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage =
    initialData?.thumbnail ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  const initialClientId = initialData?.clientId;
  const initialClient = clients.find((user) => user.value === initialClientId);

  const [selectedClient, setSelectedClient] = useState<any>(initialClient);

  async function onSubmit(data: ProjectProps) {
    setLoading(true);
    data.slug = generateSlug(data.name);
    data.thumbnail = imageUrl;
    data.clientId = selectedClient?.id;
    data.userId = userId;

    try {
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        toast.success("Project Updated successfully");
        reset();
        router.push("/dashboard/projects");
      } else {
        const res = await createProject(data);
        if (res.status === 409) {
          setLoading(false);
          toast.error(res.error);
        } else if (res.status === 200) {
          setLoading(false);
          toast.success("Project Created successfully");
          router.push("/dashboard/projects");
        } else {
          setLoading(false);
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        href="/projects"
        parent=""
        title="Project"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Project Name"
                    name="name"
                  />
                </div>
                <div className="grid gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    type="date"
                    label="Project Start Date"
                    name="startDate"
                  />
                </div>
                <div className="grid gap-3">
                  <FormSelectInput
                    label="Clients"
                    options={clients}
                    option={selectedClient}
                    setOption={setSelectedClient}
                    toolTipText="Add New Client"
                    href="/dashboard/clients/new"
                  />
                </div>
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Description"
                    name="description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Project Thumbnail"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="projectThumbnail"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/projects"
        editingId={editingId}
        loading={loading}
        title="Project"
        parent=""
      />
    </form>
  );
}
