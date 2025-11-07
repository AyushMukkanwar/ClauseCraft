
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navItems = [
    { href: "/create-playbook", label: "Create Playbook" },
    { href: "/review-contract", label: "Review Contract" },
    { href: "/chat", label: "Chat" },
  ];

  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
              <Zap className="h-6 w-6" />
              <span>ClauseCraft</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user ? (
                navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <Button asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
          </div>
        </div>
      </div>
    </nav>
  );
}
