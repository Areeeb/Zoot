import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
@Controller('stripe')
export class StripeController {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: null,
        });
      }
      @Post('webhook')
      async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const webhookSecret = 'your_webhook_secret';
    
        let event;
    
        // Verify the webhook signature
        try {
          const signature = req.headers['stripe-signature'];
          event = this.stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        } catch (err) {
          console.error(`⚠️  Webhook signature verification failed.`, err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    
        // Handle the event type
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent);
            // Update your database, send email, etc.
            break;
    
          case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object;
            console.log('PaymentIntent failed!', failedPaymentIntent);
            // Handle payment failure
            break;
    
          // Add more cases as needed for other event types
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
    
        res.json({ received: true });
      }
    }