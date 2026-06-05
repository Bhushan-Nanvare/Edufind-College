import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const saveCollegeSchema = z.object({
  collegeId: z.number().int().positive(),
});

export const savedStatusSchema = z.object({
  status: z.enum(["INTERESTED", "APPLIED", "GOT_ADMIT", "REJECTED"]),
});

export const reviewSchema = z.object({
  collegeId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(50),
});

export const predictorQuerySchema = z.object({
  exam: z.enum(["JEE_MAIN", "JEE_ADVANCED", "NEET", "CAT", "MHT_CET"]),
  rank: z.coerce.number().int().positive(),
  category: z.enum(["GENERAL", "OBC", "SC", "ST"]),
});
