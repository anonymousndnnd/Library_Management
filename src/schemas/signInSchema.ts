import {z} from "zod";

export const signInSchema=z.object({
  identifier: z.string()
                .min(3, { message: "Identifier must be at least 3 characters long" })
                .regex(/^[a-zA-Z0-9._@]+$/, {
                  message: "Identifier can only contain letters, numbers, dots, underscores, and @",
                }),
  password:z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(100, { message: "Password too long" }),
})