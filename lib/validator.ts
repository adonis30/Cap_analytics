import * as z from "zod";


export const companyformSchema = z.object({
  organizationName: z.string().min(2, "Organization Name must be at least 2 characters"),
  categoryIds: z.array(z.string()), // Array of category IDs (now required)
  industries: z.string().min(3, "Industry must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters").max(600, "Description must not be more than 600 characters"),
  imageUrl: z.string(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  owners: z.string().min(3, "Owners must be at least 3 characters"),
  rankCompany: z.string(),
  operatingStatus: z.string().min(2, "Operating status must be at least 2 characters"),
  fundedDate: z.date(),
  contactNumber: z.string(),
  contactEmail: z.string(),
  numberOfSubOrgs: z.string(),
  url: z.string().url(),
  peopleIds: z.array(z.string()), // Array of people IDs
  fundedByIds: z.array(z.string()), // Array of fundedBy IDs
  fundingTypeIds: z.array(z.string()), // Array of fundingType IDs
  fundingTypes: z.array(z.string()),
  fundingAmount: z.string(),
});