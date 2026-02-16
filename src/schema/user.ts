// import { z } from "zod";
// export const userRegisterSchema = z.object({
//   username: z.string().min(3,"Username must be at least 3 characters").max(20, "Username cannot exceed 20 characters").trim(),
//   email: z.string().email("Invalid email address").toLowerCase(),
//   password: z.string().min(8,"Password must be at least 8 characters").max(100, "Password cannot exceed 100 characters"),
//   role: z.enum(["donor", "receiver"]).default("donor"),
//   bloodGroup: z.string().optional(),
//   phoneNumber: z.string().min(10).max(15),
//   city: z.string().min(2, "City is required").toLowerCase().trim(),
//   area: z.string().min(2, "Area is required").trim(),
//   location: z.object({
//     type: z.literal("Point").default("Point"),
//     coordinates: z.array(z.number()).length(2),
//   }),
// }).refine((data) => {
//   const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   if (data.role === "donor") {
//     return validGroups.includes(data.bloodGroup || "");
//   }
//   return true;
// }, {
//   message: "Valid blood group is required for donors",
//   path: ["bloodGroup"],
// });

import { z } from "zod";

export const userRegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .trim(),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    role: z.enum(["donor", "receiver"]).default("donor"),
    bloodGroup: z.string().optional().or(z.literal("")),

    phoneNumber: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long"),
    city: z.string().min(2, "City is required").toLowerCase().trim(),
    area: z.string().min(2, "Area is required").trim(),
    verifyCode: z.string().optional(),
    verifyCodeExpire: z.date().optional(),

    location: z.object({
      type: z.literal("Point").default("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "Please pin your location on the map"),
    }),
  })
  .refine(
    (data) => {
      const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      if (data.role === "donor") {
        return validGroups.includes(data.bloodGroup || "");
      }
      return true;
    },
    {
      message: "Valid blood group is required for donors",
      path: ["bloodGroup"],
    }
  );

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
