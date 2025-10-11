import * as z from "zod";
import { Gender } from "./user.interface";

export const createPatientValidation = z.object({
  name: z.string().min(4, "Minimum 4 cahrecter required."),
  email: z.email(),
  password: z.string().min(6, "Minimum 6 cahrecter required."),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const createAdminValidation = z.object({
  password: z.string().min(6, "Minimum 6 cahrecter required."),

  admin: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
  }),
});

export const createDoctorValidation = z.object({
  password: z.string({
    error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      error: "Reg number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
      error: "appointment fee is required",
    }),
    qualification: z.string({
      error: "quilification is required",
    }),
    currentWorkingPlace: z.string({
      error: "Current working place is required!",
    }),
    designation: z.string({
      error: "Designation is required!",
    }),
  }),
});
