import { useState } from "react";
import { Link, useLocation } from "wouter";

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <a className="text-primary font-bold text-2xl">AutoElite</a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`font-medium ${location === item.href ? 'text-primary' : 'text-gray-medium hover:text-primary transition'}`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-dark focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`font-medium ${location === item.href ? 'text-primary' : 'text-gray-medium hover:text-primary transition'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
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
