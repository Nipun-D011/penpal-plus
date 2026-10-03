import { useNavigate } from 'react-router-dom';
import AuthHero from '../components/AuthHero';
import SignupForm from '../components/SignupForm';

export const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    console.log('Registering user with:', formData);
    navigate('/dashboard');
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left side: Brand Showcase & Features */}
      <div className="w-full md:w-1/2 lg:w-[48%] xl:w-[45%] flex-shrink-0 min-h-[420px] md:min-h-screen">
        <AuthHero
          title="Set up your team in minutes."
          subtitle="Create an account for the owner or add staff logins with the right level of access to each module."
          features={[
            'Role-based access for staff & admin',
            'Automatic cloud backup',
            'No setup cost to get started',
          ]}
        />
      </div>

      {/* Right side: Signup Interactive Form */}
      <div className="w-full md:w-1/2 lg:w-[52%] xl:w-[55%] flex items-center justify-center py-12 px-6 sm:px-10 lg:px-16 bg-white min-h-[500px]">
        <SignupForm
          onSubmit={handleSignup}
          onLogin={handleNavigateLogin}
        />
      </div>
    </div>
  );
};

export default SignupPage;
