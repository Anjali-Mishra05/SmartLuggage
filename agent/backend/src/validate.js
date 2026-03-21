import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(1).max(160),
  mobile: z.string().min(6).max(32),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  mobile: z.string().min(6).max(32),
  password: z.string().min(1).max(128),
});

export const kycSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),

  idType: z.string().optional(),
  idNumber: z.string().optional(),

  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),

  accountName: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  branchName: z.string().optional(),

  vehicleType: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleColor: z.string().optional(),
  licensePlate: z.string().optional(),
  registrationNumber: z.string().optional(),

  emergencyName: z.string().optional(),
  emergencyRelation: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyAltPhone: z.string().optional(),
  emergencyEmail: z.string().optional(),
  emergencyAddress: z.string().optional(),

  confirmAccuracy: z.coerce.boolean().optional(),
  agreeTerms: z.coerce.boolean().optional(),
  agreePrivacy: z.coerce.boolean().optional(),
  agreeCommunications: z.coerce.boolean().optional(),
});

