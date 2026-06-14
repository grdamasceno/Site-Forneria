"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTransport, MAIL_FROM } from "@/lib/mailer";

export type FormResult = { ok: boolean; error?: string };

async function recipients(formulario: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("form_emails")
    .select("email")
    .eq("formulario", formulario)
    .order("ordem");
  return (data ?? []).map((r) => r.email).filter(Boolean);
}

function row(label: string, value: string) {
  return `<tr><td style="padding:4px 10px;font-weight:bold;background:#f6f6f6">${label}</td><td style="padding:4px 10px">${value || "—"}</td></tr>`;
}

async function send(opts: {
  formulario: string;
  subject: string;
  rowsHtml: string;
  replyTo?: string;
  attachment?: { filename: string; content: Buffer };
}): Promise<FormResult> {
  const to = await recipients(opts.formulario);
  if (to.length === 0) return { ok: false, error: "Nenhum e-mail configurado para este formulário." };
  if (!process.env.SMTP_HOST) return { ok: false, error: "SMTP não configurado." };
  try {
    await getTransport().sendMail({
      from: MAIL_FROM,
      to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: `<div style="font-family:Arial,sans-serif"><table style="border-collapse:collapse">${opts.rowsHtml}</table></div>`,
      attachments: opts.attachment ? [opts.attachment] : undefined,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Falha ao enviar. Tente novamente." };
  }
}

export async function submitSac(formData: FormData): Promise<FormResult> {
  const v = (k: string) => String(formData.get(k) ?? "").trim();
  return send({
    formulario: "sac",
    subject: `[SAC] ${v("assunto") || "Contato pelo site"}`,
    replyTo: v("email"),
    rowsHtml:
      row("Nome", v("nome")) +
      row("E-mail", v("email")) +
      row("Telefone", v("telefone")) +
      row("Assunto", v("assunto")) +
      row("Mensagem", v("mensagem")),
  });
}

export async function submitTrabalhe(formData: FormData): Promise<FormResult> {
  const v = (k: string) => String(formData.get(k) ?? "").trim();
  const unidades = formData.getAll("unidades").map(String).join(", ");
  const file = formData.get("curriculo") as File | null;
  let attachment;
  if (file && file.size > 0) {
    attachment = { filename: file.name, content: Buffer.from(await file.arrayBuffer()) };
  }
  return send({
    formulario: "trabalhe_conosco",
    subject: `[Trabalhe Conosco] ${v("nome")}`,
    replyTo: v("email"),
    attachment,
    rowsHtml:
      row("Nome", v("nome")) +
      row("E-mail", v("email")) +
      row("Telefone", v("telefone")) +
      row("Área pretendida", v("area")) +
      row("Unidades de interesse", unidades),
  });
}
