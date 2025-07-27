import { Link, useLocation } from "wouter";
import { useAdmin } from "@/hooks/useAdmin";

interface AdminSidebarProps {
  activePage: "dashboard" | "cars" | "inquiries" | "settings";
}

const AdminSidebar = ({ activePage }: AdminSidebarProps) => {
  const [, navigate] = useLocation();
  const { logout } = useAdmin();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: "tachometer-alt",
      active: activePage === "dashboard"
    },
    {
      href: "/admin/cars",
      label: "Car Listings",
      icon: "car",
      active: activePage === "cars"
    },
    {
      href: "/admin/inquiries",
      label: "Sell Requests",
      icon: "clipboard-list",
      active: activePage === "inquiries"
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: "cog",
      active: activePage === "settings"
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="w-64 bg-dark text-white shadow-lg">
      <div className="p-4">
        <div className="text-xl font-bold mb-8">RJ Motorworld Admin</div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={`flex items-center px-4 py-3 ${
                    item.active
                      ? 'bg-primary rounded-md'
                      : 'hover:bg-gray-800 rounded-md'
                  }`}>
                    <i className={`fas fa-${item.icon} w-5`}></i>
                    <span className="ml-3">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
            <li className="mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 w-full text-left text-red-300 hover:bg-gray-800 rounded-md"
              >
                <i className="fas fa-sign-out-alt w-5"></i>
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
