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
  endDateTime: Date;
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