import React from "react";
import Link from "next/link";
import {
    Home,
    Film,
    Video,
    Music,
    Clock,
    List,
    ThumbsUp,
    Settings,
    HelpCircle,
    LayoutDashboard,
    Package,
    Database,
    Menu,
    X,
    Palette,
    Sun,
    Tag,
} from "lucide-react";

type SidebarProps = {
    isOpen: boolean;
    toggleSidebar: () => void;
};

const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/user/dashboard" },
   
    { icon: <Package className="w-5 h-5" />, label: "Products", href: "/user/product" },
    { icon: <Database className="w-5 h-5" />, label: "Import", href: "/user/import" },
];

const libraryItems = [
    { icon: <List className="w-5 h-5" />, label: "Orders", href: "/user/orders" },
    { icon: <Clock className="w-5 h-5" />, label: "Payment", href: "/user/payment" },
    { icon: <Video className="w-5 h-5" />, label: "Review", href: "/user/review" },
    { icon: <Clock className="w-5 h-5" />, label: "Watch Later", href: "/user/watch-later" },
    { icon: <ThumbsUp className="w-5 h-5" />, label: "Liked Videos", href: "/user/liked" },
];

const bottomItems = [
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/user/settings" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help", href: "/user/help" },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    return (
        <aside
            className={`bg-white border-r h-screen flex flex-col transition-[width] duration-300 ease-in-out
  ${isOpen ? "w-64" : "w-16 overflow-hidden"}`}
        >
            {/* Sidebar Header with Logo, Brand & Toggle */}
            <div
                className={`flex items-center h-16 border-b px-2 transition-all duration-300 ease-in-out`}
            >
                {/* Logo */}    
                <img
                    src="/images/logo.png"
                    alt="MYSMME Logo"
                    className={`h-10 w-10 transition-all duration-300 ease-in-out ${isOpen ? "mr-2" : "mx-auto"
                        }`}
                />

                {/* Brand Name */}
                <span
                    className={`whitespace-nowrap font-bold text-lg transition-all duration-300 ease-in-out 
      ${isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 overflow-hidden"}`}
                    style={{ transitionProperty: "opacity, max-width" }}
                >
                    MYSMME
                </span>

                {/* Toggle Button - only show X when open */}
                {isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="ml-auto p-1 rounded hover:bg-gray-200 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Menu Button - only show when collapsed */}
            {!isOpen && (
                <div className="flex justify-center mt-2">
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded hover:bg-gray-200 transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Menu Sections */}
            <nav className="flex-1 overflow-y-auto space-y-6 mt-2 px-2">
                {/* Top Section */}
                <div className="space-y-1">
                    {menuItems.map(({ icon, label, href }, idx) => (
                        <Link
                            key={idx}
                            href={href}
                            className="flex items-center p-2 rounded hover:bg-gray-100 transition"
                        >
                            <div className="w-6 flex-shrink-0 flex justify-center">{icon}</div>
                            <span
                                className={`inline-block whitespace-nowrap transition-all duration-300 ease-in-out
              ${isOpen ? "opacity-100 max-w-full ml-3" : "opacity-0 max-w-0 overflow-hidden ml-0"}`}
                                style={{ transitionProperty: "opacity, max-width, margin-left" }}
                            >
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Library Section */}
                <div className="space-y-1 border-t pt-3">
                    {libraryItems.map(({ icon, label, href }, idx) => (
                        <Link
                            key={idx}
                            href={href}
                            className="flex items-center p-2 rounded hover:bg-gray-100 transition"
                        >
                            <div className="w-6 flex-shrink-0 flex justify-center">{icon}</div>
                            <span
                                className={`inline-block whitespace-nowrap transition-all duration-300 ease-in-out
              ${isOpen ? "opacity-100 max-w-full ml-3" : "opacity-0 max-w-0 overflow-hidden ml-0"}`}
                                style={{ transitionProperty: "opacity, max-width, margin-left" }}
                            >
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="space-y-1 border-t pt-3">
                    {bottomItems.map(({ icon, label, href }, idx) => (
                        <Link
                            key={idx}
                            href={href}
                            className="flex items-center p-2 rounded hover:bg-gray-100 transition"
                        >
                            <div className="w-6 flex-shrink-0 flex justify-center">{icon}</div>
                            <span
                                className={`inline-block whitespace-nowrap transition-all duration-300 ease-in-out
              ${isOpen ? "opacity-100 max-w-full ml-3" : "opacity-0 max-w-0 overflow-hidden ml-0"}`}
                                style={{ transitionProperty: "opacity, max-width, margin-left" }}
                            >
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>

    );
};

export default Sidebar;
