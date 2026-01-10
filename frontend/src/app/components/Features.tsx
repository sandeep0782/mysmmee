"use client"; // Required for Framer Motion

import { motion } from "framer-motion";
import { Shield, Clock, HeadphonesIcon } from "lucide-react";

const features = [
    {
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "Secure Payment",
        description: "100% Secure Online Transaction",
    },
    {
        icon: <Clock className="h-6 w-6 text-primary" />,
        title: "BookKart Trust",
        description: "Money transferred safely after confirmation",
    },
    {
        icon: <HeadphonesIcon className="h-6 w-6 text-primary" />,
        title: "Customer Support",
        description: "Friendly customer support",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Why Choose BookKart?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    We provide top-notch services with secure payments, trusted transactions, and dedicated support.
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="flex items-center gap-4 rounded-xl p-6 shadow-lg bg-white hover:shadow-2xl hover:scale-105 transform transition-transform duration-300 cursor-pointer"
                        >
                            <div className="rounded-full bg-primary/10 p-4 flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
