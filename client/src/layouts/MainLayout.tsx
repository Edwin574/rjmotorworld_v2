import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [location] = useLocation();
  
  // Check if current path is an admin route
  const isAdminRoute = location.startsWith('/admin');
  
  // For login page, only show the Header, for dashboard don't show header/footer
  if (location === '/admin') {
    return (
      <>
        <Header />
        <main className="min-h-screen">{children}</main>
      </>
    );
  } else if (isAdminRoute) {
    return <main>{children}</main>;
  }
  
  // Regular layout with header and footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
