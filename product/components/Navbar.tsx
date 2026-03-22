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
        <div className="nav-r">
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
            <Link href="/orders" className="nav-link">
              Orders
            </Link>
          </li>

          <SignedOut>
            <li>
              <SignInButton mode="modal">
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
                  },
                }}
              />
            </li>
          </SignedIn>

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
{/*heart icon-favourites  */}
          <li>
            <Link href="/wishlist">
              <svg
                className="w-5 h-5 text-white hover:text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}