"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { BookMarkedIcon, BookOpen, HomeIcon } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";

export default function Header() {
  return (
    <>
    <header className="md:sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.jpg"
                alt="Venture Media Logo"
                width={30} 
                height={30}
                className="text-primary"
              />
              <span className="hidden md:flex text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Venture Meda
              </span>
            </Link>

            <SearchInput />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link
                prefetch={false}
                href="/my-courses"
                className="flex space-x-2 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors md:border md:border-border md:rounded-md md:px-4 md:py-2"
              >
                <BookMarkedIcon className="h-4 w-4" />
                <span className="hidden md:block">My Courses</span>
              </Link>
            </nav>

            <DarkModeToggle />

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="default">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden flex justify-around py-2">
        <Link
          href="/"
          className="flex flex-col items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/my-courses"
          className="flex flex-col items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <BookMarkedIcon className="h-5 w-5" />
          <span>My Courses</span>
        </Link>
      </nav>
    </>
    
  );
}
