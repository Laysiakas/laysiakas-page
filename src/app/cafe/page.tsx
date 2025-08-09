'use client';
import { menu } from '@/data/menu';

export default function CafePage() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meniu</h1>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {menu.map((m, i) => (
          <li key={i} className="flex justify-between py-2">
            <span>{m.name}</span>
            <span>{m.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}