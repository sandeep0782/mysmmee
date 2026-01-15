'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type FAQItem = {
    q: string;
    a: string;
};

type FAQSection = {
    key: string;
    category: string;
    items: FAQItem[];
};

// Complete FAQ Data
const FAQ_DATA: FAQSection[] = [
    {
        key: "top-queries",
        category: "Top Queries",
        items: [
            { q: "You can track your orders in 'My Orders.'", a: "Track your orders by visiting 'My Orders' in your account dashboard." },
            { q: "Why are there different prices for the same product? Is it legal?", a: "Price variations may occur due to different sellers, sizes, or promotions. This is legal under e-commerce regulations." },
            { q: "How can I contact any seller?", a: "You can contact a seller via the product page or your order details page, where a 'Contact Seller' option is provided." },
            { q: "I saw the product at Rs. 1000 but post clicking on the product, there are multiple prices. Why?", a: "Prices vary based on size, color, seller, or ongoing promotions." },
            { q: "How will I detect fraudulent emails/calls seeking sensitive information?", a: "MYSMME will never ask for passwords, OTPs, or card details via email or call. Always verify official channels." },
            { q: "How will I identify a genuine appointment letter?", a: "Check for official branding, contact details, and verify with our HR/support team if in doubt." },
            { q: "Why will 'My Cashback' not be available?", a: "Cashback policies vary per promotion. Check your account or offer terms." },
            { q: "How do I cancel the order I have placed?", a: "Go to 'My Orders', select the order, and click on 'Cancel' if eligible." },
            { q: "How do I create a Return Request?", a: "Navigate to your order in 'My Orders', select the product, and click 'Return/Exchange'." },
            { q: "I have created a Return request. When will the product be picked up?", a: "Our courier partner will pick up the product within 2–3 business days." },
            { q: "I have created a Return request. When will I get the refund?", a: "Refunds are processed within 7–10 business days after product pickup." },
            { q: "Where should I self-ship the Returns?", a: "Return address details are provided in your return request confirmation email." },
            { q: "I have accumulated points in my account. How can I redeem them?", a: "Points can be redeemed at checkout for eligible products in your cart." },
        ]
    },
    {
        key: "shipping",
        category: "Shipping & Delivery",
        items: [
            { q: "Shipping & Delivery", a: "We’re currently working on our Shipping & Delivery details. This information will be updated soon. Thank you for your patience." },
            { q: "How do I check the status of my order?", a: "Go to 'My Orders' and click 'Track Order' to see current status." },
            { q: "Does MYSMME deliver products outside India?", a: "Currently, deliveries are limited to within India." },
            { q: "How can I get my order delivered faster?", a: "Choose express shipping at checkout, if available." },
        ]
    },
    {
        key: "payments",
        category: "Payments",
        items: [
            { q: "What payment methods are accepted?", a: "We accept UPI, debit/credit cards, net banking, and popular digital wallets." },
            { q: "I have placed a COD order. What if the delivery associate does not accept Rs. 2000 notes?", a: "You will need to pay with valid currency notes. Smaller denominations or digital payment options can be used." },
            { q: "How do I make payment using EMI?", a: "Select EMI option at checkout and choose eligible banks. Ensure the order value meets EMI criteria." },
        ]
    },
    {
        key: "returns",
        category: "Returns & Exchange",
        items: [
            { q: "What is MYSMME's Return and Exchange Policy?", a: "Returns and exchanges are allowed under our policy. Initiate from 'My Orders'." },
            { q: "How do I place an exchange request?", a: "Go to your order, select the product, and click 'Exchange'." },
            { q: "Where should I self-ship the Returns?", a: "Return address details are sent with your return confirmation email." },
            { q: "How long would it take to get a refund?", a: "Refunds are processed within 7–10 business days after product pickup." },
        ]
    },
    {
        key: "cancellation",
        category: "Cancellations & Modifications",
        items: [
            { q: "Can I cancel my order?", a: "Yes, orders can be cancelled before they are shipped from our warehouse." },
            { q: "How do I cancel an order?", a: "Go to 'My Orders', select the order, and click 'Cancel'." },
            { q: "Will I get a refund after cancellation?", a: "Refunds are processed to the original payment method within 5–7 business days." },
        ]
    },
    {
        key: "grievance",
        category: "Grievance & Support",
        items: [
            { q: "How do I raise a grievance?", a: "Contact our support team via the 'Help & Support' section in your account." },
            { q: "What is the response time for grievances?", a: "We aim to respond within 24–48 hours of submission." },
        ]
    },
];

export default function FAQPage() {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get("section"); // shipping | payments | etc

    const [openIndex, setOpenIndex] = useState<string | null>(null);

    useEffect(() => {
        if (sectionParam) {
            setOpenIndex(sectionParam);
        }
    }, [sectionParam]);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Frequently Asked Questions
                </h1>

                {FAQ_DATA.map((section) => (
                    <div key={section.key} className="mb-6">
                        <button
                            onClick={() =>
                                setOpenIndex(openIndex === section.key ? null : section.key)
                            }
                            className="w-full flex justify-between items-center bg-white border rounded-lg px-5 py-4 shadow-sm"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">
                                {section.category}
                            </h2>
                            <ChevronDown
                                className={`w-5 h-5 transition-transform ${openIndex === section.key ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {openIndex === section.key && (
                            <div className="bg-white border border-t-0 rounded-b-lg px-5 py-4 text-gray-600 space-y-3">
                                {section.items.map((item, idx) => (
                                    <div key={idx}>
                                        <p className="font-medium text-gray-800">{item.q}</p>
                                        <p className="text-sm mt-1">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
