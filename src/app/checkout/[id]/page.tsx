import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import FinalizeOrder from "./FinalizeOrder";

function CheckoutBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      <div className="absolute inset-0 bg-chill-cream" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(58,214,195,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_80%,rgba(59,130,246,0.14),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(255,95,162,0.08),transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(7,10,16,0.92)_100%)]" />
    </div>
  );
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/orders?secret=${process.env.API_SECRET_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  ).then((res) => res.json());
  const order = orders?.data?.find(
    (o: { metadata?: { id?: string } }) => o.metadata?.id === id
  );

  if (!order) {
    return (
      <div className="fixed inset-0 z-[100] flex min-h-screen w-full flex-col items-center justify-center px-6 text-chill-ink">
        <CheckoutBackdrop />
        <div className="relative z-10 mx-auto max-w-md rounded-2xl border border-chill-line/80 bg-chill-sand/60 p-10 text-center shadow-[0_0_0_1px_rgba(58,214,195,0.08),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-chill-ink">
            Nie znaleziono zamówienia
          </h1>
          <p className="mt-3 text-sm text-chill-muted">
            Sprawdź link lub wróć na stronę główną.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-chill-sage/40 bg-chill-sage/10 px-5 py-2.5 text-sm font-semibold text-chill-sage transition hover:bg-chill-sage/20 hover:text-chill-ink"
          >
            <FaArrowLeft className="text-xs" />
            Powrót
          </Link>
        </div>
      </div>
    );
  }

  const displayOrderId =
    typeof order.metadata?.id === "string" ? order.metadata.id : id;

  return (
    <div className="fixed inset-0 z-[100] min-h-screen w-full overflow-y-auto text-chill-ink">
      <CheckoutBackdrop />

      <Link
        href="/"
        className="relative z-20 inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-chill-muted transition hover:text-chill-sage md:absolute md:left-8 md:top-24 md:px-0 lg:left-12 xl:left-20 2xl:left-32"
      >
        <FaArrowLeft className="text-xs" aria-hidden />
        Powrót
      </Link>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28 md:pt-20">
        {order.payment_status === "paid" && (
          <div className="w-full max-w-lg text-center">
            <FinalizeOrder order={order} orderId={id} />

            <div className="rounded-2xl border border-chill-line/90 bg-chill-sand/55 p-8 shadow-[0_0_0_1px_rgba(58,214,195,0.06),0_32px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-10">
              <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-chill-sage">
                Sukces
              </p>
              <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-chill-ink md:text-4xl">
                Dziękujemy za zakupy!
              </h1>
              <p className="mt-4 text-chill-muted">
                Potwierdzenie trafi na Twój e-mail. Poniżej znajdziesz numer
                zamówienia — zachowaj go na wypadek korespondencji z nami.
              </p>
              <div className="mt-8 rounded-xl border border-chill-line bg-chill-cream/50 px-4 py-5">
                <p className="text-xs font-medium uppercase tracking-wider text-chill-muted">
                  Numer zamówienia
                </p>
                <p className="mt-2 break-all font-mono text-lg font-semibold text-chill-sage md:text-xl">
                  {displayOrderId}
                </p>
              </div>
              <p className="mt-8 text-sm text-chill-muted">
                W razie pytań przejdź do{" "}
                <Link
                  href="/contact"
                  className="font-medium text-chill-sage underline decoration-chill-sage/40 underline-offset-4 transition hover:text-chill-ink hover:decoration-chill-sage"
                >
                  kontaktu
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {order.payment_status === "unpaid" && (
          <div className="w-full max-w-lg text-center">
            <div className="rounded-2xl border border-chill-line/90 bg-chill-sand/55 p-8 shadow-[0_0_0_1px_rgba(255,95,162,0.12),0_32px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-10">
              <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-chill-peach">
                Płatność
              </p>
              <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-chill-ink md:text-4xl">
                Płatność nie powiodła się
              </h1>
              <p className="mt-4 text-chill-muted">
                Nic nie zostało pobrane. Możesz spróbować ponownie — link
                poniżej jest ważny do zakończenia sesji checkoutu.
              </p>
              <div className="mt-8 rounded-xl border border-chill-line bg-chill-cream/50 px-4 py-5">
                <p className="text-xs font-medium uppercase tracking-wider text-chill-muted">
                  Numer zamówienia
                </p>
                <p className="mt-2 break-all font-mono text-lg font-semibold text-chill-peach md:text-xl">
                  {displayOrderId}
                </p>
              </div>
              <Link
                href={order.url}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-chill-sage px-8 py-3 text-sm font-semibold text-chill-cream transition hover:bg-chill-sage-dark"
              >
                Przejdź do płatności
              </Link>
              <p className="mt-8 text-sm text-chill-muted">
                W razie pytań przejdź do{" "}
                <Link
                  href="/contact"
                  className="font-medium text-chill-sage underline decoration-chill-sage/40 underline-offset-4 transition hover:text-chill-ink hover:decoration-chill-sage"
                >
                  kontaktu
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
