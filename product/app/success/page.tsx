/**
 * Order Success Page Component
 *
 * Displays order confirmation after successful Stripe checkout.
 * Verifies the checkout session status and shows appropriate confirmation UI.
 * Handles redirects for invalid or incomplete sessions.
 *
 * @component
 * @async
 * @param {Object} props - Component properties
 * @param {Promise<{ session_id?: string }>} props.searchParams - URL search parameters containing Stripe session ID
 * @returns {Promise<JSX.Element | null>} Success page UI or redirects
 *
 * @throws {Redirect} Redirects to home page for invalid/missing session IDs
 * @throws {Error} When Stripe API call fails
 *
 * @example
 * // URL: /success?session_id=cs_test_abc123
 * // Renders order confirmation with customer details
 *
 * @dependencies
 * - stripe.checkout.sessions.retrieve: Fetches session details from Stripe
 * - next/navigation.redirect: Handles client-side redirects
 */
import { redirect } from "next/navigation";
import { stripe } from "../../lib/stripe";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/"); // Redirect to home page if no session_id provided
  }
  // Fetch session information from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  // Check if the session is not completed -> redirect to home
  if (session.status === "open") {
    return redirect("/");
  }

  // Check if sessions is complete
  if (session.status === "complete") {
    return (
      <section id="success" className="p-8 max-w-2xl mx-auto">
        {/* Confirmation with dynamic email from the Stripe session */}
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="mb-4">
          Thank you for buying with us! A confirmation email will be sent to{" "}
          {session.customer_details?.email}. If you have any questions please
          email us{" "}
        </p>
        <a
          href="mailto:orders@example.com"
          className="text-blue-600 hover:underline"
        >
          orders@example.com
        </a>
      </section>
    );
  }

  return null;
}
