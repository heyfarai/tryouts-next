"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const TopNav: React.FC = () => {
  return (
    <header className="absolute top-0 z-40 w-full py-12">
      <nav className="relative w-full flex flex-wrap justify-between px-6 md:px-6 lg:px-8 mx-auto h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="md:fixed  flex-none text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
          aria-label="Precision Heat"
        >
          <Image
            src="/precision-logo.svg"
            alt="Precision Heat Logo"
            width={48}
            height={48}
          />
        </Link>
        {/* End Logo */}

        {/* Button Group: Auth only */}
        <div className="flex items-center gap-x-4 lg:gap-x-6 ms-auto h-full">
          <Link
            href="/#coaching"
            className="text-white text-shadow-sm font-bold hover:text-[var(--precision-red)] transition"
          >
            Coaches
          </Link>
          <Link
            href="/#tryouts"
            className="text-white text-shadow-sm font-bold hover:text-[var(--precision-red)] transition"
          >
            Tryouts
          </Link>
          <Link
            href="/#FAQ"
            className="text-white text-shadow-sm font-bold hover:text-[var(--precision-red)] transition"
          >
            FAQ
          </Link>
          <a
            href="https://instagram.com/precisionbasketball.team"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center text-white shadow-sm hover:text-[var(--precision-red)] transition rounded-sm"
          >
            {/* Filled Instagram SVG icon */}
            <svg
              fill="currentColor"
              viewBox="0 0 32 32"
              width="32"
              height="32"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z" />
              <path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z" />
            </svg>
          </a>

          <SignedOut>
            {/* <SignInButton>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-transparent focus:outline-hidden transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Sign in
              </button>
            </SignInButton> */}
          </SignedOut>
          <SignedIn>
            <Link href="/account">Account</Link>
            {/* <SignOutButton> 
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-transparent bg-gray-200 text-black hover:bg-gray-300 focus:outline-hidden focus:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                Sign out
              </button>
            </SignOutButton> */}
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
