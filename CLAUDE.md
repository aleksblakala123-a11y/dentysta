# Wytyczne Projektu: Stomatologia Web

Strona wizytowkowa gabinetu **Amico Dental**, ul. Bronislawa Ratajczaka 9/20/21, 21-040 Swidnik.
Repo: `aleksblakala123-a11y/dentysta` -> GitHub Pages: https://aleksblakala123-a11y.github.io/dentysta/

## Podstawy

- **Jezyk tresci:** polski
- **Stack:** statyczny eksport z Webflow. HTML + jeden arkusz `assets/css/amico.css` + JS inline w plikach.
  **Nie ma tutaj Tailwinda** (poprzednia wersja tego pliku tak twierdzila - to bylo mylace).
  Nadal ladowane sa `jquery`, `webflow.schunk.*` i `webflow.*.js` z `assets/js/`.
- **Strony:** `index`, `about`, `service`, `blog` (nawigacyjne) + `privacy`, `terms`, `cookies`, `404`.
- **Kodowanie plikow:** UTF-8, **konce linii CRLF**. Nie zamieniaj ich na LF - zrobi to szum
  w diffie na cale pliki i nie da sie odczytac, co naprawde sie zmienilo.

## Zasady UX (bez zmian)

- Wszystkie numery telefonow klikalne przez `href="tel:..."`
- Wyrazne CTA: "Umow wizyte" / "Zadzwon"
- Pelna responsywnosc; dolna granica testow to **320 px**

## Wydajnosc i kod

- Minimalizm. Bez ciezkich bibliotek, jesli da sie natywnie (CSS transitions, IntersectionObserver,
  `requestAnimationFrame`). GSAP i ScrollTrigger byly juz raz wycinane.
- Cel: ponizej 60 KB zasobow zewnetrznych. **Stan faktyczny: sam CSS ma ~264 KB**, fonty 48 KB.
  Webflow zostawil w arkuszu duze ilosci martwych regul - to otwarty dlug, patrz dziennik prac.
- Semantyczny HTML, dostepnosc (a11y), obsluga `@media (prefers-reduced-motion: reduce)`.
- Nowe reguly dopisujemy **na koncu `amico.css`**, w blokach opatrzonych komentarzem
  `/* ===== Nazwa ===== */` wyjasniajacym, co bylo zepsute i dlaczego naprawione wlasnie tak.

## OBOWIAZKOWE: cache-busting

Po **kazdej** zmianie w `assets/css/amico.css` podbij `?v=` w tagu `<link>` we **wszystkich 12**
plikach HTML, ktore go linkuja. Format: `?v=RRRRMMDDx`, np. `?v=20260820k`.

Aktualna lista (stan 2026-08-23): `index`, `about`, `service`, `blog`, `cennik`,
`cennik-medycyna-estetyczna` w katalogu glownym oraz 6 wpisow w `blog/`.
Wczesniej bylo tu "wszystkich czterech" - to bylo nieaktualne od czasu dodania cennikow
i wpisow bloga. Zamiast liczyc z pamieci, sprawdz: `grep -l "amico.css" *.html blog/*.html`.

Pominiecie tego kroku daje najbardziej mylacy objaw w projekcie: poprawka jest na dysku, testy
przechodza, a przegladarka i CDN GitHub Pages nadal serwuja stary CSS. Wyglada to identycznie
jak "poprawka nie zadziala".

## Zanim uznasz cos za zepsute

1. Czy `?v=` zostalo podbite i czy zrobiles **twardy** refresh.
2. Czy patrzysz na wersje live czy lokalna - i czy zmiana jest zacommitowana i wypchnieta.
3. Czy zrzut ekranu / zgloszenie nie jest starsze niz ostatnia edycja plikow.

## Workflow

- Zadania atomowe: sekcja po sekcji, komponent po komponencie.
- Kazda zmiana wizualna weryfikowana pomiarem w przegladarce (Playwright/Chromium), a nie na oko:
  bounding boxy, `getComputedStyle`, `elementFromPoint`, kontrast liczony z pikseli.
- Przy bledzie wklejaj dokladny komunikat z konsoli.
