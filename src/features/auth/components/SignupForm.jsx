import { useState } from 'react';
import { Tag, User, UserCheck, Truck, ChevronDown } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Checkbox from '../../../components/common/Checkbox';

const SUPPLY_CATEGORIES = [
  'Paper & Board',
  'Inks & Toners',
  'Equipment Spares',
  'Stationery & Books',
  'Packaging Materials',
  'General Supplies',
];

const PAYMENT_TERMS = [
  'Net 30',
  'COD (Cash on Delivery)',
  'Credit 30 Days',
  'Credit 15 Days',
  'Advance Payment',
];

const STAFF_DEPARTMENTS = [
  'Prepress Operator',
  'Press Lead',
  'Cashier',
  'Inventory Associate',
  'Counter Staff',
  'Graphic Designer',
  'Store Supervisor',
];

export const SignupForm = ({ onSubmit, onLogin }) => {
  const [accountType, setAccountType] = useState('customer'); // 'customer', 'supplier', 'staff', 'owner'

  // Customer specific fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Supplier specific fields
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState(SUPPLY_CATEGORIES[0]);
  const [paymentTerms, setPaymentTerms] = useState(PAYMENT_TERMS[0]);

  // Staff specific fields
  const [department, setDepartment] = useState(STAFF_DEPARTMENTS[0]);

  // Admin / Store specific fields
  const [businessName, setBusinessName] = useState('PEN PAL PLUS (PVT) LTD');

  // Shared credential fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAccountTypeChange = (newType) => {
    setAccountType(newType);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    // Password validation across all account types
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service & Privacy Policy';
    }

    // Dynamic field validation per accountType
    if (accountType === 'customer') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!address.trim()) {
        newErrors.address = 'Delivery address is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (accountType === 'supplier') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Company / Vendor name is required';
      }
      if (!contactPerson.trim()) {
        newErrors.contactPerson = 'Contact person is required';
      }
      if (!category.trim()) {
        newErrors.category = 'Supply category is required';
      }
      if (!paymentTerms.trim()) {
        newErrors.paymentTerms = 'Payment terms are required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (accountType === 'staff') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!department.trim()) {
        newErrors.department = 'Department / designation is required';
      }
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Staff email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (!email.toLowerCase().endsWith('@penpalplus.lk')) {
        newErrors.email = 'Staff accounts must use a @penpalplus.lk email address';
      }
    } else if (accountType === 'owner') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Admin email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (!email.toLowerCase().endsWith('@penpalplus.lk')) {
        newErrors.email = 'Admin accounts must use a @penpalplus.lk email address';
      }
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
          fullName: accountType === 'supplier' ? contactPerson : fullName,
          contactPerson: accountType === 'supplier' ? contactPerson : fullName,
          companyName: accountType === 'supplier' ? companyName : businessName,
          businessName: accountType === 'supplier' ? companyName : businessName,
          phoneNumber,
          address,
          category: accountType === 'supplier' ? category : '',
          paymentTerms: accountType === 'supplier' ? paymentTerms : '',
          department: accountType === 'staff' ? department : '',
          designation: accountType === 'staff' ? department : '',
          email,
          password,
          agreeTerms,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        alert('Account created successfully!');
      }
    } catch (err) {
      let msg = err.message || 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'The password is too weak. Please use a stronger password with at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      id: 'customer',
      label: 'Customer',
      icon: UserCheck,
      subtitle: 'Order tracking & digital billing',
    },
    {
      id: 'supplier',
      label: 'Supplier',
      icon: Truck,
      subtitle: 'Stock procurement & vendor ledger',
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: User,
      subtitle: 'Print press & counter operations',
    },
    {
      id: 'owner',
      label: 'Admin',
      icon: Tag,
      subtitle: 'Store & financial administration',
    },
  ];

  const currentTypeConfig = accountTypes.find((t) => t.id === accountType) || accountTypes[0];

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 sm:px-0">
      {/* Header text */}
      <div className="text-left mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111827] tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
          {currentTypeConfig.subtitle}
        </p>
      </div>

      {errors.form && (
        <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg text-left">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2">
            {accountTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = accountType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleAccountTypeChange(type.id)}
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

        {/* Dynamic Fields - Customer: Full Name, Phone Number, Delivery Address, Email Address, Password */}
        {accountType === 'customer' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="fullName"
                label="Full name"
                type="text"
                placeholder="e.g. Kumari Fonseka"
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
                placeholder="e.g. 077 233 1190"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                error={errors.phoneNumber}
                required
              />
            </div>

            <Input
              id="address"
              label="Delivery Address"
              type="text"
              placeholder="e.g. No. 45, Puttalam Road, Kurunegala"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: null });
              }}
              error={errors.address}
              required
            />

            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="e.g. kumari.fonseka@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              required
            />
          </>
        )}

        {/* Dynamic Fields - Supplier: Company / Vendor Name, Contact Person, Supply Category, Payment Terms, Email, Password */}
        {accountType === 'supplier' && (
          <>
            <Input
              id="companyName"
              label="Company / Vendor Name"
              type="text"
              placeholder="e.g. Sandun Papers / Sarasavi Wholesalers"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (errors.companyName) setErrors({ ...errors, companyName: null });
              }}
              error={errors.companyName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="contactPerson"
                label="Contact Person"
                type="text"
                placeholder="e.g. Sandun Perera"
                value={contactPerson}
                onChange={(e) => {
                  setContactPerson(e.target.value);
                  if (errors.contactPerson) setErrors({ ...errors, contactPerson: null });
                }}
                error={errors.contactPerson}
                required
              />
              <Input
                id="phoneNumber"
                label="Contact Phone (Optional)"
                type="tel"
                placeholder="e.g. 011 258 3390"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                error={errors.phoneNumber}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full space-y-1.5 text-left">
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold text-slate-800 uppercase tracking-wide"
                >
                  Supply Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (errors.category) setErrors({ ...errors, category: null });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#131e36]/20 focus:border-[#131e36] appearance-none cursor-pointer pr-10 ${
                      errors.category
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {SUPPLY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div className="w-full space-y-1.5 text-left">
                <label
                  htmlFor="paymentTerms"
                  className="block text-xs font-semibold text-slate-800 uppercase tracking-wide"
                >
                  Payment Terms <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => {
                      setPaymentTerms(e.target.value);
                      if (errors.paymentTerms) setErrors({ ...errors, paymentTerms: null });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#131e36]/20 focus:border-[#131e36] appearance-none cursor-pointer pr-10 ${
                      errors.paymentTerms
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {PAYMENT_TERMS.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {errors.paymentTerms && (
                  <p className="text-xs text-red-500 mt-1">{errors.paymentTerms}</p>
                )}
              </div>
            </div>

            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="e.g. orders@sarasavi.lk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              required
            />
          </>
        )}

        {/* Dynamic Fields - Staff: Full Name, Staff Email (@penpalplus.lk), Department / Designation, Phone Number, Password */}
        {accountType === 'staff' && (
          <>
            <Input
              id="fullName"
              label="Full name"
              type="text"
              placeholder="e.g. Dinesh Gamage"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              error={errors.fullName}
              required
            />

            <Input
              id="email"
              label="Staff Email (@penpalplus.lk)"
              type="email"
              placeholder="e.g. dinesh@penpalplus.lk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full space-y-1.5 text-left">
                <label
                  htmlFor="department"
                  className="block text-xs font-semibold text-slate-800 uppercase tracking-wide"
                >
                  Department / Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department) setErrors({ ...errors, department: null });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#131e36]/20 focus:border-[#131e36] appearance-none cursor-pointer pr-10 ${
                      errors.department
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {STAFF_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {errors.department && (
                  <p className="text-xs text-red-500 mt-1">{errors.department}</p>
                )}
              </div>

              <Input
                id="phoneNumber"
                label="Phone number"
                type="tel"
                placeholder="e.g. 071 456 7890"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                error={errors.phoneNumber}
                required
              />
            </div>
          </>
        )}

        {/* Dynamic Fields - Admin (Owner): Full Name, Phone Number, Business Name, Admin Email, Password */}
        {accountType === 'owner' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="fullName"
                label="Full name"
                type="text"
                placeholder="e.g. Aravinda Perera"
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
                placeholder="e.g. 077 233 1190"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                error={errors.phoneNumber}
                required
              />
            </div>

            <Input
              id="businessName"
              label="Business / Store Name"
              type="text"
              placeholder="PEN PAL PLUS (PVT) LTD"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                if (errors.businessName) setErrors({ ...errors, businessName: null });
              }}
              error={errors.businessName}
              required
            />

            <Input
              id="email"
              label="Admin Email (@penpalplus.lk)"
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
          </>
        )}

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
