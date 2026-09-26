import { useState } from 'react';
import { Tag, User, UserCheck } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Checkbox from '../../../components/common/Checkbox';

export const SignupForm = ({ onSubmit, onLogin }) => {
  const [accountType, setAccountType] = useState('owner'); // 'owner', 'staff', 'customer'
  const [fullName, setFullName] = useState('Aravinda Perera');
  const [phoneNumber, setPhoneNumber] = useState('077 233 1190');
  const [businessName, setBusinessName] = useState('PEN PAL PLUS (PVT) LTD');
  const [email, setEmail] = useState('aravinda@penpalplus.lk');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service & Privacy Policy';
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
        await onSubmit({
          accountType,
          fullName,
          phoneNumber,
          businessName,
          email,
          password,
          agreeTerms,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        alert(`Account created successfully for ${fullName} (${accountType})!`);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      id: 'owner',
      label: 'Owner / Admin',
      icon: Tag,
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: User,
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 sm:px-0">
      {/* Header text */}
      <div className="text-left mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111827] tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
          Set up access for the shop's management system
        </p>
      </div>

      {errors.form && (
        <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errors.form}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide mb-2 text-left">
            Account type
          </label>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {accountTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = accountType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAccountType(type.id)}
                  className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border text-center transition-all duration-150 focus:outline-none ${
                    isSelected
                      ? 'border-[#d5983b] bg-[#fffdf5] ring-2 ring-[#d5983b]/20 shadow-sm text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1.5 transition-colors ${
                      isSelected ? 'text-[#b87d2b]' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-xs font-medium tracking-tight leading-tight">
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full name & Phone number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="fullName"
            label="Full name"
            type="text"
            placeholder="Aravinda Perera"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors({ ...errors, fullName: null });
            }}
            error={errors.fullName}
            required
          />
          <Input
            id="phoneNumber"
            label="Phone number"
            type="tel"
            placeholder="077 233 1190"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Business name */}
        <Input
          id="businessName"
          label={accountType === 'customer' ? 'Business name (Optional)' : 'Business name'}
          type="text"
          placeholder="PEN PAL PLUS (PVT) LTD"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        {/* Email address */}
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="aravinda@penpalplus.lk"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          error={errors.email}
          required
        />

        {/* Password & Confirm password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            error={errors.password}
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
            error={errors.confirmPassword}
            required
          />
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1 text-left">
          <Checkbox
            id="agreeTerms"
            label="I agree to the Terms of Service & Privacy Policy"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
            }}
          />
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full bg-[#131e36] hover:bg-[#1a2948] text-white py-3 rounded-lg font-medium text-sm shadow-sm transition-all"
          >
            Create account
          </Button>
        </div>
      </form>

      {/* Already have an account */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-600 font-normal">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLogin}
            className="font-semibold text-[#1e3a8a] hover:underline focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
