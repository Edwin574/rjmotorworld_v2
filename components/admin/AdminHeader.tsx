import { useAuth } from "../../contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  
  // Extract username for display
  const username = user?.username || "Admin";
  const displayName = username.split('@')[0];
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-gray-medium">RJ Motorworld Administration Panel</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <i className="fas fa-user text-sm"></i>
            </div>
            <div className="text-left">
              <span className="font-medium capitalize block">{displayName}</span>
              <span className="text-xs text-gray-medium">Administrator</span>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
