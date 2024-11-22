import { ReactNode } from "react";

// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== COMPANY PARAMS
export type CreateCompanyParams = {
  company: {
    userId: string;
    organizationName: string;
    categoryIds: string[];
    industries: string;
    description: string;
    imageUrl: string;
    location: string;
    owners: string;
    rankCompany: string;
    operatingStatus: string;
    fundedDate: Date;
    contactNumber: string;
    contactEmail: string;
    numberOfSubOrgs: string;
    url: string;
    peopleIds: string[];
    fundedByIds: string[];
    fundingTypeIds: string[];
  };
  userId: string;
  path: string;
};





// Individual investor props extending base investor fields
export type CreateIndividualInvestorProps = BaseInvestorProps & {
  type: 'Individual'; // Must be 'Individual' for this form
  individualDetails: {
    firstName: string;  // Required firstName
    lastName: string;   // Required lastName
    position?: string;  // Optional position field
    linkedInUrl?: string;  // Optional LinkedIn URL
    imageUrl: string;  // Required profile image URL
    bio?: string;
    portfolio?: string;  // Optional short biography
  };
};

export type GetRelatedCompaniesByCategoryParams = {
  categoryId: string;
  companyId: string;
  limit?: number;
  page: number | string;
};

export type GetCompaniesByUserParams = {
  userId: string;
  limit?: number;
  page: number;
};

export type UpdateCompanyParams = {
  userId: string;
  company: {
    _id: string;
    organizationName?: string;
    categoryIds?: string[];
    industries?: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    owners?: string;
    rankCompany?: string;
    operatingStatus?: string;
    fundedDate?: Date;
    contactNumber?: string;
    contactEmail?: string;
    numberOfSubOrgs?: string;
    url?: string;
    peopleIds?: string[];
    fundedByIds?: string[];
    fundingTypeIds?: string[];
  };
  path: string;
};

export type UpdateInstitutionInvestorProps = {
  _id: string; // ID of the investor to update
  type: 'Institution';
  name?: string;
  email?: string;
  phoneNumber?: string;
  totalAmountFunded?: number;
  highestAmountFunded?: number;
  fundedCompaniesIds?: string[]; // Optional array of funded company IDs
  fundingTypes?: string[]; // Optional array of funding type IDs
  institutionDetails?: {
    organizationName?: string;
    description?: string;
    website?: string;
    contactNumber?: string;
    address?: string;
    categories?: string[]; // Optional array of category IDs
    contactEmail?: string;
    location?: string;
    imageUrl?: string; // Optional profile image URL
    portfolio?: string; // Optional portfolio URL
  };
};

export type UpdateIndividualInvestorProps = {
  _id: string; // ID of the investor to update
  type: 'Individual';
  name?: string;
  email?: string;
  phoneNumber?: string;
  totalAmountFunded?: number;
  highestAmountFunded?: number;
  fundedCompaniesIds?: string[]; // Optional array of funded company IDs
  fundingTypes?: string[]; // Optional array of funding type IDs
  firstName?: string;
  lastName?: string;
  position?: string; // Optional position field
  linkedInUrl?: string; // Optional LinkedIn URL
  imageUrl?: string; // Optional profile image URL
  bio?: string; // Optional short biography
};
// Shared base investor fields
export type BaseInvestorProps = {
  type: "Individual" | "Institution";
  name: string;
  email: string;
  phoneNumber: string;
  totalAmountFunded: number;
  highestAmountFunded: number;
  fundingTypes?: string[]; // Array of funding type IDs
  fundedCompaniesIds?: string[]; // Array of funded company IDs
};

export type IndividualInvestorProps = BaseInvestorProps & {
  userId: string;
  individualDetails: {
    firstName: string;
    lastName: string;
    position?: string;
    linkedInUrl?: string;
    portfolio?: string;
    imageUrl?: string;
    bio?: string;
  };
};
export type InstitutionInvestorProps = BaseInvestorProps & {
  institutionDetails: {
    organizationName: string;
    description?: string;
    website?: string;
    contactNumber?: string;
    address?: string;
    categories?: string[];  // Array of category IDs
    contactEmail?: string;
    location?: string;
    imageUrl?: string;
  };
};

export type GetRelatedInvestorsByCategoryParams = {
  categoryId: string;
  investorId: string;
  limit?: number;
  page: number | string;
};

export type DeleteCompanyParams = {
  companyId: string;
  path: string;
};

export type GetAllCompanyParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetAllInvestorsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
}

// ====== INVESTOR PARAMS
export type Investor = {
  imageUrl: string | undefined;
  description?: string;
  _id: string;
  type: "Individual" | "Institution";
  name: string;
  email: string;
  phoneNumber?: string;
  fundedCompaniesIds?: string[];
  fundingTypes?: string[];
  totalAmountFunded: number;
  highestAmountFunded: number;
  individualDetails?: {
    firstName: string;
    lastName: string;
    position?: string;
    linkedInUrl?: string;
    imageUrl?: string;
    bio?: string;
  };
  institutionDetails?: {
    organizationName: string;
    description?: string;
    website?: string;
    contactNumber?: string;
    address?: string;
    categories?: string[];
    contactEmail?: string;
    location?: string;
    imageUrl?: string;
  };
};

// ====== EVENT PARAMS
export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetEventsByUserParams = {
  userId: string;
  limit?: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};


export type Event = {
  _id: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
  location: string;
  startDateTime: Date;
  url: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
};

// ==== ORGANIZATION PARAMS
export type Organization = {
  _id: string;
  organizationName: string;
  description: string;
  imageUrl: string;
  category: {
    _id: string;
    name: string;
  };
  location: string;
};

export type Company = {
  _id: string;
  organizationName: string;
  description?: string;
  industries?: string;
  owners?: string;
  rankCompany?: string;
  operatingStatus?: string;
  contactNumber?: string;
  contactEmail?: string;
  numberOfSubOrgs?: string;
  location?: string;
  imageUrl: string;
  fundedDate?: Date;
  url?: string;
  categories: string[];
  people: string[];
  fundedBy: string[];
  fundingTypes: string[];
  companyCreator: { _id: string; firstName: string; lastName: string };
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type MultiSelectProps = {
  options: { value: string; label: string }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
  createCategory?: (categoryName: string) => Promise<{ value: string; label: string }>;
  createFundingType?: (fundingTypeName: string) => Promise<{ value: string; label: string }>;
};
