import { OpenAI } from "../../config/openAi";
import prisma from "../../config/prisma";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";
import { AppError } from "../../utils/appError";
import { calculatePagination } from "../../utils/calculatePagination";
import { IOptions } from "../user/user.interface";
import { doctorSearchableFields } from "./doctor.constant";

import { Gender, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const getAll = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialities, ...filterData } = filters;

  let specialtiesArray: string[] = [];

  if (typeof specialities === "string") {
    specialtiesArray = specialities.split(",").map((s) => s.trim());
  } else if (Array.isArray(specialities)) {
    specialtiesArray = specialities;
  }

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

  if (specialtiesArray.length > 0) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              in: specialtiesArray,
            },
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
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
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
  const doctor = await prisma.doctor.findFirst({
    where: { id },
  });

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  const { specialities, ...doctorData } = payload as any;

  return await prisma.$transaction(async (tnx) => {
    if (
      specialities &&
      Array.isArray(specialities) &&
      specialities.length > 0
    ) {
      const deleteSpecialities = specialities.filter(
        (spec) => spec.isDeleted === true
      );
      const addSpecialities = specialities.filter(
        (spec) => spec?.isDeleted === false || spec.isDeleted === undefined
      );

      if (deleteSpecialities.length > 0) {
        for (const spec of deleteSpecialities) {
          await tnx.doctorSpecialites.deleteMany({
            where: {
              doctorId: id,
              specialitiesId: spec.specId,
            },
          });
        }
      }

      for (const spec of addSpecialities) {
        const exists = await tnx.doctorSpecialites.findFirst({
          where: {
            doctorId: id,
            specialitiesId: spec.specId,
          },
        });

        if (!exists) {
          await tnx.doctorSpecialites.create({
            data: {
              doctorId: id,
              specialitiesId: spec.specId,
            },
          });
        }
      }
    }

    return await tnx.doctor.update({
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
  });
};

const suggestion = async (payload?: { symptoms?: string }) => {
  if (!payload || !payload.symptoms) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Symptoms are required");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const prompt = `
You are an AI medical assistant.

Analyze the patient's symptoms and select **only** the doctors whose specialties are *directly relevant* to those symptoms.

🧠 Strict rules:
1. You must only include doctors whose listed specialties clearly match or treat the given symptoms.
2. If a doctor has **no specialties listed**, exclude them.
3. If none of the doctors are relevant, return an **empty JSON array**.
4. Prefer doctors with more years of experience if multiple are relevant.
5. Do **not** include general or internal medicine doctors unless the symptom specifically fits their field.
6. Your output must be **pure JSON** — no explanations, text, or comments.

Patient Symptoms:
${payload.symptoms}

Doctor List (JSON):
${JSON.stringify(doctors, null, 2)}

🎯 Output format:
Return a JSON array containing the full doctor objects (exactly as they appear in the input) for the top 1–3 most relevant doctors.
If only one relevant doctor is found, return just that one.
If none are relevant, return [].
`;

  const completion = await OpenAI.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const result = await extractJsonFromMessage(completion.choices[0].message);

  return result;
};

const getById = async (id: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  return doctor;
};

export const DoctorServices = {
  getAll,
  update,
  suggestion,
  getById,
};
