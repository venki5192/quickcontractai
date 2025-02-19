import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('Stripe-Signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('Processing webhook:', event.type);

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
            const userId = customer.metadata.userId;

            if (!userId) {
              console.error('No userId in customer metadata:', customer.id);
              return NextResponse.json({ error: 'No userId found' }, { status: 400 });
            }

            const subscriptionData = {
              id: subscription.id,
              user_id: userId,
              status: subscription.status,
              price_id: subscription.items.data[0].price.id,
              quantity: subscription.items.data[0].quantity,
              cancel_at_period_end: subscription.cancel_at_period_end,
              created: new Date(subscription.created * 1000).toISOString(),
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
              cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
              trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
            };

            const { error } = await supabaseAdmin
              .from('subscriptions')
              .upsert(subscriptionData);

            if (error) {
              console.error('Supabase error:', error);
              return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
            }

            console.log('Subscription stored successfully for user:', userId);
            break;
          }
        }
      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
