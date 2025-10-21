import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { calculatePagination } from "../../utils/calculatePagination";
import { createDoctorInput, IOptions } from "../user/user.interface";
import { doctorSearchableFields } from "./doctor.constant";

import { Gender, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const getAll = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: any[] = [];

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

const update = async (id: string, payload: Prisma.DoctorUpdateInput) => {
  const { specialities, ...doctorData } = payload as any;

  const doctor = await prisma.doctor.findFirst({
    where: { id },
  });

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  if (specialities && Array.isArray(specialities) && specialities.length > 0) {
    const deleteSpecialities = specialities.filter(
      (spec) => spec.isDeleted === true
    );
    const addSpecialities = specialities.filter(
      (spec) => spec?.isDeleted === false
    );

    if (deleteSpecialities.length > 0) {
      for (const spec of deleteSpecialities) {
        await prisma.doctorSpecialites.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: spec.specId,
          },
        });
      }
    }

    for (const spec of addSpecialities) {
      const exists = await prisma.doctorSpecialites.findFirst({
        where: {
          doctorId: id,
          specialitiesId: spec.specialitiesId,
        },
      });

      if (!exists) {
        await prisma.doctorSpecialites.create({
          data: {
            doctorId: id,
            specialitiesId: spec.specialitiesId,
          },
        });
      }
    }
  }

  const updateDoctor = await prisma.doctor.update({
    where: { id },
    data: doctorData,
    include: {
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return updateDoctor;
};

export const DoctorServices = {
  getAll,
  update,
};
