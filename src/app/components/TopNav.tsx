"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const TopNav: React.FC = () => {
  return (
    <header className="absolute top-0 z-50 w-full py-7">
      <nav className="relative w-full flex flex-wrap items-center justify-between px-6 md:px-6 lg:px-8 mx-auto">
        <div className="flex items-center">
          {/* Logo */}
          <Link
            href="/"
            className="md:fixed md:top-5 flex-none text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
            aria-label="Precision Heat"
          >
            <Image
              src="/precision-logo.svg"
              alt="Precision Heat Logo"
              width={72}
              height={72}
            />
          </Link>
          {/* End Logo */}
        </div>

        {/* Button Group: Auth only */}
        <div className="flex items-center gap-x-4 lg:gap-x-6 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
          <Link
            href="#tryouts"
            className="text-black font-bold hover:text-[var(--precision-red)] transition"
          >
            Tryouts
          </Link>
          <Link
            href="#FAQ"
            className="text-black font-bold hover:text-[var(--precision-red)] transition"
          >
            FAQ
          </Link>
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
