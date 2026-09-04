"use client";

import { FormEvent, useState } from "react";
import { FaCheck, FaPaperPlane } from "react-icons/fa";
import { addContactMessage } from "@/firebase";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website) return;

    setStatus("sending");
    try {
      await addContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || "Wiadomość z formularza kontaktowego",
        message: form.message.trim(),
      });
      setForm(initialForm);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const isSending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#24342f]">Imię</span>
          <input
            required
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="contact-input"
            placeholder="Jak masz na imię?"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#24342f]">E-mail</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="contact-input"
            placeholder="ty@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#24342f]">Temat</span>
        <input
          type="text"
          value={form.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className="contact-input"
          placeholder="W czym możemy pomóc?"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#24342f]">Wiadomość</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="contact-input min-h-36 resize-y"
          placeholder="Napisz kilka słów..."
        />
      </label>

      <input
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(event) => updateField("website", event.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-status" role="status" className="text-sm text-[#5d6d66]">
          {status === "sent" && (
            <span className="inline-flex items-center gap-2 font-semibold text-[#28735a]"><FaCheck /> Wiadomość wysłana. Odezwiemy się wkrótce.</span>
          )}
          {status === "error" && <span className="font-semibold text-[#a33d32]">Nie udało się wysłać wiadomości. Spróbuj ponownie.</span>}
        </p>
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#24342f] px-6 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#35554a] disabled:cursor-wait disabled:opacity-60"
        >
          {isSending ? "Wysyłanie..." : "Wyślij wiadomość"}
          <FaPaperPlane aria-hidden />
        </button>
      </div>
    </form>
  );
}
