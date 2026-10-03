import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailTransport";

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '\"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  try {
    const { reciever, cartId } = await request.json();
    if (
      typeof reciever !== "string" ||
      reciever.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reciever) ||
      typeof cartId !== "string" ||
      !cartId.trim() ||
      cartId.length > 120
    ) {
      return NextResponse.json({ error: "Invalid email or order id" }, { status: 400 });
    }

    const safeCartId = escapeHtml(cartId);
    await sendEmail({
      to: reciever,
      subject: "Stickerka.pl: Twoje zamówienie jest przetwarzane.",
      text: `Dziękujemy za zakupy w naszym sklepie! Numer zamówienia: ${cartId}. Twoje naklejki dotrą do Ciebie w przeciągu 2-3 dni roboczych.`,
      html: `
        <div style="font-family: Arial,sans-serif;font-size: 16px;line-height: 1.5;color:white;background:#212121;border-radius:5px;padding:20px;">
          <h2 style="font-size: 24px; margin-bottom: 20px;">Dziękujemy za zakupy w naszym sklepie!</h2>
          <p style="margin-bottom: 20px;">Twoje naklejki dotrą do Ciebie bezpiecznie w przeciągu 2-3 dni roboczych!</p>
          <p style="margin-bottom: 20px;">Numer zamówienia: ${safeCartId}</p>
          <p style="margin-bottom: 20px;">W razie jakichkolwiek pytań prosimy o <a href="https://stickerka.pl/contact">kontakt</a> z numerem zamówienia w tytule.</p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Order email failed:", error);
    return NextResponse.json({ error: "Could not send order email" }, { status: 500 });
  }
}
