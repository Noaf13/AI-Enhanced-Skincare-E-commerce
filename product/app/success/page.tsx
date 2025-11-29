import { redirect } from 'next/navigation'
import { stripe } from '../../lib/stripe'

export default async function Success({ 
  searchParams 
}: { 
  searchParams: Promise<{ session_id?: string }> 
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect('/')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (session.status === 'open') {
    return redirect('/')
  }

  if (session.status === 'complete') {
    return (
      <section id="success" className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="mb-4">
          We appreciate your business! A confirmation email will be sent to{' '}
          {session.customer_details?.email}. If you have any questions, please email{' '}
        </p>
        <a href="mailto:orders@example.com" className="text-blue-600 hover:underline">
          orders@example.com
        </a>
      </section>
    )
  }

  return null
}