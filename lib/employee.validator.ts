import * as z from "zod";

export const employeeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumbers: z.array(z.string()).nonempty("At least one phone number is required"),
  organizationId: z.string().uuid("Invalid organization ID"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().optional(),
  hireDate: z.date().optional(),
  address: z.string().optional(),
  linkedInUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  bio: z.string().optional(),
});
