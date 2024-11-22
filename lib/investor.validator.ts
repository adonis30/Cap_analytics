import { z } from 'zod';

// Base schema for common fields
const baseInvestorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  fundedCompanies: z.array(z.string()).nonempty('At least one funded company is required'),
  fundingTypes: z.array(z.string()).nonempty('At least one funding type is required'),
  totalAmountFunded: z.number().min(0, 'Total amount funded must be a positive number'),
  highestAmountFunded: z.number().min(0, 'Highest amount funded must be a positive number'),
  //imageUrl: z.string().optional(),
});

// Export the base schema for use in both individual and institution forms
export type BaseInvestor = z.infer<typeof baseInvestorSchema>;

// Individual investor schema extending the base schema
export const individualInvestorSchema = baseInvestorSchema.extend({
  type: z.literal('Individual'), // Add this line to enforce the type
  individualDetails: z.object({
    age: z.number().min(18, 'Investor must be at least 18 years old'),
    occupation: z.string().optional(),
    firstName: z.string().min(1, 'first Name is required'),
    lastName: z.string().min(1, 'Last Name is Required'),
    bio: z.string().optional(),
    portfolio: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  companyCreator: z.object({
    _id: z.string(), // Add this line to define companyCreator
  }),
});

// Export the schema for use in your individual investor form
export type IndividualInvestor = z.infer<typeof individualInvestorSchema>;

// Institution investor schema extending the base schema
export const institutionInvestorSchema = baseInvestorSchema.extend({
  type: z.literal('Institution'),
  institutionDetails: z.object({
    industryType: z.string().optional(),
    description: z.string().optional(),
    organizationName: z.string().min(3, 'Organization Name is required'),
    website: z.string().optional(),
    contactNumber: z.number().optional(),
    address: z.string().optional(),
    categories: z.array(z.string()).nonempty('at least one category is required'),
    contactEmail: z.string().optional(),
    location: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
});

// Export the schema for use in your institution investor form
export type InstitutionInvestor = z.infer<typeof institutionInvestorSchema>;
