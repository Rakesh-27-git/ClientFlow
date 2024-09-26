"use server";

import { db } from "@/prisma/db";
import { ProjectProps } from "@/types/types";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectProps) {
  const slug = data.slug;
  try {
    const existingProject = await db.project.findUnique({
      where: {
        slug,
      },
    });
    if (existingProject) {
      return {
        status: 409,
        data: null,
        error: `Project ${data.name} already exists`,
      };
    }
    const newProject = await db.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        startDate: new Date(data.startDate),
        status: (data.status as ProjectStatus) || ProjectStatus.ACTIVE,
        clientId: data.clientId,
        userId: data.userId,
      },
    });

    revalidatePath("/dashboard/projects");
    return {
      status: 200,
      error: null,
      data: newProject,
    };
  } catch (error) {
    console.log(error);
    return {
      error: `Something Went wrong, Please try again`,
      status: 500,
      data: null,
    };
  }
}

export async function getAllProjects(userId: string | undefined) {
  try {
    const projects = await db.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
    });

    return projects;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateProjectById(id: string, data: ProjectProps) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        ...data,
        status: data.status as ProjectStatus,
      },
    });
    revalidatePath("/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(id: string) {
  try {
    const deletedProject = await db.project.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedProject,
    };
  } catch (error) {
    console.log(error);
  }
}
