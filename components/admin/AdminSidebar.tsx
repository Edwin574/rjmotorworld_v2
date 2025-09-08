import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AdminAuthContext";
import logo from "@/assets/logo.png";

interface AdminSidebarProps {
  activePage: "dashboard" | "cars" | "inquiries" | "settings";
}

const AdminSidebar = ({ activePage }: AdminSidebarProps) => {
  const [, navigate] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: "tachometer-alt",
      active: activePage === "dashboard",
    },
    {
      href: "/admin/cars",
      label: "Car Listings",
      icon: "car",
      active: activePage === "cars",
    },
    {
      href: "/admin/inquiries",
      label: "Sell Requests",
      icon: "clipboard-list",
      active: activePage === "inquiries",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: "cog",
      active: activePage === "settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-100 shadow-lg min-h-screen">
      <div className="p-5">
        <div className="flex items-center mb-8">
          <img
            src={logo}
            alt="RJ Motorworld Logo"
            className="w-9 h-9 mr-3 rounded-sm shadow"
          />
          <div className="text-lg font-semibold tracking-tight">RJ Motorworld Admin</div>
        </div>

        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      item.active
                        ? "bg-primary text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <i className={`fas fa-${item.icon} w-5 opacity-90`}></i>
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
            <li className="mt-6 pt-6 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 w-full text-left text-red-300 hover:text-white hover:bg-slate-800 rounded-md"
              >
                <i className="fas fa-sign-out-alt w-5"></i>
                <span className="ml-3 text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
