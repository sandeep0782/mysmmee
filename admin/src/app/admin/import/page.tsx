"use client";

import Link from "next/link";
import { Package, Users, ShoppingCart, IndianRupee } from "lucide-react";

const GradientImportCards = () => {
    const cards = [
        {
            title: "Import Products",
            desc: "Upload CSV or Excel files",
            icon: Package,
            href: "/admin/import/import-products",
            gradient: "from-blue-500/20 to-blue-600/30",
            iconBg: "bg-blue-500",
        },
        {
            title: "Import Orders",
            desc: "Bulk upload order data",
            icon: ShoppingCart,
            href: "/admin/import/orders",
            gradient: "from-green-500/20 to-green-600/30",
            iconBg: "bg-green-500",
        },
        {
            title: "Import Users",
            desc: "Add users via spreadsheet",
            icon: Users,
            href: "/admin/import/import-user",
            gradient: "from-purple-500/20 to-purple-600/30",
            iconBg: "bg-purple-500",
        },
        {
            title: "Import Pricing",
            desc: "Update product prices",
            icon: IndianRupee,
            href: "/admin/import/pricing",
            gradient: "from-orange-500/20 to-orange-600/30",
            iconBg: "bg-orange-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c, i) => (
                <Link
                    key={i}
                    href={c.href}
                    className={`group relative overflow-hidden rounded-2xl border border-white/20 
          bg-gradient-to-br ${c.gradient} backdrop-blur-xl p-6 
          hover:scale-[1.02] transition-all duration-300`}
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition" />

                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {c.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                        </div>

                        <div className={`p-3 rounded-xl text-white ${c.iconBg}`}>
                            <c.icon className="w-6 h-6" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default GradientImportCards;
