import { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Checkbox from '../../../components/common/Checkbox';
import GoogleSignInButton from './GoogleSignInButton';

export const LoginForm = ({ onSubmit, onGoogleSignIn, onForgotPassword, onRegister }) => {
  const [identifier, setIdentifier] = useState('aravinda@penpalplus.lk');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your email or username';
    }
    if (!password) {
      newErrors.password = 'Please enter your password';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ identifier, password, rememberMe });
      } else {
        // Mock sign in delay if no handler passed
        await new Promise((resolve) => setTimeout(resolve, 800));
        alert(`Signed in successfully as ${identifier}`);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Failed to sign in. Please check credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (onGoogleSignIn) {
      onGoogleSignIn();
    } else {
      alert('Google authentication triggered');
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto px-4 sm:px-0">
      {/* Header text */}
      <div className="text-left mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111827] tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-normal">
          Sign in to your Pen Pal Plus account
        </p>
      </div>

      {errors.form && (
        <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errors.form}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="identifier"
            label="Email or username"
            type="text"
            placeholder="aravinda@penpalplus.lk"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors({ ...errors, identifier: null });
            }}
            error={errors.identifier}
            required
          />
        </div>

        <div>
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            error={errors.password}
            required
          />
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <button
            type="button"
            onClick={onForgotPassword || (() => alert('Navigate to Forgot Password'))}
            className="text-xs font-semibold text-[#1e3a8a] hover:text-[#172554] transition-colors focus:outline-none focus:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full bg-[#131e36] hover:bg-[#1a2948] text-white py-3 rounded-lg font-medium text-sm shadow-sm transition-all"
          >
            Sign in
          </Button>
        </div>
      </form>

      {/* OR Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400">OR</span>
        </div>
      </div>

      {/* Social Sign-In */}
      <div>
        <GoogleSignInButton onClick={handleGoogleAuth} />
      </div>

      {/* Registration Link */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-600 font-normal">
          New to Pen Pal Plus?{' '}
          <button
            type="button"
            onClick={onRegister || (() => alert('Navigate to Register'))}
            className="font-semibold text-[#1e3a8a] hover:underline focus:outline-none"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
