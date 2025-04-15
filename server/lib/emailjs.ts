import type { SellInquiry } from "@shared/schema";
import fetch from 'node-fetch';

// Get EmailJS credentials from environment variables
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID || 'your_user_id';

/**
 * Sends an email notification for a new sell inquiry
 * @param inquiry The sell inquiry data
 * @returns Promise resolving when the email is sent
 */
export async function sendSellInquiryEmail(inquiry: SellInquiry): Promise<void> {
  try {
    // If using actual EmailJS
    if (EMAILJS_SERVICE_ID !== 'your_service_id' && 
        EMAILJS_TEMPLATE_ID !== 'your_template_id' && 
        EMAILJS_USER_ID !== 'your_user_id') {
      
      // Prepare template parameters
      const templateParams = {
        to_email: process.env.ADMIN_EMAIL || 'admin@example.com',
        from_name: 'AutoElite Car Dealership',
        reply_to: inquiry.email,
        inquiry_id: inquiry.id,
        seller_name: inquiry.fullName,
        seller_email: inquiry.email,
        seller_phone: inquiry.phone,
        seller_type: inquiry.sellerType,
        vehicle_make: inquiry.make,
        vehicle_model: inquiry.model,
        vehicle_year: inquiry.year,
        vehicle_color: inquiry.color,
        vehicle_mileage: inquiry.mileage,
        asking_price: inquiry.askingPrice,
        location: inquiry.location,
        contact_method: inquiry.contactMethod,
        additional_notes: inquiry.additionalNotes || 'None provided'
      };
      
      // Make API request to EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_USER_ID,
          template_params: templateParams
        })
      });
      
      if (!response.ok) {
        throw new Error(`EmailJS send failed: ${response.statusText}`);
      }
    } else {
      // For development without EmailJS credentials, log the email that would be sent
      console.log('Email would be sent with the following data:', {
        inquiry_id: inquiry.id,
        seller_name: inquiry.fullName,
        seller_email: inquiry.email,
        vehicle: `${inquiry.year} ${inquiry.make} ${inquiry.model}`,
        asking_price: `$${inquiry.askingPrice}`
      });
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    // We don't throw here because we don't want to fail the inquiry submission
    // if the email fails
  }
}
