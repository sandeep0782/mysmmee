"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Menu,
  ShoppingCart,
  Lock,
  User,
  Package,
  PiggyBank,
  Heart,
  HelpCircle,
  ChevronRight,
  LogOut,
  Users2,
  FileTerminal,
  BookLock,
  ShoppingBag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "./Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import { useRouter } from "next/navigation";
import { logout, toggleLoginDialog } from "@/store/slices/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { setCart } from "@/store/slices/cartSlice";
import MainMenu from "./Menu";

export default function Header() {
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItemsCount = useSelector(
    (state: RootState) => state.cart.items.length
  );
  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });
  const [searchTerm, setSearchTerm] = useState("");


  const handleSearch = () => {
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("logged out successfully");
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  const handleProtectedNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (cartData?.success && cartData.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const menuItems = [
    ...(user && user
      ? [
        {
          href: "/account/profile",
          content: (
            <div className="flex space-x-4 items-center p-2 border-b ">
              <Avatar className="w-12 h-12 -ml-2 rounded-full ">
                {user?.profilePicture ? (
                  <AvatarImage src={user?.profilePicture} alt="User" />
                ) : (
                  <AvatarFallback>{userPlaceholder}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                <span className="font-semibold text-md">
                  {user.name || "Guest User"}
                </span>
                <span className="text-xs text-gray-500">
                  {user.email || "No email provided"}
                </span>
              </div>
            </div>
          ),
        },
      ]
      : [
        {
          icon: <Lock className="h-5 w-5" />,
          label: "Login/Sign Up",
          onClick: handleLoginClick,
        },
      ]),
    {
      icon: <User className="h-5 w-5" />,
      label: "My Profile",
      onClick: () => handleProtectedNavigation("/account/profile"),
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "My Orders",
      onClick: () => handleProtectedNavigation("/account/orders"),
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      label: "My Selling Orders",
      onClick: () => handleProtectedNavigation("/account/selling-products"),
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Cart",
      onClick: () => handleProtectedNavigation("/checkout/cart"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wishlist",
      onClick: () => handleProtectedNavigation("/account/wishlist"),
    },
    {
      icon: <Users2 className="h-5 w-5" />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      href: "/how-it-works",
    },
    ...(user && user
      ? [
        {
          icon: <LogOut className="h-5 w-5" />,
          label: "Logout",
          onClick: handleLogout,
        },
      ]
      : []),
  ];

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg hover:bg-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.content && <div className="mt-1">{item.content}</div>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg hover:bg-gray-200"
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </button>
        )
      )}
    </div>
  );

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Desktop Header */}
      <div className=" w-[95%] mx-auto hidden lg:flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="MYSMMEE Logo"
            width={40}
            height={10}
            className="h-15 w-auto"
          />
          <span className="text-lg font-bold text-red-700">
            MYSMME
          </span>
        </Link>
        <MainMenu />
        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="flex w-full max-w-2xl">
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Product Name / Brand / Seller / Style Id"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" rounded-l-full rounded-r-none border border-gray-200 h-11 pl-5 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className=" rounded-r-full rounded-l-none bg-gray-100 border border-l-0 border-gray-300 hover:bg-gray-200 h-11 px-6"
              aria-label="Search products"

            >
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* <Link href="http://localhost:5000" passHref>
            <Button
              variant="secondary"
              className="bg-primary hover:bg-primary_hover text-white"
            >
              Start Selling
            </Button>
          </Link> */}


          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="w-8 h-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="User" />
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative" aria-label="View cart"
              >
                <ShoppingBag className="h-5 w-5 mr-2"
                />
                Bag
                {user && cartItemsCount > 0 && (
                  <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            {/* Add a SheetHeader with SheetTitle */}
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Image
                src="/images/logo.png"
                alt="MYSMMEE Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="MYSMMEE Logo"
            width={150}
            height={100}
            className=" h-6 md:h-10  w-10  md:w-auto"
          />
        </Link>
        <div className="flex-1 px-4">
          <div className="flex w-full max-w-md mx-auto md:mx-0">
            <Input
              type="text"
              placeholder="Search products..."
              className="flex-1 rounded-l-full rounded-r-none border border-gray-200 h-11 pl-4 text-sm focus:ring-0 focus:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              className="rounded-r-full rounded-l-none bg-gray-100 border border-l-0 border-gray-300 hover:bg-gray-200 h-11 px-4"
              onClick={handleSearch}
              aria-label="Search products"

            >
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
          </div>

        </div>
        <Link href="/checkout/cart">
          <Button variant="ghost" className="relative">
            <ShoppingCart className="h-5 w-5 mr-2" />
            {user && cartItemsCount > 0 && (
              <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Login/Signup Dialog */}
      <Login isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header >
  );
}
