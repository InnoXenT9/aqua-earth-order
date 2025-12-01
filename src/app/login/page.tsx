import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to AquaOrder</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
             <p className="mt-2">
                <Link href="#" className="font-semibold text-primary hover:underline">
                    Forgot password?
                </Link>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}