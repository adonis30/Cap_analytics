// app/companies/create/page.tsx (or wherever needed)

'use server'; // This marks the function as a server action

import { auth } from '@clerk/nextjs/server';

// Server-side function to get the user ID
export const getUserId = async () => {
  try {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string | null;
    return userId;  // Returning the user ID
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;  // In case of error, return null
  }
};
