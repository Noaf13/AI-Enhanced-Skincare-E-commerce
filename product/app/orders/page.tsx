import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "../../sanity/lib/client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

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
  shippingAddress?: ShippingAddress;
}

async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await client.fetch(
      `*[_type == "order" && clerkUserId == $userId] | order(createdAt desc) {
        _id,
        orderNumber,
        customerEmail,
        customerName,
        items,
        totalAmount,
        shippingAmount,
        status,
        createdAt,
        shippingAddress
      }`,
      { userId },
      { cache: "no-store" }
    );

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    delivered: "bg-green-50 border-green-200 text-green-700",
    shipped: "bg-slate-50 border-slate-200 text-slate-600",
    paid: "bg-emerald-50 border-emerald-200 text-emerald-700",
    processing: "bg-yellow-50 border-yellow-200 text-yellow-700",
    cancelled: "bg-red-50 border-red-200 text-red-700",
  };

  const dotConfig: Record<string, string> = {
    delivered: "bg-green-500",
    shipped: "bg-slate-400",
    paid: "bg-emerald-500",
    processing: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  const classes = config[status] || "bg-gray-50 border-gray-200 text-gray-700";
  const dotClass = dotConfig[status] || "bg-gray-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status.toUpperCase()}
    </span>
  );
}

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getUserOrders(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track and manage your skincare orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22.08V12" />
            </svg>
            <p className="text-gray-600 text-lg mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#90af9f] text-white px-6 py-3 rounded-md hover:bg-[#7a9a8a] transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex items-start gap-2.5">
                      {/* Package icon */}
                      <svg
                        className="w-[18px] h-[18px] text-gray-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                        <path d="M12 22.08V12" />
                      </svg>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Order# {order.orderNumber}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 -ml-[23px]">
                          {/* Calendar icon */}
                          <svg
                            className="w-2.5 h-2.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          Order placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          £{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6">
                  <details open>
                    <summary className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors py-3">
                      {/* List icon */}
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                      Order Items ({order.items.length})
                    </summary>

                    <div className="pb-4 space-y-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3.5 py-2.5"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={52}
                              height={52}
                              className="rounded-md object-cover border border-gray-100"
                              style={{ width: 52, height: 52 }}
                            />
                          ) : (
                            <div
                              className="bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{ width: 52, height: 52 }}
                            >
                              <svg
                                className="w-5 h-5 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Qty: {item.quantity} &nbsp;&middot;&nbsp; £
                              {item.price.toFixed(2)} each
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
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