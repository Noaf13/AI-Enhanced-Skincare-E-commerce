"use client";

import Link from "next/link";

import "../components/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">GLOWSKIN</div>

      <ul className="nav-links">
        <li>
          <Link href="#products" className="nav-link">
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
            tech
          </Link>
          
        </li>
         <li>
          <Link href="#contact" className="login-button">
            Login
          </Link>
          
        </li>
         <li>
          <Link href="#basket" className="nav-link">
            <img src="/shopping-bag.png" alt=""  width={28}
              height={25} color="white"/>
          </Link>
          
        </li>
      </ul>
    </nav>
  );
}
