'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // 🔹 Повертаємо на головну після виходу
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/events" className="text-xl font-semibold text-gray-800">
        🎉 My Events
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-gray-700 hover:text-blue-500">
            Profile
          </Link>
          <Link href="/scan" className="text-gray-700 hover:text-blue-500">
            Scan
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/" className="text-blue-500">
          Login
        </Link>
      )}
    </nav>
  );
}