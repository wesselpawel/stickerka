/* eslint-disable @next/next/no-img-element */
"use client";
import { createCheckout } from "@/lib/createCheckout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function StripeButton({
  setFormErrors,
  formErrors,
  customerInfo,
  acceptedTerms,
  price,
  cart,
  couponId,
}: {
  setFormErrors: Function;
  formErrors: any;
  customerInfo: any;
  acceptedTerms: boolean;
  price: number;
  cart: any;
  couponId: any;
}) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [malwareError, setMalwareError] = useState("");
  const [isFormError, setIsFormError] = useState(false);

  const validateCustomerInfo = (customerInfo: any) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "city",
      "postalCode",
      "street",
      "phoneNumber",
      "houseNumber",
    ];
    let hasError = false;

    const newFormErrors = { ...formErrors };
    requiredFields.forEach((field) => {
      if (!customerInfo[field as keyof any]?.length) {
        newFormErrors[field] = "Proszę uzupełnić to pole";
        hasError = true;
        setLoading(false);
      } else {
        delete newFormErrors[field];
      }
    });

    setFormErrors(newFormErrors);
    if (acceptedTerms === false) {
      hasError = true;
      setLoading(false);
      setFormErrors({
        ...formErrors,
        acceptedTerms: "Proszę zaakceptować regulamin",
      });
    }
    setTimeout(() => {
      setFormErrors();
      setIsFormError(false);
    }, 3500);
    setIsFormError(hasError);

    if (hasError) {
      setLoading(false);
      return true;
    } else {
      return false;
    }
  };

  const sendCheckoutRequest = () => {
    setLoading(true);
    const isError = validateCustomerInfo(customerInfo);
    if (!isError) {
      const orderId = uuidv4();
      createCheckout(
        {
          products: cart,
          productName: `Zamówienie numer: ${orderId}`,
          price: price,
          id: orderId,
          isPaid: false,
          couponId: couponId,
        },
        customerInfo,
        orderId
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          router.replace(`${data.url}`);
        }
      });
    }
  };
  return (
    <button
      type="button"
      className={`mt-8 flex min-h-[52px] w-full flex-row items-center justify-center rounded-2xl bg-chill-sage-dark px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-chill-sage disabled:cursor-not-allowed disabled:opacity-60 ${
        (malwareError || isFormError) && "!bg-red-600 hover:!bg-red-600"
      }`}
      disabled={isLoading || malwareError !== ""}
      onClick={sendCheckoutRequest}
    >
      {isLoading && (
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center">
          <img
            className="h-6 w-6"
            src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/blocks-shuffle-2.svg"
            alt=""
          />
        </span>
      )}
      {!isLoading && !malwareError && !isFormError && "Przejdź do płatności"}
      {isFormError && "Uzupełnij formularz i spróbuj ponownie"}
    </button>
  );
}

export default StripeButton;
