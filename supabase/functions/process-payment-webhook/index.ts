
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const webhookData = await req.json();
    
    console.log('Received webhook data:', webhookData);

    // Verify this is a successful payment event
    if (webhookData.event !== 'charge.success') {
      return new Response(
        JSON.stringify({ message: 'Event not processed' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paymentData = webhookData.data;
    const metadata = paymentData.metadata;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'success',
        paystack_reference: paymentData.reference,
        updated_at: new Date().toISOString()
      })
      .eq('payment_reference', paymentData.reference);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment record' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Payment updated successfully');

    // Send confirmation email (optional)
    try {
      const { error: emailError } = await supabase.functions.invoke('send-payment-confirmation', {
        body: {
          applicantEmail: paymentData.customer.email,
          applicantName: metadata.applicantName,
          amount: paymentData.amount / 100, // Convert from kobo
          monthsPaid: metadata.monthsToPay,
          paymentReference: paymentData.reference
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the webhook if email fails
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
