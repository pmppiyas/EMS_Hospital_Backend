import * as z from "zod";

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
