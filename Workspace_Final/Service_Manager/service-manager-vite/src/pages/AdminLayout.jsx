import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from 'container/AuthContext';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wait until authentication check is complete
    if (!loading) {
      // Check if user is authenticated and has MANAGER role
      if (!isAuthenticated || !user?.role || user.role.name !== 'MANAGER') {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Optional loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">      
      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-12 bg-gray-100">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;