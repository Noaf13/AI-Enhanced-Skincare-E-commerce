/**
 * Orders Page Component
 *
 * Displays the logged in users order history fetched from Sanity CMS.
 * Protected route - redirects to sign in if no userId found.
 * Orders are sorted newest first and each one is collapsible to show items.
 *
 * @component
 * @async
 * @returns {Promise<JSX.Element>} orders list or empty state
 *
 * @dependencies
 * - auth: Clerk server side auth to get the current userId
 * - client: Sanity client for fetching orders
 * - StatusBadge: colour coded status component
 */
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client"; 
import Navbar from "@/components/Navbar";
import Image from "next/image";


import Link from "next/link";
import { BsBoxSeam } from "react-icons/bs";
/**
 * @interface OrderItem
 * @property {string} productId - sanity product id
 * @property {string} name - product name
 * @property {number} price - price per unit
 * @property {number} quantity - how many were ordered
 * @property {string} image - product image url
 */
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * @interface ShippingAddress
 * shape of the address object saved by the stripe webhook
 */
interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string; // matches what the webhook saves
  country: string;
}

/**
 * @interface Order
 * full order document as stored in Sanity
 */
interface Order {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAmount: number;
  status: string;
  createdAt: string;
  shippingAddress?: ShippingAddress; // optional - not all orders will have this
}

/**
 * fetches all orders for the logged in user, sorted newest first
 *
 * @async
 * @function getUserOrders
 * @param {string} userId - clerk user id to filter orders by
 * @returns {Promise<Order[]>} array of orders, empty if none found or error
 *
 * @example
 * const orders = await getUserOrders("user_123")
 */
async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await client.fetch(
      // GROQ query - filters by clerkUserId and orders by date descending
      `*[_type == "order" && clerkUserId == $userId] | order(createdAt desc) {
        _id,orderNumber,customerEmail,customerName,items,totalAmount,shippingAmount,
        status,createdAt,shippingAddress
      }`,
      { userId },
      { cache: "no-store" } // always fetch fresh so status changes show immediately
    );

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // return empty array rather than crashing the page
  }
}

/**
 * colour coded badge for order status
 * each status maps to its own bg/border/text colour combo
 *
 * @function StatusBadge
 * @param {{ status: string }} props
 * @returns {JSX.Element} coloured pill badge
 */
function StatusBadge({ status }: { status: string }) {
  // bg + border + text colours per status
  const config: Record<string, string> = {
    delivered: "bg-green-100 border-green-300 text-green-800",
    shipped: "bg-blue-50 border-blue-200 text-blue-700",
    paid: "bg-green-50 border-green-200 text-green-700",
    processing: "bg-yellow-100 border-yellow-300 text-yellow-800",
    cancelled: "bg-red-100 border-red-300 text-red-800",
  };

  // dot colours to match
  const dotConfig: Record<string, string> = {
    delivered: "bg-green-600",
    shipped: "bg-blue-500",
    paid: "bg-green-500",
    processing: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  //fallback to gray if status isnt in the list
  const classes = config[status] || "bg-gray-100 border-gray-300 text-gray-700";
  const dotClass = dotConfig[status] || "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status.toUpperCase()}
    </span>
  );
}

export default async function OrdersPage() {
  const { userId } = await auth();

  // redirect if not logged in
  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getUserOrders(userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>

        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No orders yet : </p>
            <p className="text-gray-400 text-sm mb-5">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#90af9f] text-white px-5 py-2 rounded hover:bg-[#7a9a8a] transition text-sm font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className= "flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg border border-gray-200">

                {/* order header - shows number, date, total and status badge */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      {order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",

                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-lg font-bold text-gray-900">
                        £{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* collapsible items section - open by default */}
                <div className="p-4">
                  <details open>
                    <summary className="text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 mb-3">
                      Items ({order.items.length})
                    </summary>
                    <div className="flex flex-col gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">

                          {/* show image if it exists, fallback to react icon placeholder */}
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded object-cover border border-gray-100 w-12 h-12"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <BsBoxSeam className="w-5 h-5 text-gray-300" />
                            </div>
                          )}

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              Qty {item.quantity} &middot; £{item.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* line total = price x qty */}
                          <p className="text-sm font-semibold text-gray-800">
                            £{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}