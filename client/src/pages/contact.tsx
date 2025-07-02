import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT_INFO, BUSINESS_HOURS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-secondary-color">Contact RJ Motorworld</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <div className="bg-primary-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-secondary-color">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-color bg-opacity-10 p-4 rounded-lg mr-4">
                    <i className="fas fa-map-marker-alt text-xl text-primary-color"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-secondary-color">Our Location</h3>
                    <p className="text-gray-one">{CONTACT_INFO.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-color bg-opacity-10 p-4 rounded-lg mr-4">
                    <i className="fas fa-phone-alt text-xl text-primary-color"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-secondary-color">Phone Number</h3>
                    <p className="text-gray-one">
                      <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-primary-color">
                        {CONTACT_INFO.phone}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-color bg-opacity-10 p-4 rounded-lg mr-4">
                    <i className="fas fa-envelope text-xl text-primary-color"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-secondary-color">Email Address</h3>
                    <p className="text-gray-one">
                      <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary-color">
                        {CONTACT_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-color bg-opacity-10 p-4 rounded-lg mr-4">
                    <i className="far fa-clock text-xl text-primary-color"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-secondary-color">Business Hours</h3>
                    <p className="text-gray-one">{BUSINESS_HOURS.weekdays}</p>
                    <p className="text-gray-one">{BUSINESS_HOURS.saturday}</p>
                    <p className="text-gray-one">{BUSINESS_HOURS.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-secondary-color">Connect With Us</h2>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-blue-400 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-500 transition"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-pink-700 transition"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700 transition"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-primary-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary-color">Send Us A Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="sales">Sales Inquiry</SelectItem>
                      <SelectItem value="service">Service Department</SelectItem>
                      <SelectItem value="testdrive">Schedule Test Drive</SelectItem>
                      <SelectItem value="financing">Financing Options</SelectItem>
                      <SelectItem value="trade-in">Trade-in Valuation</SelectItem>
                      <SelectItem value="warranty">Warranty & Service</SelectItem>
                      <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary-color text-primary-white py-3 px-4 rounded-md font-medium hover:bg-primary-dark transition"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-primary-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-4 text-secondary-color">Visit Our Showroom</h3>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19040659885!2d36.68298935820314!3d-1.3031934000000058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1682644104316!5m2!1sen!2s" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="RJ Motorworld Location - Nairobi, Kenya"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
