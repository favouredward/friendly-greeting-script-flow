
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicantEmail, applicantName, amount, monthsPaid, paymentReference } = await req.json();

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Configuration - Update these as needed
    const COMPANY_NAME = "Your Company Name"; // Update this
    const FROM_EMAIL = "payments@yourcompany.com"; // Update this to your verified domain
    const SUPPORT_EMAIL = "support@yourcompany.com"; // Update this
    const COMPANY_WEBSITE = "https://yourcompany.com"; // Update this

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
          <h1>Payment Confirmation</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2>Thank you for your payment, ${applicantName}!</h2>
          
          <p>We have successfully received your payment. Here are the details:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Payment Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <strong>Amount Paid:</strong> ₦${amount.toLocaleString()}
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <strong>Months Paid:</strong> ${monthsPaid} month${monthsPaid > 1 ? 's' : ''}
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <strong>Payment Reference:</strong> ${paymentReference}
              </li>
              <li style="padding: 8px 0;">
                <strong>Payment Date:</strong> ${new Date().toLocaleDateString()}
              </li>
            </ul>
          </div>
          
          <p>Your payment has been successfully processed and your account has been updated.</p>
          
          <div style="background-color: #e6f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1e40af; margin-top: 0;">What's Next?</h4>
            <ul>
              <li>Your application status has been updated</li>
              <li>You can access your payment dashboard anytime</li>
              <li>Keep this email for your records</li>
            </ul>
          </div>
          
          <p>If you have any questions about your payment or need assistance, please don't hesitate to contact our support team at <a href="mailto:${SUPPORT_EMAIL}" style="color: #10b981;">${SUPPORT_EMAIL}</a>.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Thank you for choosing ${COMPANY_NAME}!</p>
            <p style="color: #666; font-size: 12px;">
              Visit us at <a href="${COMPANY_WEBSITE}" style="color: #10b981;">${COMPANY_WEBSITE}</a>
            </p>
          </div>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© 2024 ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [applicantEmail],
        subject: `Payment Confirmation - ₦${amount.toLocaleString()} Received`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error('Failed to send email');
    }

    const result = await emailResponse.json();
    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send confirmation email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
