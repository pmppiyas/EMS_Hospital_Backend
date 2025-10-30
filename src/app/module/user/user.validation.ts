import * as z from "zod";
import { Gender } from "./user.interface";

export const createPatientValidation1 = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.string().min(1, "Email is required!"),
  password: z.string().min(6, "Minimum 6 characters required."),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const createPatientValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().min(1, "Email is required!"),
    password: z.string().min(6, "Minimum 6 characters required."),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const createAdminValidation = z.object({
  body: z.object({
    password: z.string().min(6, "Minimum 6 characters required."),
    admin: z.object({
      name: z.string().min(1, "Name is required!"),
      email: z.string().min(1, "Email is required!"),
      contactNumber: z.string().min(1, "Contact Number is required!"),
      profilePhoto: z.string().url("Invalid URL format").optional(),
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

export const userStatusChangeValidation = z.object({
  params: z.object({
    id: z.uuid({ message: "Invalid user ID format" }),
    status: z.enum(["ACTIVE", "INACTIVE", "DELETED"], {
      message: "Status must be either ACTIVE or INACTIVE or DELETED ",
    }),
  }),
});
