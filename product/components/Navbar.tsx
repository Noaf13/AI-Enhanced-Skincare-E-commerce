"use client";

import Link from "next/link";
import "../components/Navbar.css";
import { AiOutlineShopping } from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";

export default function Navbar() {
  const {setShowCart,totalQty} = useStateContext();

  const homeClick = () => {
    setShowCart(false); 
  };

  return (
    <nav className="navbar">
      <Link href="/#" className="logo" onClick={homeClick}>GLOWSKIN</Link>

      <ul className="nav-links">
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
            Tech
          </Link>
        </li>
        <li>
          <Link href="#contact" className="login-button">
            Login
          </Link>
        </li>
        <li><button type="button" className="cart-icon"
            onClick={() => setShowCart(true)}>
            <AiOutlineShopping size={24} />
            {totalQty > 0 && (
              <span className="cart-item-qty">{totalQty}</span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}