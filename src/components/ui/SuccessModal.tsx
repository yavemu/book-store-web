"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  redirectUrl: string;
  redirectDelay?: number;
  onCreateAnother?: () => void;
  createAnotherLabel?: string;
  redirectLabel?: string;
}

export function SuccessModal({
  isOpen,
  title,
  message,
  redirectUrl,
  redirectDelay = 5,
  onCreateAnother,
  createAnotherLabel = "Crear otro",
  redirectLabel = "Ir al listado",
}: SuccessModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    if (isOpen) {
      setCountdown(redirectDelay);

      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, redirectDelay * 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isOpen, redirectDelay, redirectUrl, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100/20">
      <div className="bg-white/95 rounded-lg shadow-xl p-6 w-full max-w-md text-center border">
        <h2 className="text-xl font-semibold text-green-700 mb-4">{title}</h2>
        {message && (
          <p className="text-gray-600 mb-6">{message}</p>
        )}
        <p className="text-gray-600 mb-6">
          Serás redirigido automáticamente en {countdown} segundo{countdown !== 1 ? "s" : ""}...
        </p>
        <div className="flex justify-center space-x-6">
          {onCreateAnother && (
            <button
              onClick={onCreateAnother}
              className="text-green-600 hover:underline"
            >
              {createAnotherLabel}
            </button>
          )}
          <button
            onClick={() => router.push(redirectUrl)}
            className="text-blue-600 hover:underline"
          >
            {redirectLabel}
          </button>
        </div>
      </div>
    </div>
  );
}