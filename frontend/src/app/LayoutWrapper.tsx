"use client";
import Loader from "@/lib/BookLoader";
import AuthChecker from "@/store/Provider/AuthProvider";
import { persistor, store } from "@/store/store";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TopBar from "./components/TopBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Toaster />
        <AuthChecker>
          <TopBar />
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
        </AuthChecker>
      </PersistGate>
    </Provider>
  );
}
