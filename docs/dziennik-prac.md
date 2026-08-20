# Dziennik prac - 20.08.2026

Zapis sesji, zeby przy zmianie narzedzia (Cowork -> Claude Code) nie trzeba bylo
odtwarzac ustalen. Wszystkie liczby ponizej sa **zmierzone** w Chromium
(Playwright), nie szacowane.

---

## 1. Falszywy trop, ktory zjadl pol dnia

Zgloszenie: "po usunieciu GSAP wszystko sie sypie - slider, blog, akordeony,
znikajaca tresc". Po odtworzeniu kodu w przegladarce:

- slider opinii **dzialal** (kropki przelaczaly slajdy, autoplay chodzil, 0 bledow JS),
- akordeony **otwieraly sie** z pelna trescia (12 paneli na `index`, po 4 na `blog`/`service`),
- karty zespolu **nie nachodzily** na siebie,
- linki bloga **nie byly zepsute** - patrz punkt 5.

Realny byl **jeden** blad z czterech: skakanie strony przy akordeonach (punkt 2).

Przyczyna rozbieznosci: **niepodbity cache-buster** (`?v=20260818a` przy CSS zmienionym
20.08) plus ocenianie wersji live, ktora byla o kilka commitow z tylu. Stad twarda regula
w `CLAUDE.md`.

**Wniosek na przyszlosc:** zanim zaczniesz szukac buga - sprawdz, czy patrzysz na ten sam
kod, ktory masz na dysku. Ja sam popelnilem lustrzany blad: powtarzalem "na live jest stan
z 02:15" na podstawie odczytu sprzed kilku godzin, podczas gdy commit z 17:55 juz istnial.
Czytaj `git log`, nie wspomnienia.

---

## 2. Skakanie strony przy akordeonach (naprawione, potem cofniete resetem)

Akordeony sa wykluczajace - otwarcie pozycji zamyka poprzednia. Gdy zamykana lezy **nad**
klikanym naglowkiem, tresc jedzie w gore i przycisk ucieka spod palca.

Zmierzone przesuniecia naglowka: FAQ `[0, -80, -103, -80]` px, tabs-accordion
`[0, -86, -86, -62]` px.

Rozwiazanie (kotwica przewijania w JS, ~30 linii, podpiete w fazie przechwytywania, zero
zmian w istniejacym kodzie akordeonow) sprowadzalo wszystkie wartosci do `0`.

**Status: NIE MA tego w repo.** Zostalo cofniete resetem do commita `236db1a`.
Kod jest do odtworzenia - opis mechanizmu wyzej wystarczy.

---

## 3. Co jest w `amico.css` (bloki na koncu pliku)

Kazdy blok ma komentarz z uzasadnieniem. Kolejnosc od gory:

| linia | blok | co naprawia |
|---|---|---|
| ~9171 | Karta lokalizacji | sztywne 570x600 (relikt webflowowego slidera wielu lokalizacji) wciskalo poziome zdjecie 1344x752 w kadr prawie kwadratowy - `cover` scinal ~47% szerokosci, postac przy krawedzi byla przecieta. Teraz pelna szerokosc + `aspect-ratio` (16/9 -> 3/2 -> 4/3 -> 4/5). Przyciecie spadlo do **0.5%** na desktopie. |
| ~9263 | Czytelnosc naglowka "Poznaj lekarzy" | sekcja ma **zdjecie** jako tlo, nie kolor. Luminancja pod jednym akapitem waha sie **0.015-0.822** - zaden kolor tekstu tego nie naprawi. Blok naglowka dostal polprzezroczysta podkladke; plakietka "Nasz zespol" miala kontrast **1.13:1** (bialy tekst na jasnym suficie) - byla niewidoczna. |
| ~9319 | Ostatni rzad kart zespolu | 5 lekarzy w siatce 3-kolumnowej zostawialo dziure 373x500 w prawym dolnym rogu. Grid -> flex z zawijaniem i `justify-content:center`. Pelne rzedy **co do piksela** jak wczesniej (373/360/466/360/447/380), zmienia sie tylko rzad niepelny. Dotyczy `about.html` i `index.html`. |
| ~9376 | Slider opinii - telefony | rowna wysokosc slajdow (bylo 453/420/453) przez `display:flex` na masce; cel dotykowy kropek z 12x12 px na 28x44 px (WCAG 2.5.8 wymaga min. 24x24). |
| ~9425 | Strzalki slidera | mialy `display:none` - Webflow caly czas podpinal obsluge klikniec. Ustawione w dolnym pasie, po bokach kropek. 48x48 do 768 px, 44x44 nizej (pas ma tam 44 px). Nachodzenie na karte: **0 px^2**. |
| ~9494 | Formularz i stopka na malych ekranach | pola mialy `font-size:15px` -> **Safari na iOS przybliza strone** przy tapnieciu w pole ponizej 16 px; tekst zgody 12 px -> 13 px; mail w stopce wychodzil **6 px za krawedz** przy 320 px; linki kontaktowe 26 px -> 44 px wysokosci; checkbox 16 px -> 22 px. |
| ~9569 | Adres w stopce | dodany `<address>` - trzeci element NAP (nazwa/adres/telefon) dla lokalnego SEO. |
| ~9592 | Menu mobilne | blokada przewijania tla przez `:has()` (Webflow nie blokuje; atrybut `fs-scrolldisable-element="smart-nav"` jest w markupie, ale **skryptu Finsweet nie ma na stronie**); cel dotykowy hamburgera **24x18 -> 44x44 px**; linki menu 36 -> 48 px. |

