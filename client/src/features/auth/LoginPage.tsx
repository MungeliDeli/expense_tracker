import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { AppLogo, APP_NAME } from '../../components/AppLogo';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { ThemeSettings } from '../../components/ThemeSettings';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ToastContainer } from '../../components/ToastContainer';

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await login(password, rememberMe);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <AnimatedBackground />

      <div className="absolute top-4 right-4 z-20">
        <ThemeSettings />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="glass rounded-3xl card-shadow-lg p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <AppLogo size="lg" className="mb-5" />
            <h1 className="text-3xl font-bold text-foreground">{APP_NAME}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                autoComplete="current-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-muted hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-card accent-[rgb(var(--primary))]"
              />
              Remember me
            </label>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              <Lock size={18} />
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Smart personal finance
          </p>
        </div>
      </motion.div>

      <ToastContainer />
    </div>
  );
};
