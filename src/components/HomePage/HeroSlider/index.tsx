"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRightLong } from "react-icons/fa6";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userInteraction, setUserInteraction] = useState(false);

  useEffect(() => {
    let timeoutId: any;

    const handleTimeout = () => {
      if (currentSlide <= 4) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setCurrentSlide(0);
      }
    };

    if (!userInteraction) {
      timeoutId = setTimeout(handleTimeout, 5000);
    }

    return () => {
      // Cleanup function to clear the timeout when the component unmounts or when user interacts
      clearTimeout(timeoutId);
    };
  }, [currentSlide, userInteraction]);

  return (
    <div
      className={`relative mt-3 h-[50vh] w-full overflow-hidden rounded-3xl border border-chill-line/80 bg-chill-sand/30 shadow-lg shadow-chill-ink/[0.04] lg:mt-4`}
    >
      {[
        {
          id: 0,
          text: "Unikalne naklejki!",
          link: {
            href: "/sklep",
            title: "Przejdź do sklepu",
            Icon: <FaRightLong className="ml-2" />,
          },
          description:
            "W naszej bogatej kolekcji, obejmującej ponad 2000 różnorodnych naklejek, z pewnością znajdziesz coś idealnego dla siebie!",
          center: true,
        },
        {
          id: 1,
          text: "Naklejki na wymiar!",
          link: { href: "", title: "" },
          description:
            "W naszym asortymencie znajdziesz różnorodne wymiary, dostosowane do różnych preferencji i potrzeb.",
          center: true,
        },
        {
          id: 2,
          text: "Pobudź kreatywność!",
          link: {
            href: "/tworzenie-naklejek",
            title: "Do kreatora",
            Icon: <FaRightLong className="ml-2" />,
          },
          description:
            "Oferujemy Ci szansę stworzenia własnej, personalizowanej naklejki, która idealnie odzwierciedli Twój wyjątkowy styl.",
          center: true,
        },
        {
          id: 3,
          text: "Naklejki holograficzne!",
          link: { href: "", title: "" },
          description: (
            <div className="flex flex-col">
              <p>
                <Link
                  href="/about/o-naszych-naklejkach"
                  className="text-chill-mist underline decoration-chill-mist/80 underline-offset-2 hover:text-white"
                >
                  Nasze usługi
                </Link>{" "}
                to nie tylko wysoka jakość i dbałość o szczegóły, oferujemy druk
                naklejek na zwykłych i holograficznych strukturach papieru.
              </p>
              <ul className="flex flex-row items-start justify-center mt-2 space-x-3 flex-wrap sm:flex-no-wrap">
                <li className="flex flex-row items-center">
                  <FaStar className="mr-2 h-4 w-4 text-chill-peach" />
                  Papier złoty
                </li>
                <li className="mb-1 flex flex-row items-center">
                  <FaStar className="mr-2 h-4 w-4 text-chill-peach" />
                  Papier srebrny
                </li>
                <li className="flex flex-row items-center">
                  <FaStar className="mr-2 h-4 w-4 text-chill-peach" />
                  Papier zwykły
                </li>
              </ul>
            </div>
          ),
          center: true,
        },
        {
          id: 4,
          text: "Dowolność zakupów",
          link: {
            href: "/sklep",
            title: "Zobacz wzory",
            Icon: <FaRightLong className="ml-2" />,
          },
          description: (
            <p>
              Każda naklejka jest wycinana własnoręcznie, dzięki czemu w naszym
              sklepie możesz zacząć kolekcjonować unikalne wzory od jednej
              sztuki!
            </p>
          ),
          center: true,
        },
        {
          id: 5,
          text: "Udekoruj przedmioty!",
          link: {
            href: "/about/inspiracja-naklejkami",
            title: "Inspiracja naklejkami",
            Icon: <FaRightLong className="ml-2" />,
          },
          description:
            "Odkryj nowoczesne wzory i zanurz się w pełni barw, które ożywią każde pomieszczenie oraz przedmiot!",
          center: true,
        },
      ].map((slide) => (
        <>
          <Slider
            key={slide.id}
            slideNumber={slide.id}
            currentSlide={currentSlide}
            text={slide.text}
          />
          <SliderContent
            currentSlide={currentSlide}
            slideNumber={slide.id}
            slide={slide}
            key={slide.text}
          />
        </>
      ))}
      <div
        className={`absolute bottom-3 left-1/2 z-[500] flex -translate-x-1/2 flex-row items-center gap-2.5 rounded-full bg-chill-ink/25 px-3 py-2 backdrop-blur-sm lg:bottom-6`}
      >
        {[0, 1, 2, 3, 4, 5].map((slideNumber) => (
          <button
            onClick={() => {
              setCurrentSlide(slideNumber);
              setUserInteraction(true);
            }}
            className={`${
              currentSlide === slideNumber
                ? "border-chill-sage bg-chill-sage"
                : "border-white/50 bg-white/25"
            } flex h-4 w-4 items-center justify-center rounded-full border-2 duration-200 md:h-5 md:w-5`}
            key={slideNumber}
          >
            <div
              className={`w-2.5 h-2.5 bg-white rounded-full duration-300 ${
                currentSlide === slideNumber ? "scale-100" : "scale-0"
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Slider({
  slideNumber,
  currentSlide,
  text,
}: {
  slideNumber: number;
  currentSlide: number;
  text: string;
}) {
  const isActive = slideNumber === currentSlide;

  return (
    <div
      className={`left-1/2 -translate-x-1/2 top-0 absolute w-full h-[65vh] flex items-center justify-center slider  ${
        isActive ? "active" : ""
      }`}
    >
      <Image
        src={`/sliderImages/${slideNumber}.webp`} // Adjust image paths accordingly
        width={1300}
        height={1024}
        alt={text}
        className={`h-full lg:w-full lg:h-auto object-cover relative z-0`}
      />
    </div>
  );
}
function SliderContent({
  slideNumber,
  currentSlide,
  slide,
}: {
  slideNumber: number;
  currentSlide: number;
  slide: any;
}) {
  const isActive = slideNumber === currentSlide;

  return (
    <div
      className={`${isActive ? "active z-[50]" : "z-[0]"} ${
        slideNumber === 1 && "!p-0"
      } ${
        slide.center
          ? "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          : "left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-12 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-12"
      } slider absolute flex h-max w-[90%] max-w-[750px] flex-col rounded-3xl border border-white/10 bg-chill-ink/45 p-4 backdrop-blur-md md:p-7`}
    >
      <h2
        className={`${slideNumber === 1 && "px-3 pt-3 sm:pt-6 sm:px-6"} ${
          slide.center ? "text-center" : "text-center lg:text-left"
        } font-display text-2xl font-semibold text-white md:text-4xl`}
      >
        {slide.text}
      </h2>
      <div
        className={`${slideNumber === 1 && "px-3 sm:px-12 lg:px-16"} ${
          slide.center ? "text-center" : "text-center lg:text-left"
        } mt-3 text-sm leading-relaxed text-white/95 md:text-base`}
      >
        {slide.description}
        {slide.link.title && (
          <Link
            title={slide.link.title}
            href={slide.link.href}
            className={`${
              slide.center ? "mx-auto" : "mx-auto lg:mx-0"
            } mt-2 flex w-max flex-row items-center rounded-full border border-white/30 bg-chill-sage px-5 py-2 text-base font-semibold text-white shadow-sm duration-300 hover:bg-chill-sage-dark sm:text-lg lg:mt-3`}
          >
            {slide.link.title}
            {slide.link.Icon && slide.link.Icon}
          </Link>
        )}
      </div>
      {slideNumber === 1 && (
        <>
          <div className="mx-auto mt-2 grid w-full grid-cols-3 gap-3 rounded-b-3xl bg-white/10 py-3 text-white md:mt-4 lg:mx-0">
            <div className="flex flex-col items-center">
              <span className="text-sm opacity-90 lg:font-semibold">Mała</span>{" "}
              <span className="font-display text-chill-peach">6cm</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/20 px-3">
              <span className="text-sm opacity-90 lg:font-semibold">Średnia</span>{" "}
              <span className="font-display text-chill-peach">8cm</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm opacity-90 lg:font-semibold">Duża</span>{" "}
              <span className="font-display text-chill-peach">14cm</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
