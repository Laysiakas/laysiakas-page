import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(5000),
  hp: z.string().optional(),
  t0: z.number().optional(),
});

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ... viršuje kaip buvo

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const { name, email, message, hp, t0 } = parsed.data;
    if (hp && hp.trim().length > 0) return NextResponse.json({ ok: true });

    const minSec = Number(process.env.CONTACT_MIN_SECONDS ?? "3");
    if (t0 && Date.now() - t0 < minSec * 1000) return NextResponse.json({ ok: true });

    const host = process.env.SMTP_HOST!;
    const port = Number(process.env.SMTP_PORT!);
    const secure = process.env.SMTP_SECURE === "true";

    console.log("[MAIL] Using SMTP:", { host, port, secure, user: process.env.SMTP_USER });

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,               // 587 => false, 465 => true
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
      requireTLS: !secure,  // STARTTLS kai 587
      tls: { minVersion: "TLSv1.2" },
    });

    // Patikrinam prisijungimą prieš siųsdami
    await transporter.verify().then(() => {
      console.log("[MAIL] transporter.verify() OK");
    }).catch((e) => {
      console.error("[MAIL] verify() FAIL:", e?.message || e);
      throw e;
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM!,
      to: process.env.CONTACT_TO!,
      replyTo: email,
      subject: `🔔 Nauja užklausa — ${name}`,
      text: `Vardas: ${name}\nEl. paštas: ${email}\n\n${message}`,
      html: `<div style="font:14px/1.5 sans-serif"><h2>Nauja užklausa</h2><p><b>Vardas:</b> ${name}</p><p><b>El. paštas:</b> ${email}</p><pre style="white-space:pre-wrap">${message}</pre></div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("CONTACT_API_ERROR:", err?.code, err?.response, err?.message || err);
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
