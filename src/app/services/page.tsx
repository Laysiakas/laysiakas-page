"use client";
import { services, type Service } from "@/data/services";

export default function ServicesPage() {
  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {services.map((s: Service, i: number) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-2">{s.title}</h2>
          <p className="text-gray-500 mb-4">{s.desc}</p>
          <span className="text-primary font-semibold">€{s.price}</span>
        </div>
      ))}
    </main>
  );
}
