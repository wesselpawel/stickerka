import Link from "next/link";

type SeoContentPage = "home" | "about" | "inspiration" | "custom" | "designers";

type SeoContentProps = {
  page: SeoContentPage;
};

const content = {
  home: {
    label: "Sklep z naklejkami",
    title: "Naklejki, które dodają charakteru",
    intro: (
      <>
        <strong>Stickerka.pl</strong> to polski sklep z naklejkami dekoracyjnymi,
        kolekcjonerskimi i personalizowanymi. Wybieramy wyraziste ilustracje,
        przygotowujemy je z dbałością o szczegóły i pomagamy znaleźć wzór do
        laptopa, telefonu, notesu, opakowania albo wnętrza.
      </>
    ),
    sections: [
      {
        title: "Jakie naklejki znajdziesz w Stickerka.pl?",
        text: (
          <>
            W sklepie czekają naklejki z autorskimi motywami, wzory kolorowe,
            minimalistyczne, zabawne i inspirowane popkulturą. Możesz wybrać
            pojedynczą naklejkę albo połączyć kilka w zestaw dopasowany do
            własnego stylu. Zobacz aktualne kolekcje w naszym <Link href="/sklep">sklepie z naklejkami</Link>.
          </>
        ),
      },
      {
        title: "Naklejki na laptopa, telefon i do domu",
        text: (
          <>Naklejki pomagają szybko odświeżyć przedmioty, których używasz każdego dnia. Sprawdzą się na laptopie, etui telefonu, bidonie, meblach, pudełkach i w pokoju dziecka. Wybierając miejsce aplikacji, dopasuj wzór i rozmiar do gładkiej, czystej powierzchni.</>
        ),
      },
      {
        title: "Trwałe materiały i ręczne przygotowanie",
        text: (
          <>Dbamy o wyraźne kolory, dokładne wycinanie i estetyczne wykończenie. Każde zamówienie przygotowujemy z uwagą, aby naklejka dobrze prezentowała się od pierwszego dnia i była prostym sposobem na personalizację.</>
        ),
      },
      {
        title: "Naklejki dla osób, twórców i firm",
        text: (
          <>Potrzebujesz naklejek z własną grafiką, logo albo krótkim hasłem? Opisz swój pomysł na stronie <Link href="/about/tworzenie-wlasnych-naklejek">własnych naklejek</Link> lub <Link href="/kontakt">skontaktuj się z nami</Link>. Przy większych zamówieniach przygotujemy rozwiązanie dopasowane do Twojej marki.</>
        ),
      },
    ],
  },
  about: {
    label: "O Stickerka.pl",
    title: "Poznaj Stickerka.pl i nasze podejście do naklejek",
    intro: (
      <>Stickerka.pl powstała z połączenia ilustracji, ręcznej pracy i radości z małych przedmiotów, które mogą opowiadać coś o swoim właścicielu. Tworzymy naklejki dla osób szukających gotowych wzorów oraz dla tych, którzy chcą zamienić własny pomysł w fizyczny produkt.</>
    ),
    sections: [
      { title: "Od inspiracji do gotowej naklejki", text: <>Rozwijamy kolekcje tak, aby obok popularnych motywów było w nich miejsce na nowe style i niezależne ilustracje. Zajrzyj do <Link href="/about/o-naszych-naklejkach">informacji o naszych naklejkach</Link>, poznaj proces i wybierz kierunek dla siebie.</> },
      { title: "Naklejki do codziennych zastosowań", text: <>Naklejka może ozdobić laptop, telefon, notes, opakowanie prezentu, mebel lub kącik do pracy. W <Link href="/about/inspiracja-naklejkami">strefie inspiracji</Link> pokazujemy, jak wykorzystać je w domu, biurze i podczas tworzenia własnych projektów.</> },
      { title: "Własny projekt i współpraca", text: <>Realizujemy pomysły klientów i rozmawiamy o kolekcjach z artystami, projektantami oraz firmami. Sprawdź, jak wygląda <Link href="/about/tworzenie-wlasnych-naklejek">tworzenie własnych naklejek</Link> albo przeczytaj o <Link href="/about/projektanci-naklejek">współpracy z projektantami</Link>.</> },
    ],
  },
  inspiration: {
    label: "Inspiracje naklejkami",
    title: "Gdzie wykorzystać naklejki? Pomysły na każdy dzień",
    intro: <>Naklejki są prostym sposobem na personalizację rzeczy, z których korzystasz codziennie. Odpowiednio dobrany wzór może dodać energii stanowisku pracy, ożywić mebel albo stworzyć małą, prywatną galerię na laptopie.</>,
    sections: [
      { title: "Naklejki na laptopa i telefon", text: <>Połącz kilka mniejszych wzorów lub wybierz jedną wyrazistą ilustrację. To szybka dekoracja sprzętu, która pozwala pokazać zainteresowania bez wymiany całego etui czy obudowy.</> },
      { title: "Dekoracje do domu i biura", text: <>Naklejki mogą uzupełnić pudełka, notesy, meble i akcesoria na biurku. Wybierz spójną paletę albo zbuduj kolekcję kontrastujących motywów, aby nadać przestrzeni bardziej osobisty charakter.</> },
      { title: "Własny styl zamiast gotowego schematu", text: <>Inspiracji szukaj w ulubionych kolorach, naturze, popkulturze i codziennych rytuałach. Gotowe wzory znajdziesz w <Link href="/sklep">sklepie</Link>, a własny pomysł możesz rozwinąć na stronie <Link href="/about/tworzenie-wlasnych-naklejek">personalizowanych naklejek</Link>.</> },
    ],
  },
  custom: {
    label: "Naklejki personalizowane",
    title: "Stwórz własną naklejkę ze zdjęcia lub pomysłu",
    intro: <>Własna naklejka to sposób na zachowanie wspomnienia, przygotowanie wyjątkowego prezentu albo wyróżnienie marki. Możesz zacząć od zdjęcia, ilustracji, logo, napisu lub krótkiego opisu tego, co chcesz zobaczyć na gotowym wzorze.</>,
    sections: [
      { title: "Jak przygotować projekt naklejki?", text: <>Wybierz wyraźny plik i zastanów się, gdzie naklejka będzie używana. W wiadomości opisz preferowany rozmiar, kształt, kolorystykę i liczbę sztuk. Im więcej szczegółów znamy, tym łatwiej dopasować projekt do Twojej wizji.</> },
      { title: "Naklejki ze zdjęć, ilustracji i logo", text: <>Personalizowane naklejki sprawdzą się jako prezent, oznaczenie produktów, dodatek do paczek i element identyfikacji wizualnej. Mogą przedstawiać osobę, zwierzę, postać, grafikę lub znak Twojej firmy.</> },
      { title: "Porozmawiajmy o Twoim pomyśle", text: <>Przeczytaj więcej o <Link href="/about/projektanci-naklejek">współpracy z artystami i firmami</Link> albo napisz przez <Link href="/kontakt">formularz kontaktowy</Link>. Gotowe kolekcje możesz obejrzeć w <Link href="/sklep">sklepie Stickerka.pl</Link>.</> },
    ],
  },
  designers: {
    label: "Współpraca dla twórców i firm",
    title: "Naklejki dla artystów, projektantów i marek",
    intro: <>Współpraca ze Stickerka.pl pozwala przełożyć ilustracje i pomysły na kolekcję fizycznych naklejek. Rozmawiamy zarówno z niezależnymi twórcami, jak i firmami, które potrzebują spójnych materiałów promocyjnych.</>,
    sections: [
      { title: "Dla artystów i projektantów", text: <>Możemy wspólnie opracować serię wzorów, ustalić kierunek kolekcji i przygotować naklejki gotowe do sprzedaży lub promocji twórczości. Liczy się charakter projektu, jakość wykonania i dobra komunikacja.</> },
      { title: "Naklejki reklamowe dla firm", text: <>Naklejki z logo, hasłem lub ilustracją marki są praktycznym dodatkiem do paczek, eventów i kampanii. Pomagają zwiększyć rozpoznawalność firmy, a klient może wykorzystać je później na własnych przedmiotach.</> },
      { title: "Następny krok", text: <>Opisz zakres projektu, planowaną liczbę naklejek i termin realizacji na stronie <Link href="/kontakt">kontaktu</Link>. Jeśli szukasz gotowych inspiracji, sprawdź nasze <Link href="/sklep">kolekcje naklejek</Link> oraz stronę o <Link href="/about/tworzenie-wlasnych-naklejek">tworzeniu własnych wzorów</Link>.</> },
    ],
  },
} satisfies Record<SeoContentPage, { label: string; title: string; intro: React.ReactNode; sections: { title: string; text: React.ReactNode }[] }>;

export default function SeoContent({ page }: SeoContentProps) {
  const pageContent = content[page];

  return (
    <section aria-labelledby={`${page}-seo-title`} className="mx-auto mt-16 w-full max-w-6xl border-t border-chill-line px-4 py-14 text-chill-ink md:px-8 lg:px-12">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-chill-sage">{pageContent.label}</p>
      <h2 id={`${page}-seo-title`} className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-4xl">
        {pageContent.title}
      </h2>
      <p className="mt-5 max-w-4xl text-base leading-relaxed text-chill-muted">{pageContent.intro}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {pageContent.sections.map((section) => (
          <article key={section.title}>
            <h3 className="font-display text-xl font-semibold">{section.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-chill-muted">{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
