"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToHome = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace("/"); // Redirect to home
    }, [router]);

    return null; // nothing to render
};

export default RedirectToHome;
