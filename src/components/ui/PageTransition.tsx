"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate a brief loading period for page transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading 
          message="Cargando página..."
          size="lg"
          variant="spinner"
        />
      </div>
    );
  }

  return <>{children}</>;
}