"use client";
import { useState, useEffect } from "react";
import { FaSmileBeam } from "react-icons/fa";
import paymentgate3 from "../../../public/paymentgates/3.png";
import paymentgate4 from "../../../public/paymentgates/4.png";
import paymentgate5 from "../../../public/paymentgates/5.png";
import paymentgate6 from "../../../public/paymentgates/6.png";
import paymentgate7 from "../../../public/paymentgates/7.png";
import paymentgate8 from "../../../public/paymentgates/8.png";
import Image from "next/image";

const purchaseData = [ 
  { customer: "M***a", quantity: "6 naklejek", total: "48,00 zł", icon: paymentgate3, padding:false },
  { customer: "K***n", quantity: "12 naklejek", total: "96,00 zł", icon: paymentgate4 },
  { customer: "A***a", quantity: "3 naklejki", total: "27,00 zł", icon: paymentgate5 },
  { customer: "P***r", quantity: "18 naklejek", total: "135,00 zł", icon: paymentgate6 },
  { customer: "O***a", quantity: "8 naklejek", total: "64,00 zł", icon: paymentgate7 },
  
  { customer: "M***a", quantity: "6 naklejek", total: "48,00 zł", icon: paymentgate8, padding:false },
  { customer: "K***n", quantity: "12 naklejek", total: "96,00 zł", icon: paymentgate3, padding:false },
  { customer: "A***a", quantity: "3 naklejki", total: "27,00 zł", icon: paymentgate5 },
  { customer: "P***r", quantity: "18 naklejek", total: "135,00 zł", icon: paymentgate6 },
  { customer: "O***a", quantity: "8 naklejek", total: "64,00 zł", icon: paymentgate7 },
  
  { customer: "M***a", quantity: "6 naklejek", total: "48,00 zł", icon: paymentgate8, padding:false },
  { customer: "K***n", quantity: "12 naklejek", total: "96,00 zł", icon: paymentgate3, padding:false },
  { customer: "A***a", quantity: "3 naklejki", total: "27,00 zł", icon: paymentgate5 },
  { customer: "P***r", quantity: "18 naklejek", total: "135,00 zł", icon: paymentgate6 },
  { customer: "O***a", quantity: "8 naklejek", total: "64,00 zł", icon: paymentgate7 },
  
  { customer: "A***a", quantity: "3 naklejki", total: "27,00 zł", icon: paymentgate5 },
  { customer: "P***r", quantity: "18 naklejek", total: "135,00 zł", icon: paymentgate6 },
  { customer: "O***a", quantity: "8 naklejek", total: "64,00 zł", icon: paymentgate7 },
];
export default function AnimatedNewestUsersPurchases() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % purchaseData.length);
    }, 3000); // 3 second pause

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto mb-4 w-max max-w-[calc(100%-1.5rem)] rounded-lg bg-[var(--color-white)]">
      <div className="relative h-12 overflow-hidden">
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * 48}px)`,
          }}
        >
          {purchaseData.map((item, i) => (
            <div
              key={i}
              className="flex h-12 items-center gap-3 rounded-lg border border-[var(--color-light-gray)] bg-zinc-700 p-3"
            >
                <div className="w-max h-max">

<Image src={item.icon} alt={item.customer} className={`h-auto w-10 ${item.padding === false? "" : "p-1 bg-white rounded-md"}`} width={32} height={32} />
                </div>
              <p className="text-sm font-medium text-[var(--color-black)]">
                {item.customer} kupił{item.customer === "A***a" || item.customer === "O***a" || item.customer === "M***a" ? "a" : ""}{" "}
                <strong className="font-bold text-green-600">{item.quantity}</strong>{" "}
                za <strong className="font-bold text-[#fb7700]">{item.total}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}