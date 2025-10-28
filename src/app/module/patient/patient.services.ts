import { Prisma } from "@prisma/client";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IOptions, UserStatus } from "../user/user.interface";
import { patientSearchableFields } from "./patient.constant";
import { IPatientFilterRequest } from "./patient.interface";

const get = async (filter: IPatientFilterRequest, options: IOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filter;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.patient.count({
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

const getById = async (id: string) => {
  const data = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      appointment: true,
      prescription: true,
      PatientHealthData: true,
      Review: true,
    },
  });

  return data;
};

const softDelete = async (id: string) => {
  return await prisma.$transaction(async (tnx) => {
    const deletePatient = await tnx.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tnx.user.update({
      where: {
        email: deletePatient.email,
      },

      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletePatient;
  });
};

const update = async (user: IJwtPayload, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  const { medicalReport, patientHelthData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (patientHelthData) {
      await tnx.patientHealthData.upsert({
        where: {
          patientId: patientData.id,
        },
        update: patientHelthData,
        create: {
          patientId: patientData.id,
          ...patientHelthData,
        },
      });
    }

    if (medicalReport) {
      await tnx.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: patientData.id,
        },
      });
    }
  });
};

export const PatientServices = {
  get,
  getById,
  softDelete,
  update,
};
