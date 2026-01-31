"use client";

import React from "react";

const jobs = [
    {
        title: "Marketing Freelancer",
        description:
            "Promote MYSMME as a marketplace, manage campaigns, and increase user engagement.",
        type: "Freelance",
        applyLink: "/apply/marketing-freelancer",
    },
    {
        title: "Frontend Developer (React)",
        description:
            "Build a modern, responsive UI/UX for the MYSMME website using React and Tailwind CSS.",
        type: "Freelance",
        applyLink: "/apply/frontend-developer",
    },
];

const CareersPage = () => {
    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Join Our Team</h1>
                <p className="text-gray-600 text-lg text-center mb-12">
                    We're always looking for talented individuals to help grow <span className="text-primary font-semibold">MYSMME</span>. Check out
                    our current openings below!
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105"
                        >
                            <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                            <p className="text-gray-600 mb-4">{job.description}</p>
                            <p className="font-medium text-primary mb-4">{job.type}</p>
                            <p className="text-gray-700">
                                Send your resume to{" "}
                                <a
                                    href="mailto:iamsjangid@gmail.com"
                                    className="text-primary font-semibold underline"
                                >
                                    iamsjangid@gmail.com
                                </a>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
