"use client";

import { Layout } from "@/components";
import { AutomatedFormTester } from "@/components/testing/AutomatedFormTester";
import { useAppSelector } from "@/hooks";

export default function TestingPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Layout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Testing Center</h1>
          <p className="mt-2 text-gray-600">
            Pruebas automatizadas para validar el funcionamiento de formularios y APIs
          </p>
        </div>

        <AutomatedFormTester />
      </div>
    </Layout>
  );
}