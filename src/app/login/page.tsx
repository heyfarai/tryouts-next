import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally, if already signed in, redirect to account page
    // Clerk's useUser() can be used if ClerkProvider is set up
  }, [router]);

  return (
    <div className="flex flex-col items-center mt-16">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignIn />
    </div>
  );
}
