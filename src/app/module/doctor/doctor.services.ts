import prisma from "../../config/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IOptions } from "../user/user.interface";
import { doctorSearchableFields } from "./doctor.constant";

import { Gender } from "@prisma/client";

const getAll = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: any[] = [];

  // 🔍 Search term handling
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => {
      let value = (filterData as any)[key];

      if (key === "gender" && typeof value === "string") {
        value = Gender[value.toUpperCase() as keyof typeof Gender];
      }

      return {
        [key]: {
          equals: value,
        },
      };
    });

    andConditions.push(...filterConditions);
  }

  if (specialties && Array.isArray(specialties) && specialties.length > 0) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          speciality: {
            in: specialties,
          },
        },
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const DoctorServices = {
  getAll,
};
