import "server-only";
import nodemailer from "nodemailer";

// SMTP transport using the client's mail server (configured via env).
export function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

export const MAIL_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "";
