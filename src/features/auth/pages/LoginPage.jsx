import { useNavigate } from 'react-router-dom';
import AuthHero from '../components/AuthHero';
import LoginForm from '../components/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    console.log('Logging in with:', credentials);
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    console.log('Initiating Google OAuth');
    // integrate with Google auth here
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left side: Brand Showcase & Features */}
      <div className="w-full md:w-1/2 lg:w-[48%] xl:w-[45%] flex-shrink-0 min-h-[420px] md:min-h-screen">
        <AuthHero
          title="Run the whole shop from one screen."
          subtitle="Sign in to manage inventory, print jobs, billing and reports — from the counter or from anywhere."
          features={[
            'Real-time stock & job status',
            'Digital invoices & receipts',
            'Remote sales monitoring',
          ]}
        />
      </div>

      {/* Right side: Login Interactive Form */}
      <div className="w-full md:w-1/2 lg:w-[52%] xl:w-[55%] flex items-center justify-center py-12 px-6 sm:px-10 lg:px-16 bg-white min-h-[500px]">
        <LoginForm
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          onRegister={() => navigate('/signup')}
        />
      </div>
    </div>
  );
};

export default LoginPage;
