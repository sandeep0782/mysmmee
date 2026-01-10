"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Users, Package, ShoppingCart, BarChart2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const metrics = [
    { id: 1, title: "Total Users", value: "1,245", icon: <Users className="w-6 h-6 text-blue-500" /> },
    { id: 2, title: "Products", value: "536", icon: <Package className="w-6 h-6 text-green-500" /> },
    { id: 3, title: "Orders", value: "1,092", icon: <ShoppingCart className="w-6 h-6 text-yellow-500" /> },
    { id: 4, title: "Revenue", value: "$24,850", icon: <BarChart2 className="w-6 h-6 text-red-500" /> },
];

const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
        {
            label: "Sales",
            data: [1200, 1900, 1700, 2200, 2000, 2400, 2800],
            fill: false,
            borderColor: "#4F46E5", // Indigo-600
            backgroundColor: "#4F46E5",
            tension: 0.3,
        },
    ],
};

const salesOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: { beginAtZero: true },
        x: { grid: { display: false } },
    },
};

const Dashboard: React.FC = () => {


    return (
        <div className="min-h-screen p-6 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <span className="text-gray-500">Welcome back, Admin 👋</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric) => (
                    <div
                        key={metric.id}
                        className="p-5 bg-white rounded-xl shadow hover:shadow-md transition flex items-center space-x-4"
                    >
                        <div>{metric.icon}</div>
                        <div>
                            <h3 className="text-sm text-gray-500">{metric.title}</h3>
                            <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Sales</h3>
                    <Line data={salesData} options={salesOptions} />
                </div>

                <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition h-64 flex items-center justify-center text-gray-400">
                    Recent Orders Placeholder
                </div>
            </div>

            {/* Placeholder for other content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition h-64 flex items-center justify-center text-gray-400">
                    Inventory Placeholder
                </div>
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition h-64 flex items-center justify-center text-gray-400">
                    Customer Feedback Placeholder
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
