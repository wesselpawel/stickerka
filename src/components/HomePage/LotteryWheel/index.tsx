"use client";
import WheelComponent from "./Wheel";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { FaCircleCheck, FaGift } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Confetti from "react-confetti";
import { addCoupon } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { copyToClipboard } from "@/lib/copyToClipboard";

type Prize = {
  id: number;
  title: string;
  imgSrc: string;
  description: string;
};

export default function LotteryWheel({
  listOfPrizes,
}: {
  listOfPrizes: Prize[];
}) {
  const [prizeListOpen, setPrizeListOpen] = useState(false);
  const [lotteryWheelOpen, setLotteryWheelOpen] = useState(false);
  const [lotteryMessage, setLotteryMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponWindowOpen, setCouponWindowOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<Prize>({
    id: -1,
    title: "",
    imgSrc: "",
    description: "",
  });
  const weelColors = () => {
    const arr: string[] = [];
    const colors = ["#F4B942", "#F26B5E", "#31C7C0", "#E85D9E", "#7C5CFC"];
    listOfPrizes.forEach(() => {
      const color = colors.shift() as string;
      arr.push(color);
      colors.push(color);
    });

    return arr;
  };
  const segColors = weelColors();
  const onFinished = async (winner: Prize) => {
    setPrize({
      id: winner.id,
      title: winner.title,
      imgSrc: winner.imgSrc,
      description: winner.description,
    });
    const couponId = uuidv4();
    function generateCouponValue() {
      const firstPart = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      const secondPart = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      return `${firstPart}-${secondPart}`;
    }
    const generatedCoupon = generateCouponValue();
    const couponObject = {
      id: couponId,
      value: generatedCoupon,
      used: false,
      prizeId: winner.id,
    };
    setCoupon(generatedCoupon);
    await addCoupon(couponObject);
  };
  return (
    <>
      <button
        type="button"
        aria-expanded={lotteryWheelOpen}
        aria-label="Otwórz koło loterii"
        onClick={() => setLotteryWheelOpen(!lotteryWheelOpen)}
        // Keep the "Wylosuj promocję" bar above the fixed header.
        className="fixed bottom-4 right-4 z-[4950] flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-chill-sage via-chill-mist to-chill-sea p-3 text-chill-ink shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chill-sage"
      >
        <div className="flex flex-col items-center justify-center gap-1.5 md:gap-2">
          <Image
            title="Sprawdź nasze wlepki"
            src="/lotteryWheel2.png"
            width={120}
            height={120}
            alt="Naklejki"
            className="w-12 opacity-95"
          />
          <p className="text-center text-nowrap text-sm font-light leading-tight text-white/90 md:text-base">

         KUPONY
          </p>
        </div>
      </button>
      {lotteryWheelOpen && (
        <div className="fixed inset-0 z-[4950] h-[100dvh] w-full overflow-y-auto bg-black/50 px-3 py-4 backdrop-blur-sm sm:px-6 ">
          <button
            type="button"
            className="fixed right-3 top-3 z-[4960] md:right-8 md:top-6"
            onClick={() => setLotteryWheelOpen(!lotteryWheelOpen)}
            aria-label="Zamknij loterię"
          >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg duration-300 hover:bg-chill-mist">
              <IoClose className="h-6 w-6 text-zinc-800" />
            </div>
          </button>
          {prize.title !== "" && (
            <div className="fixed w-full h-full top-0 -left-1/2 translate-x-1/2 z-0">
              <Confetti width={1920} height={1019} />
            </div>
          )}
          <div className="flex min-h-full w-full items-center justify-center py-12 sm:py-8">
            <div className="flex w-full max-w-[min(42rem,100%)] flex-col justify-center rounded-3xl border border-white/15 bg-slate-900/85 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-6">
              <div className="mb-3 flex w-full items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-chill-mist">Stickerka</p>
                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  Wylosuj promocję
                  </h2>
                </div>
                <button
                  onClick={() => setPrizeListOpen(!prizeListOpen)}
                  className="group hidden shrink-0 flex-row items-center justify-between overflow-hidden rounded-xl border border-white/15 bg-gray-800 duration-300 hover:bg-gray-900 sm:flex"
                >
                  <div className="flex h-12 w-12 items-center justify-center ">
                    <FaGift className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`relative z-10 pr-4 text-sm font-semibold duration-300`}
                  >
                    Lista nagród
                  </span>
                </button>
              </div>
              <WheelComponent
                listOfPrizes={listOfPrizes}
                segColors={segColors}
                winningSegment={null}
                onFinished={onFinished}
                primaryColor="#F4B942"
                contrastColor="white"
                buttonText="Losuj"
                isOnlyOnce={false}
                setLotteryMessage={setLotteryMessage}
              />
              {lotteryMessage && (
                <div className="w-full left-0 hidden sm:block absolute bottom-0 z-[4950] bg-black bg-opacity-70 text-center text-base font-bold text-white p-2 px-4 rounded-b-3xl drop-shadow-md shadow-black">
                  {lotteryMessage}
                </div>
              )}

              <button
                onClick={() => setPrizeListOpen(!prizeListOpen)}
                className="fixed bottom-4 left-1/2 z-[4960] flex -translate-x-1/2 flex-row items-center justify-between rounded-2xl bg-chill-sage text-white shadow-lg shadow-black/30 duration-200 hover:bg-chill-sage-dark sm:hidden"
              >
                <div className="flex items-center justify-center rounded-l-3xl bg-white w-12 h-12">
                  <FaGift className="w-6 h-6 text-zinc-800" />
                </div>
                <span className="px-4">Lista nagród</span>
              </button>
            </div>
            {lotteryMessage && (
              <div className="w-full left-0 sm:hidden fixed top-1/2 -translate-y-1/2 z-[4950] py-5 bg-black bg-opacity-70 text-center text-base font-bold text-white p-2 px-4 drop-shadow-md shadow-black">
                {lotteryMessage}
              </div>
            )}
            {prize.title !== "" && (
              <div className="fixed left-1/2 top-1/2 z-[4950] flex h-max w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-white font-sans shadow-xl">
                <h2 className="w-full rounded-t-3xl bg-gray-800 p-6 text-center font-display text-2xl font-semibold text-white">
                  Twoja promocja
                </h2>
                <Image
                  width={333}
                  height={333}
                  src={prize.imgSrc}
                  alt={`Nagroda ${prize.title}`}
                  className="w-3/5 sm:w-[300px] my-3"
                />
                <p className="text-sm text-center text-gray-500 p-3 ">
                  {prize.description}
                </p>
                {!couponWindowOpen && (
                  <button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setCouponWindowOpen(true);
                        setLoading(false);
                      }, 2000);
                    }}
                    disabled={couponWindowOpen || loading}
                    className={`bg-green-500 p-3 hover:bg-green-400 text-2xl flex items-center justify-center duration-200 w-full  text-white font-bold rounded-b-3xl`}
                  >
                    {!loading && !couponWindowOpen && "Odbierz"}
                    {loading && (
                      <div className="bg-white w-max h-8 rounded-md flex flex-row items-center justify-center px-2 font-bold">
                        <Image
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/blocks-shuffle-2.svg"
                          alt=""
                        />
                      </div>
                    )}
                  </button>
                )}
                {couponWindowOpen && !loading && (
                  <button
                    onClick={() => copyToClipboard(coupon, setCopied)}
                    className="bg-green-500 p-3 hover:bg-green-400 text-2xl flex items-center justify-center duration-200 w-full  text-white font-bold rounded-b-3xl relative group"
                  >
                    <div className={!copied ? "animate-bounce" : ""}>

                    {coupon}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-max bg-zinc-800 text-white rounded-xl p-3 text-sm">
                      <div className="relative w-full h-full">
                        {!copied ? (
                          "Kliknij aby skopiować"
                        ) : (
                          <div className="flex flex-row items-center">
                            <FaCircleCheck className="text-green-500 mr-2" />
                            Skopiowano pomyślnie
                          </div>
                        )}
                        <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-zinc-800 -bottom-5 rotate-45"></div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
            {prizeListOpen && (
              <div className="fixed left-1/2 top-1/2 z-[4950] flex h-max w-max max-w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start rounded-xl bg-white font-sans shadow-xl">
                <h2 className="w-full rounded-t-xl bg-gray-800 p-6 text-center font-display text-2xl font-semibold text-white">
                 KUPONY
                </h2>
                <div className="flex flex-col w-full p-6">
                  {listOfPrizes.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-row items-center justify-between font-sans text-sm font-semibold text-black"
                    >
                      <FaStar className="text-xl -mt-[1px] text-yellow-500 animate-pulse" />
                      <span className="px-6">{item.title}</span>
                      <FaStar className="text-xl -mt-[1px] text-yellow-500 animate-pulse" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setPrizeListOpen(false)}
                  className="bg-green-500 p-3 hover:bg-green-400 duration-200 w-full  text-white font-bold rounded-b-xl"
                >
                  Zamknij
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
