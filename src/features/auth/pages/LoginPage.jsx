import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHero from '../components/AuthHero';
import LoginForm from '../components/LoginForm';
import { useAuth, getRoleHomeRoute } from '../../../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, user, loading } = useAuth();

  // Redirect automatically if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate(getRoleHomeRoute(user.role), { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await login(credentials);
      navigate(getRoleHomeRoute(loggedUser?.role));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      navigate(getRoleHomeRoute(loggedUser?.role));
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
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
