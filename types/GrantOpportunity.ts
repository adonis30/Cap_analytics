// types/GrantOpportunity.ts

export interface GrantOpportunity {
  _id: string; // MongoDB ObjectId as string
  title: string;
  description: string;
  awardingOrg: string;
  orgURL: string;
  amount: number;
  eligibility: string;
  duration: string;
  expiredingDate: Date; // or Date if you're parsing it
}
