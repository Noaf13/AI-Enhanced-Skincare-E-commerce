"use client";

import Link from "next/link";
import "../components/Navbar.css";
import { AiOutlineShopping } from "react-icons/ai";

export default function Navbar() {
  const cartQuantity = 3; 

  return (
    <nav className="navbar">
      <div className="logo">GLOWSKIN</div>

      <ul className="nav-links">
        <li>
          <Link href="#bestsellers" className="nav-link">
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
            Tech
          </Link>
        </li>
        <li>
          <Link href="#contact" className="login-button">
            Login
          </Link>
        </li>
        <li>
          <button type="button" className="cart-icon">
            <AiOutlineShopping size={24} />
            {cartQuantity > 0 && (
              <span className="cart-item-qty">{cartQuantity}</span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}