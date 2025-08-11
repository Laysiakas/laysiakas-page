"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DemoCTA from "@/components/DemoCTA";

// Demo kortelės (gali keisti pagal poreikį)
const projects = [
  { title: "Mini e-shop demo", tag: "Next.js • CMS • Checkout", desc: "Katalogas, krepšelis, demo checkout.", link: "#" },
  { title: "E-shop landing", tag: "SEO • UI/UX", desc: "Hero, akcijos, CTA į katalogą.", link: "#" },
  { title: "Produktų katalogas", tag: "Filtering", desc: "Greitas filtravimas ir rūšiavimas.", link: "#" },
];

export default function Page() {
  // Forma
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);

  // Anti‑spam
  const [hp, setHp] = useState("");                // honeypot (paslėptas)
  const [t0] = useState<number>(() => Date.now()); // formos pradžios laikas (ms)

  // Pateikimas į /api/contact (Node serverless + Nodemailer)
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: msg, hp, t0 }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setOk("success");
        setName("");
        setEmail("");
        setMsg("");
      } else {
        setOk("error");
      }
    } catch {
      setOk("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Kuriu greitas ir modernias <span className="text-primary">e‑shop</span> svetaines.
        </motion.h1>

        <p className="mt-5 text-muted-foreground max-w-prose">
          Fokusas – našumas, UI/UX, SEO ir konversijos. Next.js + Tailwind + shadcn/ui.
        </p>

        <div className="mt-7 flex gap-3">
          {/* Teisingas shadcn: Button kaip nuoroda per asChild */}
          <Button size="lg" className="rounded-2xl" asChild>
            <Link href="#contact" aria-label="Pereiti į kontaktų formą">
              Papasakok apie projektą <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <DemoCTA />
        </div>
      </section>

      {/* DEMOS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">E‑shop demonstracijos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.link}
              className="block"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="rounded-2xl hover:shadow-xl transition">
                <CardHeader><CardTitle className="text-lg">{p.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div className="mb-2 inline-flex items-center gap-2 text-xs">
                    <Globe className="h-4 w-4" />{p.tag}
                  </div>
                  <p>{p.desc}</p>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-28">
        <Card className="rounded-2xl p-6">
          <CardHeader><CardTitle>Susisiekime</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid md:grid-cols-3 gap-3" noValidate>
              {/* Honeypot (paslėptas laukas botams) */}
              <div className="hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>

              {/* Vardas */}
              <label htmlFor="contact-name" className="sr-only">Vardas</label>
              <Input
                id="contact-name"
                name="name"
                placeholder="Vardas"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
                autoComplete="name"
                required
              />

              {/* El. paštas */}
              <label htmlFor="contact-email" className="sr-only">El. paštas</label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="El. paštas"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                autoComplete="email"
                required
              />

              {/* Submit */}
              <Button type="submit" className="rounded-xl" disabled={loading}>
                {loading ? "Siunčiama…" : "Siųsti"}
              </Button>

              {/* Žinutė */}
              <label htmlFor="contact-message" className="sr-only">Trumpai apie projektą</label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Trumpai apie projektą"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="md:col-span-3 rounded-xl"
                rows={4}
                required
              />

              {/* Būsenos pranešimai */}
              {ok === "success" && (
                <p className="text-sm text-green-600 md:col-span-3">
                  Gauta! Susisieksiu kuo greičiau.
                </p>
              )}
              {ok === "error" && (
                <p className="text-sm text-red-600 md:col-span-3">
                  Nepavyko išsiųsti. Pabandykite dar kartą.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
