/**
 * Navigation Bar Component
 *
 * Main site navigation with branding, links, user authentication, and cart access.
 * Integrates with Clerk for authentication and StateContext for cart management.
 *
 * @component
 * @returns {JSX.Element} Site navigation bar with responsive design
 *
 * @example
 * // Usage in layout
 * <Navbar />
 *
 * @features
 * - Site logo/branding with home link
 * - Main navigation links
 * - Clerk authentication integration (login/logout/user profile)
 * - Shopping cart icon with item count badge
 * - Mobile-responsive design
 *
 * @dependencies
 * - useStateContext: Cart state management
 * - @clerk/nextjs: Authentication components
 * - react-icons/ai: Shopping cart icon
 * - next/link: Client-side navigation
 */
"use client";

import Link from "next/link";
import "../components/Navbar.css";
import { AiOutlineShopping } from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { setShowCart, totalQty } = useStateContext();

  const homeClick = () => {
    setShowCart(false);
  };

  return (
    <nav className="navbar">
      {/* Site logo that links to homepage */}
      <Link href="/#" className="logo" onClick={homeClick}>
        GLOWSKIN
      </Link>

      <ul className="nav-links">
        {/* Navigation links container */}
        <div className="nav-r">
          {/* Shop all -product listing link */}
          <li>
            <Link href="/#bestsellers" className="nav-link">
              Shop All
            </Link>
          </li>
          <li>
            <Link href="#about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link href="#tech" className="nav-link">
              Orders
            </Link>
          </li>
          <SignedOut>
            <li>
              <SignInButton mode="modal">
                {/* Login button with Clerk sign in modal */}
                <button className="bg-[#90af9f] text-white py-3 px-5 rounded-3xl hover:bg-[#7a9a8a]">
                  Login
                </button>
              </SignInButton>
            </li>
          </SignedOut>

          <SignedIn>
            <li>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    // avatar styling when logged in
                  },
                }}
              />
            </li>
          </SignedIn>

          {/* Shopping cart icon with dynamic item count */}
          <li>
            <button
              type="button"
              className="cart-icon"
              onClick={() => setShowCart(true)}
            >
              <AiOutlineShopping size={24} />
              {totalQty > 0 && (
                <span className="cart-item-qty">{totalQty}</span>
              )}
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}
