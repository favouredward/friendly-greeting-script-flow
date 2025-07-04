
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  applicantName: string;
  applicantEmail: string;
  program: string;
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicantName, applicantEmail, program, applicationId }: NotificationRequest = await req.json();
    
    console.log("Sending notification email for application:", applicationId);

    // Send confirmation email to applicant from your custom domain
    const applicantEmailResponse = await resend.emails.send({
      from: "BlacTech Scholarship Portal <support@blactechafrica.com>",
      to: [applicantEmail],
      subject: "Application Submitted Successfully - BlacTech Scholarship",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Received!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #7c3aed; margin-top: 0;">Dear ${applicantName},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Thank you for applying to the <strong>BlacTech Scholarship Program</strong>! We're excited to review your application.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #7c3aed; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #7c3aed;">Application Details:</h3>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Application ID:</strong> ${applicationId}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Program:</strong> ${program}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #7c3aed; margin-bottom: 25px;">
            <h3 style="color: #7c3aed; margin-top: 0;">What's Next?</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Our team will review your application within 5-7 business days</li>
              <li>You'll receive an email notification about the status update</li>
              <li>If approved, you'll receive login details and payment instructions</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0;">
              Questions? Contact us at <a href="mailto:support@blactechafrica.com" style="color: #7c3aed;">support@blactechafrica.com</a>
            </p>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 15px;">
              © 2025 BlacTech Africa. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", applicantEmailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: applicantEmailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
