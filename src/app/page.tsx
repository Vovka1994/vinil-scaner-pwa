import AuthButton from '@/components/AuthButton';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Welcome</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>
        <AuthButton />
      </div>
    </main>
  );
}