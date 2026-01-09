import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/logo.png";

const Header = () => {
  const router = useRouter();
  const location = router.asPath || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    // { href: "/cars/new", label: "New" },
    // { href: "/cars/used", label: "Used" },
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
            <Link href="/" className="flex items-center cursor-pointer">
              <Image 
                src={logoImage} 
                alt="RJ Motorworld" 
                width={48}
                height={48}
                className="h-12 w-auto" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={`font-medium cursor-pointer ${
                  location === item.href 
                    ? 'text-primary-color border-b-2 border-primary-accent' 
                    : 'text-gray-three hover:text-primary-color transition'
                }`}>
                {item.label}
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
                <Link key={item.href} href={item.href} className={`font-medium cursor-pointer ${
                      location === item.href 
                        ? 'text-primary-color' 
                        : 'text-gray-three hover:text-primary-color transition'
                    }`} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
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
