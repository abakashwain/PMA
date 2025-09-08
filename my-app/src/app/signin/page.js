// src/app/(auth)/signin/page.jsx
import LoginForm from '@/components/forms/LoginForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-gray-800 border border-gray-700 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-100">Welcome Back</h2>
        <LoginForm />
      </div>
    </div>
  );
}