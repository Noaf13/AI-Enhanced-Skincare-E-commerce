
## AI-Enhanced Skincare E-Commerce Platform 

### A modern, full-stack skincare e-commerce platform built with Next.js 15, featuring AI-powered personalisation, secure checkout, and a    seamless user experience.


₊✩‧₊˚౨ৎ˚₊✩‧₊

### Required Services Setup (to run application)

*Sanity CMS Setup(Content Access)*

1. Visit Sanity.io and create an account 
2. Create a new project 
3. Store your API keys .env.local
4. Add sample products to see how products are set up

variables:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_test_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_test_token

*Stripe Setup*

1. Create a Stripe account
2. Use test mode API keys
3. Use the test bellow to see if payment is successful 

[Success payment]
Test cards: Use these to simulate payments:
Card: 4242 4242 4242 4242
Any future date (like 12/34)
Any 3-digit CVC

variables:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

*Clerk Setup*

1. Visit Clerk.dev
2. Create a new application 
3. Get API keys from the API section

Variables:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_clerk_...
CLERK_SECRET_KEY=sk_test_clerk_...





