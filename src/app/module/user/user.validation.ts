import * as z from "zod";

export const createPatientValidation = z.object({
  name: z.string().min(4, "Minimum 4 cahrecter required."),
  email: z.email(),
  password: z.string().min(6, "Minimum 6 cahrecter required."),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});
