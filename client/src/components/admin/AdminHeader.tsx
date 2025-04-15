import { useAdmin } from "@/hooks/useAdmin";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { credentials } = useAdmin();
  
  // Extract username for display
  const username = credentials?.username || "Admin";
  const displayName = username.split('@')[0];
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-medium hover:text-primary">
            <i className="fas fa-bell"></i>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <i className="fas fa-user"></i>
            </div>
            <span className="font-medium capitalize">{displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
