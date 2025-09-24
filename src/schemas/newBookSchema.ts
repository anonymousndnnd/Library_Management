import z from "zod";

export const newBookSchema=z.object({
  title: z.string()
                .min(3, { message: "Identifier must be at least 3 characters long" }),
  description:z.string()
            .min(8, { message: "description must be at least 8 characters long" })
            .max(100, { message: "Password too long" }),
})