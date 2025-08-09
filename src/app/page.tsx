"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projects = [
  { title: "Mini e-shop demo", tag: "Next.js • CMS • Checkout", desc: "Katalogas, krepšelis, demo checkout.", link: "#" },
  { title: "E-shop landing", tag: "SEO • UI/UX", desc: "Hero, akcijos, CTA į katalogą.", link: "#" },
  { title: "Produktų katalogas", tag: "Filtering", desc: "Greitas filtravimas ir rūšiavimas.", link: "#" },
];

export default function Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ name, email, msg });
    setOk(true);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Kuriu greitas ir modernias <span className="text-primary">e-shop</span> svetaines.
        </motion.h1>
        <p className="mt-5 text-muted-foreground max-w-prose">
          Fokusas – našumas, UI/UX, SEO ir konversijos. Next.js + Tailwind + shadcn/ui.
        </p>
        <div className="mt-7 flex gap-3">
          <Button size="lg" className="rounded-2xl">
            Papasakok apie projektą <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="rounded-2xl">
              Peržiūrėti demo
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">E-shop demonstracijos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.a key={p.title} href={p.link} className="block"
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}>
              <Card className="rounded-2xl hover:shadow-xl transition">
                <CardHeader><CardTitle className="text-lg">{p.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div className="mb-2 inline-flex items-center gap-2 text-xs"><Globe className="h-4 w-4" />{p.tag}</div>
                  <p>{p.desc}</p>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <Card className="rounded-2xl p-6">
          <CardHeader><CardTitle>Susisiekime</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
              <Input placeholder="Vardas" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
              <Input type="email" placeholder="El. paštas" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
              <Button type="submit" className="rounded-xl">Siųsti</Button>
              <Textarea placeholder="Trumpai apie projektą" value={msg} onChange={e => setMsg(e.target.value)} className="md:col-span-3 rounded-xl" />
              {ok && <p className="text-sm text-green-600 md:col-span-3">Gauta! Susisieksiu kuo greičiau.</p>}
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
