'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await saveUserToDB(user); // Додаємо користувача в базу
        router.push('/events'); // 🔹 Редирект, якщо вже авторизований
      }
    };
    getUser();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error(error);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };


  const saveUserToDB = async (user: any) => {
    const { data, error } = await supabase
      .from('users')
      .upsert([{ 
        id: user.id, 
        email: user.email, 
        full_name: user.user_metadata.full_name, 
        avatar_url: user.user_metadata.avatar_url 
      }]);
    if (error) console.error('Error saving user:', error);
  };

  return (
    <div>
      {user ? (
        <div>
          <p className="text-gray-800 mb-4">Welcome, {user.email}</p>
          <button
            onClick={signOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M..."></path>
            <path fill="#34A853" d="M..."></path>
            <path fill="#FBBC05" d="M..."></path>
            <path fill="#EA4335" d="M..."></path>
          </svg>
          Sign in with Google
        </button>
      )}
    </div>
  );
}