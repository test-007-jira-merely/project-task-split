import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError('');
      await signIn(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link to="/auth/signup" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};
