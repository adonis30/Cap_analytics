

import { auth } from '@clerk/nextjs/server';
import { useEffect, useState } from 'react';

// Define a custom hook to get the user ID
export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { sessionClaims } = auth();
        const userId = sessionClaims?.userId as string | null;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserId(null); // Set to null in case of error
      }
    };

    getUserId();
  }, []);

  return userId;
};
