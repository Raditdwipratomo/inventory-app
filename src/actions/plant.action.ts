"use server";

import { Prisma } from "@/generated/prisma";
import { getUserId } from "./user.action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPlants(searchTerm?: String) {
  try {
    const currentUserId = await getUserId();

    const whereClause: any = {
      userId: currentUserId,
    };

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    const userPlants = await prisma.plants.findMany({
      where: whereClause,
    });

    revalidatePath("/");
    return { success: true, userPlants };
  } catch (error) {
    console.log("Error in getPlants", error);
    throw new Error("Failed to fetch plants");
  }
}

export async function getPlantById(id: string) {
  return await prisma.plants.findUnique({
    where: { id },
  });
}

export async function createPlant(data: Prisma.PlantsCreateInput) {
  try {
    const currentUserId = await getUserId();

    if (!currentUserId) {
      return;
    }

    const newPlant = await prisma.plants.create({
      data: {
        ...data,
        userId: currentUserId,
      },
    });
    revalidatePath("/plants");
    return newPlant;
  } catch (error) {
    console.error("Error Creating Plant: ", error);
    throw error;
  }
}

export async function editPlant(id: string, data: Prisma.PlantsUpdateInput) {
  try {
    const currentUserId = await getUserId();
    const updatePlant = await prisma.plants.update({
      where: { id },
      data: {
        ...data,
        userId: currentUserId,
      },
    });

    revalidatePath("/plants");
  } catch (error) {
    console.error("Error updating plant: ", error);
  }
}
