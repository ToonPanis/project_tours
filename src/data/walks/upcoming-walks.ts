import type { Locale } from "@/i18n/config";
import { pickContent, type LocalizedContent } from "@/i18n/content";
import { createTranslator } from "@/i18n/translate";
import type { UpcomingWalk } from "@/types/walk";

type UpcomingText = Record<string, { title: string; shortDescription: string }>;

/** Walks announced as "coming soon". They have no route or detail page yet. */
const upcomingWalkData: Omit<UpcomingWalk, "title" | "shortDescription" | "city">[] = [
  { id: "walk-dark-antwerp", slug: "dark-antwerp" },
  { id: "walk-rubens-code", slug: "the-rubens-code" },
];

const upcomingText: LocalizedContent<UpcomingText> = {
  en: {
    "walk-dark-antwerp": {
      title: "Dark Antwerp",
      shortDescription: "Legends, crimes and mysteries from the darker side of Antwerp's history.",
    },
    "walk-rubens-code": {
      title: "The Rubens Code",
      shortDescription: "A mystery walk around Peter Paul Rubens, historic Antwerp, its churches and works of art.",
    },
  },
  nl: {
    "walk-dark-antwerp": {
      title: "Duister Antwerpen",
      shortDescription: "Legendes, misdaden en mysteries uit de donkere kant van de Antwerpse geschiedenis.",
    },
    "walk-rubens-code": {
      title: "De Rubenscode",
      shortDescription: "Een mysteriewandeling rond Pieter Paul Rubens, het historische Antwerpen, zijn kerken en kunstwerken.",
    },
  },
  fr: {
    "walk-dark-antwerp": {
      title: "Anvers la sombre",
      shortDescription: "Légendes, crimes et mystères de la face cachée de l'histoire d'Anvers.",
    },
    "walk-rubens-code": {
      title: "Le code Rubens",
      shortDescription: "Une balade-énigme autour de Pierre Paul Rubens, du vieil Anvers, de ses églises et de ses œuvres d'art.",
    },
  },
  es: {
    "walk-dark-antwerp": {
      title: "Amberes oscura",
      shortDescription: "Leyendas, crímenes y misterios del lado más oscuro de la historia de Amberes.",
    },
    "walk-rubens-code": {
      title: "El código Rubens",
      shortDescription: "Un paseo de misterio en torno a Pedro Pablo Rubens, el Amberes histórico, sus iglesias y sus obras de arte.",
    },
  },
  it: {
    "walk-dark-antwerp": {
      title: "Anversa oscura",
      shortDescription: "Leggende, crimini e misteri dal lato più oscuro della storia di Anversa.",
    },
    "walk-rubens-code": {
      title: "Il codice Rubens",
      shortDescription: "Una passeggiata-mistero intorno a Pieter Paul Rubens, all'Anversa storica, alle sue chiese e alle sue opere d'arte.",
    },
  },
  de: {
    "walk-dark-antwerp": {
      title: "Dunkles Antwerpen",
      shortDescription: "Legenden, Verbrechen und Rätsel von der dunklen Seite der Antwerpener Geschichte.",
    },
    "walk-rubens-code": {
      title: "Der Rubens-Code",
      shortDescription: "Ein Rätselrundgang rund um Peter Paul Rubens, das historische Antwerpen, seine Kirchen und Kunstwerke.",
    },
  },
  ru: {
    "walk-dark-antwerp": {
      title: "Тёмный Антверпен",
      shortDescription: "Легенды, преступления и загадки с тёмной стороны истории Антверпена.",
    },
    "walk-rubens-code": {
      title: "Код Рубенса",
      shortDescription: "Прогулка-загадка вокруг Питера Пауля Рубенса, старого Антверпена, его церквей и произведений искусства.",
    },
  },
  uk: {
    "walk-dark-antwerp": {
      title: "Темний Антверпен",
      shortDescription: "Легенди, злочини й таємниці з темного боку історії Антверпена.",
    },
    "walk-rubens-code": {
      title: "Код Рубенса",
      shortDescription: "Прогулянка-загадка навколо Пітера Пауля Рубенса, старовинного Антверпена, його церков і творів мистецтва.",
    },
  },
};

export function getUpcomingWalks(locale?: Locale): UpcomingWalk[] {
  const text = pickContent(upcomingText, locale ?? "en");
  const city = createTranslator(locale ?? "en")("common.cities.antwerp");
  return upcomingWalkData.map((walk) => ({ ...walk, city, ...text[walk.id] }));
}

/** English, e.g. for tests. */
export const upcomingWalks: UpcomingWalk[] = getUpcomingWalks("en");
