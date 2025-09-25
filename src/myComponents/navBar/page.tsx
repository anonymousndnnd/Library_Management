"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { toast } from "sonner" // import Sonner toast
import { useRouter } from "next/navigation"

export function Navbar() {
  const { data: session, status } = useSession()
  const isLoggedIn = !!session
  const router=useRouter()

  // Determine dashboard URL based on role
  const getDashboardLink = () => {
    if (!session) return null
    switch (session.user.role) {
      case "ADMIN":
        return "/adminDashboard"
      case "AUTHOR":
        return "/authorDashboard"
      case "CUSTOMER":
        return "/customerDashboard"
      default:
        return "/"
    }
  }

  const dashboardLink = getDashboardLink()

  // Full-page transparent loading overlay
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  const handleLogout = () => {
  toast("Logging out...", { duration: 1000 }) // show initial toast
  setTimeout(() => {
    signOut({ callbackUrl: "/" }) // sign out and redirect
    toast.success("Logout successful", { duration: 1500 }) // success toast
  }, 1000)
}
  // Handle dashboard click for non-logged in users
  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault() // prevent navigation
      toast("Sign in to access your dashboard")
      setTimeout(() => {
      router.push("/sign-in") // redirect after toast
    }, 1500)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center px-8 h-20">
        
        {/* Left side: Logo */}
        <div className="flex-1">
          <Link href="/" className="font-extrabold text-3xl tracking-tight text-blue-700">
            Bookerea
          </Link>
        </div>

        {/* Middle: Navigation Menu */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-8 text-xl font-medium">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="px-3 py-2 hover:text-blue-600">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Dashboard */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={dashboardLink || "#"}
                    onClick={handleDashboardClick}
                    className="px-3 py-2 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl">Docs</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">
                  <ul className="grid gap-2 w-[240px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/docs/overview">Overview</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/docs/getting-started">Getting Started</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="px-3 py-2 hover:text-blue-600">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Right side: Auth buttons / User info */}
        <div className="flex-1 flex justify-end items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}

              <span className="font-medium text-lg">
                {session.user?.name || session.user?.email}
              </span>

              <Button
                variant="outline"
                size="lg"
                className="px-6 py-2 text-lg"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="lg" className="px-6 py-2 text-lg">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild size="lg" className="px-6 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
