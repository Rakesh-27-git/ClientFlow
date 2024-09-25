"use server";

import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

// Create User
export async function createUser(data: UserProps) {
  const {
    email,
    password,
    firstName,
    lastName,
    name,
    phone,
    image,
    role,
    userId,
  } = data;
  try {
    // Hash the PAASWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        error: `Email already exists`,
        status: 409,
        data: null,
      };
    }
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name,
        phone,
        image,
        role,
        userId,
      },
    });
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/clients");
    console.log(newUser);
    return {
      error: null,
      status: 200,
      data: newUser,
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

// Delete User
export async function deleteUser(id: string) {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/clients");
    return {
      status: 200,
      ok: true,
      data: deletedUser,
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

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUser(id: string, data: UserProps) {
  try {
    const user = await db.user.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/clients");
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
