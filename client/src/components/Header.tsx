import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/logo.png";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/cars/new", label: "New Cars" },
    { href: "/cars/used", label: "Used Cars" },
    { href: "/sell", label: "Sell Your Car" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" }
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-secondary-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="RJ Motorworld" 
                  className="h-12 w-auto" 
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={`font-medium cursor-pointer ${
                  location === item.href 
                    ? 'text-primary-color border-b-2 border-primary-accent' 
                    : 'text-gray-three hover:text-primary-color transition'
                }`}>
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-primary-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4 pt-2 border-t border-secondary-light">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={`font-medium cursor-pointer ${
                      location === item.href 
                        ? 'text-primary-color' 
                        : 'text-gray-three hover:text-primary-color transition'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
