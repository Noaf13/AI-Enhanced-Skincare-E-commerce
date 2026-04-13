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
import Link from "next/link";

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
      // Full-screen overlay centred over the page background
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <section
          id="success"
          className="bg-white rounded-2xl shadow-xl px-10 py-12 max-w-md w-full mx-4 text-center"
        >
          {/* Animated green checkmark circle */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#90af9f]/20 mx-auto mb-6">
            <svg
              className="w-10 h-10 text-[#90af9f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Confirmation with dynamic email from the Stripe session */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-gray-500 mb-1">
            Thank you for shopping with GLOWSKIN.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email will be sent to{" "}
            <span className="font-medium text-gray-700">
              {session.customer_details?.email}
            </span>
          </p>

          {/* Divider */}
          <hr className="border-gray-100 mb-6" />

          {/* Contact line */}
          <p className="text-xs text-gray-400 mb-6">
            Questions? Email us at{" "}
            <a
              href="mailto:orders@example.com"
              className="text-[#90af9f] hover:underline"
            >
              orders@example.com
            </a>
          </p>

          {/* View orders button - takes user to their order history */}
          <Link
            href="/orders"
            className="inline-block w-full bg-[#90af9f] text-white px-6 py-3 rounded-lg hover:bg-[#7a9a8a] transition font-medium text-sm"
          >
            View My Orders
          </Link>

          {/* Secondary link back to shopping */}
          <Link
            href="/"
            className="inline-block mt-3 text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Continue Shopping
          </Link>
        </section>
      </div>
    );
  }

  return null;
}