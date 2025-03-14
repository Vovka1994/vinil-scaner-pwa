'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/'); // 🔹 Якщо не залогінений, перекидаємо на головну
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  return user ? (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">User ID: {user.id}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
}