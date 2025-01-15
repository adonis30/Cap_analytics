import * as z from "zod";

export const boardMemberSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  positions: z.array(z.object({
    company: z.string().uuid("Invalid company ID"),
    position: z.string().min(2, "Position must be at least 2 characters"),
  })).nonempty("At least one position is required"),
});
