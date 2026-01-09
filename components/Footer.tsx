import Link from "next/link";
import { BUSINESS_HOURS, CONTACT_INFO, SOCIAL_MEDIA } from "@/lib/constants";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary-dark text-primary-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RJ Motorworld</h3>
            <p className="text-gray-three mb-4">
              Premium car dealership offering the finest selection of new and used vehicles. Experience excellence in automotive retail.
            </p>
            <div className="flex space-x-4">
              <a href={SOCIAL_MEDIA.facebook} className="text-gray-three hover:text-primary-accent">
                <Facebook size={20} />
              </a>
              <a href={SOCIAL_MEDIA.twitter} className="text-gray-three hover:text-primary-accent">
                <Twitter size={20} />
              </a>
              <a href={SOCIAL_MEDIA.instagram} className="text-gray-three hover:text-primary-accent">
                <Instagram size={20} />
              </a>
              <a href={SOCIAL_MEDIA.youtube} className="text-gray-three hover:text-primary-accent">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-three hover:text-primary-accent cursor-pointer">Home</Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-three hover:text-primary-accent cursor-pointer">Cars</Link>
              </li>
              <li>
                <Link href="/cars/new" className="text-gray-three hover:text-primary-accent cursor-pointer">New Cars</Link>
              </li>
              <li>
                <Link href="/cars/used" className="text-gray-three hover:text-primary-accent cursor-pointer">Used Cars</Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-three hover:text-primary-accent cursor-pointer">Sell Your Car</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-three hover:text-primary-accent cursor-pointer">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-three hover:text-primary-accent cursor-pointer">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary-accent h-5 w-5" />
                <span className="text-gray-three">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-primary-accent h-5 w-5" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray-three hover:text-primary-accent">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-primary-accent h-5 w-5" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-three hover:text-primary-accent">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-primary-white">Business Hours:</h4>
              <p className="text-gray-three text-sm">{BUSINESS_HOURS.weekdays}</p>
              <p className="text-gray-three text-sm">{BUSINESS_HOURS.saturday}</p>
              <p className="text-gray-three text-sm">{BUSINESS_HOURS.sunday}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-three mb-4">Subscribe to our newsletter for the latest inventory and special offers.</p>
            
            <form>
              <div className="flex mb-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow p-2 text-secondary-dark rounded-l-md focus:outline-none"
                />
                <button type="submit" className="bg-primary-color text-primary-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition">
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary-color rounded" />
                <span className="ml-2 text-xs text-gray-three">I agree to receive marketing emails</span>
              </label>
            </form>
          </div>
        </div>
        
        <div className="border-t border-secondary-light pt-8 mt-8 text-center text-gray-two text-sm">
          <p>&copy; {new Date().getFullYear()} RJ Motorworld. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-gray-two hover:text-primary-accent">Privacy Policy</a>
            <a href="#" className="text-gray-two hover:text-primary-accent">Terms of Service</a>
            <a href="#" className="text-gray-two hover:text-primary-accent">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
