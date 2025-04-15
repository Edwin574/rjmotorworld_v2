import { Link } from "wouter";
import { BUSINESS_HOURS, CONTACT_INFO } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AutoElite</h3>
            <p className="text-gray-300 mb-4">
              Premium car dealership offering the finest selection of new and used vehicles. Experience excellence in automotive retail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Home</a></Link></li>
              <li><Link href="/cars"><a className="text-gray-300 hover:text-white">Cars</a></Link></li>
              <li><Link href="/cars/new"><a className="text-gray-300 hover:text-white">New Cars</a></Link></li>
              <li><Link href="/cars/used"><a className="text-gray-300 hover:text-white">Used Cars</a></Link></li>
              <li><Link href="/sell"><a className="text-gray-300 hover:text-white">Sell Your Car</a></Link></li>
              <li><Link href="/about"><a className="text-gray-300 hover:text-white">About Us</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-300 hover:text-white">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-300"></i>
                <span className="text-gray-300">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-gray-300"></i>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray-300 hover:text-white">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-gray-300"></i>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-300 hover:text-white">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Business Hours:</h4>
              <p className="text-gray-300 text-sm">{BUSINESS_HOURS.weekdays}</p>
              <p className="text-gray-300 text-sm">{BUSINESS_HOURS.saturday}</p>
              <p className="text-gray-300 text-sm">{BUSINESS_HOURS.sunday}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest inventory and special offers.</p>
            
            <form>
              <div className="flex mb-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow p-2 text-dark rounded-l-md focus:outline-none"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary rounded" />
                <span className="ml-2 text-xs text-gray-300">I agree to receive marketing emails</span>
              </label>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AutoElite. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