Zmiany w HTML: adres w stopce (4 pliki) + usuniety zduplikowany krotszy copyright.

---

## 4. Wzorce: komponenty Webflow po wycieciu `webflow.js`

Webflow buduje czesc struktury dopiero w runtime. Po usunieciu bundli trzeba to odtworzyc
w CSS, bo w samym HTML tego nie ma.

- **Menu mobilne:** `webflow.js` tworzy `<div class="w-nav-overlay">` i przenosi do niego
  `.w-nav-menu`. Bez tego `.navbar_menu` (`position:absolute` bez `top`/`left`) pozycjonuje
  sie wzgledem `align-items:center` rodzica i lozy **~380 px nad viewportem**.
  Lek: jawne `top:100%; left:0; right:0`.
- **Haki stanu menu (gdy `webflow.js` JEST obecny):** `.w-nav-button.w--open` na przycisku,
  `data-nav-menu-open` na panelu. Dobre selektory dla `:has()`.
- **Otwieranie w dwoch krokach:** najpierw klasa zmieniajaca `display`, dopiero w nastepnej
  klatce klasa z `transform`/`opacity`. Przejscie prosto z `display:none` sie nie animuje.
- **Elementy pozycjonowane wygrywaja z niepozycjonowanymi** niezaleznie od kolejnosci w DOM.
  Panel `absolute` przykryje `.navbar-button_wrapper` (`static`) i zablokuje klikniecia.
- **Inline style po IX2:** Webflow raz, przy starcie, ustawia inline `opacity:0`, `height:0`,
  `transform`. Inline bije kazda regule CSS - trzeba je wyczyscic z JS na starcie.
- **`.w-slider-arrow-left/right`** ma bazowo `inset:0; margin:auto; width:80px` - samo
  odkrycie `display` rozciaga przycisk przez cala wysokosc slidera na tekscie.

---

## 5. Otwarte watki

1. **Pasek nawigacji nie jest sticky.** `position: absolute`, `z-index: 1000`. Po przewinieciu
   800 px jest **calkowicie poza ekranem**, na kazdej szerokosci. Na `service.html` (11 500 px
   wysokosci) pacjent w polowie strony nie ma jak nawigowac. Uzgodniona decyzja: **sticky
   z tlem pojawiajacym sie po przewinieciu** (IntersectionObserver dokladajacy klase, ~15 linii,
   bez bibliotek). **Nie zaimplementowane.**
2. **Podstrony bloga nie istnieja.** Wszystkie linki artykulow prowadza do `blog.html` - i to
   nie jest zla sciezka, tylko brak plikow. W repo sa wylacznie 4 strony nawigacyjne.
   Uzgodniony kierunek: najpierw **jeden artykul jako wzorzec**, potem reszta. Nie zrobione.
3. **Pola formularza nie maja etykiet.** Tylko `placeholder`, zero `<label>` i `aria-label`.
   Placeholder znika po wpisaniu znaku i bywa pomijany przez czytniki ekranu.
4. **CSS wazy ~264 KB** przy budzecie 60 KB. Martwe reguly po Webflow.
5. **Dane strukturalne (`Dentist`) tylko na `index.html`.** Podstrony ich nie maja.
6. **Brak pulapki fokusu w menu mobilnym.** Przy otwartym menu tresc pod spodem zostaje
   dostepna Tabem. Webflow tego nie robi, CSS nie naprawi.

---

## 6. Jak weryfikowac

Chromium + Playwright, viewporty **320 / 360 / 412 / 480 / 767 / 991 / 1200 / 1440**.
Mierz, nie ogladaj: `getBoundingClientRect`, `getComputedStyle`, `elementFromPoint`
(czy element jest **naprawde** klikalny, a nie przykryty), `document.documentElement.scrollWidth`
kontra `clientWidth` (poziomy scroll), kontrast liczony z **pikseli zrzutu** gdy tlem jest zdjecie.

Uwaga na artefakty testowe: `locator.click()` w Playwright sam przewija element do widoku -
przy pasku nawigacji na `position:absolute` zeruje to `scrollY` i wyglada jak blad strony.
