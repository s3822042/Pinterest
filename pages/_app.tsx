import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { usePageLoading } from "../hooks/usePageLoading";

export default function App({ Component, pageProps }: AppProps) {
  const [isSSR, setIsSSR] = useState(true);
  const { isPageLoading } = usePageLoading();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_API as string}
    >
      <div className="xl:w-full m-auto overflow-hidden h-[100vh]">
        <Navbar />
        <div>
          <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] flex-1">
            {!isPageLoading ? (
              <Component {...pageProps} />
            ) : (
              <Spinner message="Loading..." />
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
