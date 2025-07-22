// data/grants.ts

import { GrantOpportunity } from "@/types/GrantOpportunity";



export const grants: GrantOpportunity[] = [
  {
    id: "grant-1",
    title: "Africa Digital Transformation Grant",
    description: "Supports digital infrastructure initiatives across Africa.",
    awardingOrganization: "World Bank",
    amount: "Up to $1,000,000",
    eligibility: "Government agencies, NGOs, tech startups",
  },
  {
    id: "grant-2",
    title: "Green Energy Innovation Fund",
    description: "Funds renewable energy initiatives across Sub-Saharan Africa.",
    awardingOrganization: "UNDP",
    amount: "$250,000 – $500,000",
    eligibility: "Enterprises and research institutions in green tech",
  },
  {
    id: "grant-3",
    title: "Women in Tech Accelerator",
    description: "Technical assistance and non-dilutive funding for women-led tech firms.",
    awardingOrganization: "USAID",
    amount: "$100,000",
    eligibility: "Female founders in Africa's tech ecosystem",
  },
];
