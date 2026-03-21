"use client";
import { updateOrder } from "@/firebase";
import { clearCart } from "@/redux/slices/shopSlice";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useRef } from "react";

export default function FinalizeOrder({
  order,
  orderId,
}: {
  order: any;
  /** Firestore / Stripe metadata id from the URL (always defined when parent renders this). */
  orderId: string;
}) {
  const dispatch = useAppDispatch();
  const ranRef = useRef(false);

  useEffect(() => {
    const id =
      orderId ||
      (typeof order?.metadata?.id === "string" ? order.metadata.id : "");
    if (!id || ranRef.current) return;

    if (typeof window === "undefined") return;

    const doneKey = `checkout-finalized-${id}`;
    if (sessionStorage.getItem(doneKey)) {
      localStorage.removeItem("cart");
      dispatch(clearCart());
      return;
    }

    const lockKey = `checkout-finalize-lock-${id}`;
    if (sessionStorage.getItem(lockKey)) return;
    sessionStorage.setItem(lockKey, "1");
    ranRef.current = true;

    const sendMail = async () => {
      await updateOrder(["isPaid"], [true], id);
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mailer`, {
        method: "POST",
        body: JSON.stringify({
          reciever: order.customer_details?.email,
          cartId: id,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    };

    sendMail()
      .then(() => {
        sessionStorage.setItem(doneKey, "1");
        sessionStorage.removeItem(lockKey);
        localStorage.removeItem("cart");
        dispatch(clearCart());
      })
      .catch((error) => {
        console.error("Error sending mail:", error);
        sessionStorage.removeItem(lockKey);
        ranRef.current = false;
      });
  }, [dispatch, order?.metadata?.id, order?.customer_details?.email, orderId]);

  return <div></div>;
}
