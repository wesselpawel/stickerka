"use client";
import paymentgate3 from "../../../public/paymentgates/3.png";
import paymentgate4 from "../../../public/paymentgates/4.png";
import paymentgate5 from "../../../public/paymentgates/5.png";
import paymentgate6 from "../../../public/paymentgates/6.png";
import paymentgate7 from "../../../public/paymentgates/7.png";
import paymentgate8 from "../../../public/paymentgates/8.png";
import Image from "next/image";

const paymentGates = [
  paymentgate3,
  paymentgate4,
  paymentgate5,
  paymentgate6,
  paymentgate7,
  paymentgate8,
];

export default function AvailablePaymentOptions() {
  return (
    <div className="mx-auto w-max max-w-[calc(100%-1.5rem)] mb-12">
      <p className="text-lg font-extralight text-xs mb-4 text-center">Przyjmujemy płatności</p>
      <div className="flex flex-row items-center justify-center rounded-lg bg-white p-2 gap-3 lg:gap-6">
        {paymentGates.map((icon, i) => (
          <div key={i}>
            <Image
              src={icon}
              alt={`Payment Gate ${i}`}
              width={100}
              height={100}
              className="h-4 md:h-6 w-auto hover:scale-110 transition-transform "
            />
          </div>
        ))}
      </div>
    </div>
  );
}
