/**
 * Cart Popup Component
 *
 * Sidebar cart modal displaying cart items with quantity, price, and checkout functionality.
 * Integrates with Stripe Checkout API and provides cart management UI.
 *
 * @component
 * @returns {JSX.Element | null} Cart popup UI or null when hidden
 *
 * @example
 * // Renders when showCart is true in StateContext
 * <CartPopup />
 *
 * @dependencies
 * - useStateContext: Global cart state and actions
 * - react-icons/ai: Close icon
 * - /api/checkout: Stripe checkout endpoint
 */
"use client";
import { useStateContext } from "@/context/StateContext";
import { AiOutlineClose } from "react-icons/ai";

export default function CartPopup() {
  const { showCart, setShowCart, cartItems, totalPrice, totalQty, onRemove } =
    useStateContext();
  //states needed for the cart icon and popup

  if (!showCart) return null;

  const handleCheckout = async () => {
    try {
      console.log("sending cart items", cartItems);
      //call the api
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("no stripe link", data);
      }
    } catch (error) {
      console.error("checkout error", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden  gap-y-11 pointer-events-none">
      <div onClick={() => setShowCart(false)} />

      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl mt-2 mr-5 pointer-events-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold  text-gray-900">
              Your Cart ({totalQty} items)
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center border-b pb-4">
                  {/* Product Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}

                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">£{item.price}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => onRemove(item)}
                      className="mt-2 p-1 hover:bg-gray-100  text-red-600"
                      title="Remove item"
                    >
                      <AiOutlineClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span className=" text-gray-900">Total:</span>
              <span className=" text-gray-900">£{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-pink-300 text-white py-3 rounded-md hover:bg-pink-200 transition-colors "
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
