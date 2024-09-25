"use client";

import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { User, UserRole } from "@prisma/client";
import { UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createUser, updateUser } from "@/actions/users";
import PasswordInput from "../FormInputs/PasswordInput";
import { Headset, Mail, Lock, UserRound } from "lucide-react";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ClientFormProps = {
  editingId?: string | undefined;
  initialData?: User | undefined | null;
};
export default function ClientForm({
  editingId,
  initialData,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage =
    initialData?.image ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image = data.image || imageUrl;
    data.role = UserRole.CLIENT;

    try {
      if (editingId) {
        await updateUser(editingId, data);
        setLoading(false);
        toast.success("Client Updated successfully");
        reset();
        router.push("/dashboard/clients");
      } else {
        const res = await createUser(data);
        if (res.status === 409) {
          setLoading(false);
          setEmailErr(res.error);
        } else if (res.status === 200) {
          setLoading(false);
          toast.success("Client Created successfully");
          router.push("/dashboard/clients");
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
        href="/clients"
        parent=""
        title="Clients"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="First Name"
                    name="firstName"
                    icon={UserRound}
                    placeholder="first Name"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Last Name"
                    name="lastName"
                    icon={UserRound}
                    placeholder="last Name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Phone"
                    name="phone"
                    icon={Headset}
                    placeholder="phone"
                  />
                  <div className="">
                    <TextInput
                      type="email"
                      register={register}
                      errors={errors}
                      label="Email Address"
                      name="email"
                      icon={Mail}
                      placeholder="email"
                    />
                    {emailErr && (
                      <p className="text-red-500 text-xs mt-2">{emailErr}</p>
                    )}
                  </div>
                </div>

                {!editingId && (
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Password"
                    name="password"
                    icon={Lock}
                    placeholder="password"
                    type="password"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Client Image"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/clients"
        editingId={editingId}
        loading={loading}
        title="Client"
        parent=""
      />
    </form>
  );
}
