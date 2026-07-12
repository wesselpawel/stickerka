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
export default function LotteryWheel({
  listOfPrizes,
}: {
  listOfPrizes: any[];
}) {
  const [prizeListOpen, setPrizeListOpen] = useState(false);
  const [lotteryWheelOpen, setLotteryWheelOpen] = useState(false);
  const [lotteryMessage, setLotteryMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponWindowOpen, setCouponWindowOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState({
    title: "",
    imgSrc: "",
    description: "",
  });
  const weelColors = () => {
    let arr: any[] = [];
    let colors = ["#7C9A82", "#E8C4B8", "#6B9B9E", "#B8CFC0", "#5F7D65"];
    listOfPrizes.forEach((el) => {
      let color: any = colors.shift();
      arr.push(color);
      colors.push(color);
    });

    return arr;
  };
  const segColors = weelColors();
  const onFinished = async (winner: any) => {
    setPrize({
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
        onClick={() => setLotteryWheelOpen(!lotteryWheelOpen)}
        // Keep the "Wylosuj promocję" bar above the fixed header.
        className="fixed left-0 top-[56px] md:top-[76px] z-[4950] h-max w-full border-b border-chill-line/60 bg-gradient-to-r from-chill-sage via-chill-mist to-chill-sea py-2.5 text-chill-ink shadow-sm md:top-[4.75rem] md:py-3"
      >
        <div className="mx-auto flex flex-row items-center justify-center gap-2 md:gap-3">
          <Image
            title="Sprawdź nasze wlepki"
            src="/lotteryWheel2.png"
            width={120}
            height={120}
            alt="Wlepki"
            className="h-7 w-auto opacity-95 md:h-10"
          />
          <Image
            title="Sprawdź nasze nalepki"
            src="/lotterySign2.png"
            width={500}
            height={500}
            alt="Nalepki"
            className="mx-2 mt-0.5 h-5 w-auto opacity-95 md:mx-4 md:h-7"
          />
          <Image
            title="Sprawdź nasze wlepki"
            src="/lotteryWheel2.png"
            width={120}
            height={120}
            alt="Naklejki"
            className="h-7 w-auto opacity-95 md:h-10"
          />
        </div>
      </button>
      {lotteryWheelOpen && (
        <div className="fixed left-0 top-0 z-[4950] h-screen w-full bg-black/85">
          <button
            type="button"
            className="fixed right-4 top-20 z-[4950] md:right-8 md:top-24"
            onClick={() => setLotteryWheelOpen(!lotteryWheelOpen)}
            aria-label="Zamknij loterię"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white duration-300 hover:bg-opacity-90">
              <IoClose className="h-6 w-6 text-zinc-800" />
            </div>
          </button>
          {prize.title !== "" && (
            <div className="fixed w-full h-full top-0 -left-1/2 translate-x-1/2 z-0">
              <Confetti width={1920} height={1019} />
            </div>
          )}
          <div className="overflow-x-hidden h-full md:py-12 overflow-y-scroll w-full flex flex-col items-center justify-center">
            <div className="bg-slate-800/80 backdrop-blur-sm flex-col flex rounded-xl p-6 md:p-6 justify-center -translate-x-[23%] sm:-translate-x-0">
              <div className="flex flex-row w-full justify-between mb-3 ">
                <h2 className="flex text-2xl font-bold flex-row items-center text-white">
                  Wylosuj promocję
                </h2>
                <button
                  onClick={() => setPrizeListOpen(!prizeListOpen)}
                  className={`group hidden flex-row items-center justify-between overflow-hidden rounded-lg border duration-300 bg-chill-sage-dark sm:flex`}
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
                onFinished={(winner: any) => onFinished(winner)}
                primaryColor="gray"
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
                className="fixed bottom-5 right-1 z-[4950] flex flex-row items-center justify-between rounded-2xl bg-chill-sage text-white duration-200 hover:bg-chill-sage-dark sm:hidden"
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
                <h2 className="w-full rounded-t-3xl bg-chill-sage p-6 text-center font-display text-2xl font-semibold text-white">
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
                    {coupon}
                    <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -top-16 w-max bg-zinc-800 text-white rounded-xl p-3 text-sm">
                      <div className="relative w-full h-full">
                        {!copied ? (
                          "Kliknij aby skopiować"
                        ) : (
                          <div className="flex flex-row items-center">
                            <FaCircleCheck className="mr-2" />
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
                <h2 className="w-full rounded-t-xl bg-chill-sage-dark p-6 text-center font-display text-2xl font-semibold text-white">
                 Promocje
                </h2>
                <div className="flex flex-col w-full p-6">
                  {listOfPrizes.map((item: any, i: any) => (
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
