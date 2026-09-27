"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { getPolishCurrency } from "@/lib/getPolishCurrency";

const quantityOptions = [
  { quantity: 1, discount: 0 },
  { quantity: 3, discount: 15 },
  { quantity: 5, discount: 20 },
  { quantity: 10, discount: 30 },
  { quantity: 20, discount: 50 },
] as const;

type PickerPreviewItem = {
  id: string;
  title?: string;
  image?: string;
};

type QuantityFlowOptions = {
  unitPrice: number;
  eyebrow?: string;
  title?: string;
  previewItems?: PickerPreviewItem[];
  loadingMessage?: string;
  onConfirm: (quantity: number) => void | boolean | Promise<void | boolean>;
};

type CartQuantityContextValue = {
  openQuantityPicker: (options: QuantityFlowOptions) => void;
};

const CartQuantityContext = createContext<CartQuantityContextValue | null>(null);

export function useCartQuantityFlow() {
  const context = useContext(CartQuantityContext);
  if (!context) {
    throw new Error("useCartQuantityFlow must be used inside CartQuantityFlow");
  }
  return context;
}

export default function CartQuantityFlow({ children }: { children: ReactNode }) {
  const [picker, setPicker] = useState<QuantityFlowOptions | null>(null);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const successDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (picker && dialog && !dialog.open) dialog.showModal();
  }, [picker]);

  useEffect(() => {
    const dialog = successDialogRef.current;
    if (success && dialog && !dialog.open) dialog.showModal();
  }, [success]);

  const value = useMemo(
    () => ({
      openQuantityPicker: (options: QuantityFlowOptions) => {
        setSuccess(false);
        setPicker(options);
      },
    }),
    []
  );

  const closePicker = () => {
    if (!adding) setPicker(null);
  };

  const confirmQuantity = async (quantity: number) => {
    if (!picker) return;
    setAdding(true);
    try {
      const added = await picker.onConfirm(quantity);
      if (added === false) return;
      setPicker(null);
      setSuccess(true);
    } finally {
      setAdding(false);
    }
  };

  return (
    <CartQuantityContext.Provider value={value}>
      {children}
      {picker &&
        typeof document !== "undefined" &&
        createPortal(
          <dialog
            ref={dialogRef}
            className="cart-quantity-backdrop"
            aria-modal="true"
            aria-labelledby="cart-quantity-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) closePicker();
            }}
            onCancel={(event) => {
              event.preventDefault();
              closePicker();
            }}
          >
            <section
              className={`cart-quantity-popup ${picker.previewItems ? "cart-quantity-popup-collection" : ""}`}
              onClick={(event) => event.stopPropagation()}
            >
              {adding && picker.loadingMessage ? (
                <div
                  className="cart-quantity-loading"
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <span className="cart-quantity-spinner" aria-hidden="true" />
                  <h2 id="cart-quantity-title">Dodajemy do koszyka</h2>
                  <p>{picker.loadingMessage}</p>
                </div>
              ) : (
                <>
                  <div className="cart-quantity-header">
                    <div>
                      <p className="cart-quantity-eyebrow">{picker.eyebrow ?? "Prawie gotowe"}</p>
                      <h2 id="cart-quantity-title">{picker.title ?? "Ile sztuk dodać?"}</h2>
                    </div>
                    <button
                      type="button"
                      className="cart-quantity-close"
                      onClick={closePicker}
                      disabled={adding}
                      aria-label="Zamknij wybór ilości"
                    >
                      ×
                    </button>
                  </div>
                  {picker.previewItems && (
                    <div className="cart-collection-preview" aria-label="Naklejki w kolekcji">
                      {picker.previewItems.map((item, index) => (
                        <div className="cart-collection-preview-item" key={`${item.id}-${index}`}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title || `Naklejka ${index + 1}`}
                              width={240}
                              height={240}
                              unoptimized
                            />
                          ) : (
                            <span>{item.title || `Naklejka ${index + 1}`}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="cart-quantity-options">
                    {quantityOptions.map(({ quantity, discount }) => {
                      const total = quantity * picker.unitPrice * (1 - discount / 100);
                      return (
                        <button
                          key={quantity}
                          type="button"
                          className="cart-quantity-option"
                          onClick={() => confirmQuantity(quantity)}
                          disabled={adding}
                        >
                          <span className="cart-quantity-count">{quantity}×</span>
                          <span className="cart-quantity-price">
                            {getPolishCurrency(total)}
                            {discount > 0 && <small>-{discount}%</small>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </dialog>,
          document.body
        )}
      {success &&
        typeof document !== "undefined" &&
        createPortal(
          <dialog
            ref={successDialogRef}
            className="cart-success-backdrop"
            aria-modal="true"
            aria-labelledby="cart-success-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSuccess(false);
            }}
            onCancel={(event) => {
              event.preventDefault();
              setSuccess(false);
            }}
          >
            <section className="cart-success-popup" onClick={(event) => event.stopPropagation()}>
              <span className="cart-success-icon">
                <FaCheck aria-hidden />
              </span>
              <h2 id="cart-success-title">Dodano do koszyka</h2>
              <div className="cart-success-actions">
                <Link
                  href="/checkout"
                  className="cart-success-button cart-success-button-primary"
                  onClick={() => setSuccess(false)}
                >
                  Zobacz koszyk
                </Link>
                <button
                  type="button"
                  className="cart-success-button cart-success-button-secondary"
                  onClick={() => setSuccess(false)}
                >
                  Przeglądaj dalej
                </button>
              </div>
            </section>
          </dialog>,
          document.body
        )}
    </CartQuantityContext.Provider>
  );
}
