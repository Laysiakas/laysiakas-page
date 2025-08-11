// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Įeinančių duomenų schema
const BodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(5000),
  hp: z.string().optional(),      // honeypot (paslėptas laukas)
  t0: z.number().optional(),      // formos pradžios timestamp (ms)
});
type ContactBody = z.infer<typeof BodySchema>;

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  // Nekonvertuojam į any – skaitom kaip unknown ir validuojam su Zod
  const payloadUnknown: unknown = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(payloadUnknown);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const { name, email, message, hp, t0 } = parsed.data as ContactBody;

  // Anti‑spam: honeypot
  if (hp && hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Anti‑spam: minimalus pildymo laikas
  const minSec = Number(process.env.CONTACT_MIN_SECONDS ?? "3");
  if (t0 && Date.now() - t0 < minSec * 1000) {
    return NextResponse.json({ ok: true });
  }

  // SMTP (Brevo)
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT!);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const from = process.env.CONTACT_FROM!;
  const to = process.env.CONTACT_TO!;

  // 587 -> STARTTLS, 465 -> TLS
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure,
    tls: { minVersion: "TLSv1.2" },
  });

  await transporter.sendMail({
    from: `"Laysiakas svetainė" <${from}>`,
    to,
    replyTo: email,
    subject: `🔔 Nauja užklausa — ${name}`,
    text: `Vardas: ${name}\nEl. paštas: ${email}\n\n${message}`,
    html: `
      <div style="font:14px/1.6 system-ui, -apple-system, Segoe UI, Roboto">
        <h2 style="margin:0 0 12px">Nauja užklausa</h2>
        <p><b>Vardas:</b> ${escapeHtml(name)}</p>
        <p><b>El. paštas:</b> ${escapeHtml(email)}</p>
        <p><b>Žinutė:</b></p>
        <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
