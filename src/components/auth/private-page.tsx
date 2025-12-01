'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface PrivatePageProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function PrivatePage({ children, adminOnly = false }: PrivatePageProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isUserLoading) {
        if (!user) {
          router.replace('/login');
          setAuthCheckCompleted(true);
          return;
        }

        if (adminOnly) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setIsAdmin(true);
          } else {
            router.replace('/');
          }
        }
        setAuthCheckCompleted(true);
      }
    };

    checkAdmin();
  }, [user, isUserLoading, adminOnly, router, firestore]);

  if (!authCheckCompleted || (adminOnly && !isAdmin)) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-16 w-1/3" />
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}