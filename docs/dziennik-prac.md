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
| ~9660 | Pasek nawigacji przyklejony | `position:absolute` -> **`fixed`**. `sticky` odpadl pomiarem: wraca do flow i spycha hero o **69 px** (h1 ze 104 na 173 px), a hero ma `padding-top:420px` wlasnie pod nachodzacy pasek. Tlo `primary-700` (#022f34) dopiero po przewinieciu, klasa `.is-scrolled` z IntersectionObservera. Kontrast linkow **13.32:1**, hamburgera i tekstu CTA **14.4:1**. Menu mobilne: overlay przyciety z **12 921 px** do wysokosci ekranu, panel siega dokladnie dolu (szczelina **0 px** na 10 viewportach). |
| (HTML) | Skip link faktycznie pomija nawigacje | `<main>` dostal `tabindex="-1"` w **7 plikach** (tez privacy/terms/cookies - maja ten sam skip link). Na stronach prawnych to wystarczylo, na nawigacyjnych **nie**: `webflow.js` przechwytuje kotwice i przewija sam, wiec fokus zostawal na skip linku, a kolejny Tab **wracal do nawigacji**. Dolozone jawne `main.focus({preventScroll:true})`. Zmierzone na 7 stronach: fokus `MAIN#main`, nastepny Tab wchodzi w tresc. |
| (HTML) | Pulapka fokusu w menu mobilnym | Po czterech linkach Tab wychodzil w tresc **pod** nieprzezroczystym panelem (formularz, stopka, karty lekarzy) - fokus na kontrolkach, ktorych nie widac. Rozwiazane przez `inert` na wszystkim poza `.navbar_wrap`, przelaczane MutationObserverem na klasie `.w--open`. Potwierdzone przez CDP: `<main>` ma `ignored=true, powod=inertElement`, wiec czytniki ekranu tez pomijaja tresc. Dolozony Escape na poziomie dokumentu dla przypadku, gdy fokus jest na `<body>`. |
| ~9770 | Etykiety w formularzu kontaktowym | Pola miaBy tylko `placeholder`. Dodane widoczne `<label>` z `for`/`id` + `autocomplete="name"/"tel"`; placeholdery usuniete jako dublujace. Etykieta i pole owiniete w `.lead-form_field` (wlasny gap 6px), bo `.lead-form` ma `gap:11px` i luzna etykieta wisialaby w rownej odleglosci od dwoch pol. Sprawdzone przez CDP: nazwa dostepna pochodzi z `relatedElement`, nie z placeholdera. Kontrast **17.19:1**. Karta rosnie o ~46 px (467 -> 513 przy 320 px), hero ma na to zapas. |
| ~9808 | Identyfikacja bledu w formularzu | `aria-invalid` na blednym polu + `aria-describedby` wiazace je z komunikatem + przeniesienie fokusu (WCAG 3.3.1). Znacznik znika przy pierwszym znaku w polu. Czerwona ramka `#c0392b` w tym samym kolorze co komunikat, kontrast **5.44:1** (WCAG 1.4.11 wymaga 3:1 dla elementow nietekstowych). Osobna regula na `:focus`, bo `.lead-form_input:focus` przestawia ramke na primary-500 - pole gubiloby czerwien dokladnie w chwili, gdy leci na nie fokus. |
| (HTML) | Dane strukturalne `Dentist` na podstronach | Blok dodany na `about.html` i `blog.html` - skopiowany bajt w bajt z `index.html`, zero nowych danych o firmie. Wszystkie cztery bloki dostaly wspolne `"@id": "https://amicodental.pl/#dentist"`, zeby wyszukiwarki widzialy **jeden podmiot**, a nie cztery gabinety pod tym samym adresem. `url` ujednolicony do strony glownej (wczesniej `service.html` podawal sam siebie jako adres firmy). |
| (HTML) | Numer GSM w stopce | Stopki **wszystkich czterech stron byly identyczne** i zadna nie miala GSM - numer wisial tylko w sekcji kontaktowej na `index.html`. Dodany link `tel:+48512570035` do `.footer-contact_wrap` w czterech plikach. Bez etykiety ("GSM:"), bo przy 359 px dziala juz regula ratunkowa `overflow-wrap:anywhere` i dluzszy tekst zwiekszalby ryzyko lamania. Zmierzone na 320-1440: cel dotykowy 44 px, zero przepelnien. Domyka spojnosc NAP - oba numery ze schematu sa teraz widoczne na kazdej stronie. |
| (CSS) | Odchudzanie, partia 1 | Wyciete 168 regul / 119 klas nieuzywanych komponentow Webflow (lightbox, wideo, formularze `w-form`, richtext, embed, stary layout `w-row`/`w-col`/`w-container`). **269,0 -> 252,4 KB (-16,6 KB)** na dysku. Po gzipie, czyli tyle ile realnie pobiera przegladarka: **38,6 -> 35,6 KB (-3,0 KB)** - martwe reguly swietnie sie kompresuja, wiec zysk sieciowy jest duzo mniejszy niz zysk w pliku i tak trzeba go raportowac. Weryfikacja: 80 odciskow stylow i geometrii, 33 732 elementy, **zero roznic**. Cieta parserem `css-tree` po strukturze, nie regexem; wycinana jest cala regula tylko wtedy, gdy KAZDY jej selektor jest martwy z powodu klasy z tej partii. |

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
- **Webflow sam ustawia poprawne ARIA na hamburgerze**: `role="button"`, `tabindex="0"`,
  `aria-label`, `aria-controls`, `aria-haspopup` i przelaczane `aria-expanded`. Nie trzeba
  tego dopisywac - wystarczy nie zepsuc. Klasa `.w--open` na przycisku to najpewniejszy
  hak stanu menu (uzywaja jej juz i CSS, i pulapka fokusu).
- **Obsluga Escape w Webflow jest podpieta do nawigacji, nie do dokumentu.** Gdy fokus
  wypadnie poza nawigacje, Escape przestaje zamykac menu.
- **`webflow.js` przechwytuje linki-kotwice** (`href="#cos"`): robi `preventDefault`
  i przewija wlasnym kodem. Skutek uboczny: przegladarka **nie przenosi fokusu** do celu,
  wiec sam `tabindex="-1"` na celu nie naprawia skip linku. Trzeba wolac `.focus()` recznie.
  Widac to tylko na stronach z webflow.js - na statycznych stronach prawnych dziala natywnie.
- **`top:100%` liczy sie od PADDING BOXA rodzica, nie border boxa.** Pasek ma
  `border-bottom:1px`, wiec overlay menu (`top:100%`) startowal 1 px wyzej, niz wynika
  z `height`. Stad druga zmienna `--navbar-inner-h` (`nav.clientHeight`) - bez niej panel
  konczyl sie 1 px nad dolna krawedzia ekranu.
- **Webflow ustawia `.w-nav-overlay` inline `height` rowne wysokosci CALEGO dokumentu**
  (~12 900 px). Przy pasku `absolute` bylo to niegrozne; przy `fixed` overlay jest
  zakotwiczony w viewporcie i rozciaga sie daleko pod ekran. Inline bije regule - `!important`.
- **`.w-slider-arrow-left/right`** ma bazowo `inset:0; margin:auto; width:80px` - samo
  odkrycie `display` rozciaga przycisk przez cala wysokosc slidera na tekscie.

---

## 5. Otwarte watki

1. ~~**Pasek nawigacji nie jest sticky.**~~ **ZROBIONE 2026-08-20.** Wdrozone jako
   `position:fixed` (nie `sticky` - patrz tabela), z tlem po przewinieciu. Przy okazji
   wyszlo, ze pasek ma `height:auto`, wiec przy **768-991 px mierzy 67 px, a nie 69**;
   wysokosc jest teraz mierzona w JS i publikowana jako `--navbar-h` / `--navbar-inner-h`,
   zamiast stalych zgadywanych per breakpoint.
2. **Podstrony bloga nie istnieja.** Wszystkie linki artykulow prowadza do `blog.html` - i to
   nie jest zla sciezka, tylko brak plikow. W repo sa wylacznie 4 strony nawigacyjne.
   Uzgodniony kierunek: najpierw **jeden artykul jako wzorzec**, potem reszta. Nie zrobione.
3. ~~**Pola formularza nie maja etykiet.**~~ **ZROBIONE 2026-08-21.** Widoczne etykiety
   zamiast placeholderow. Formularz jest **tylko na `index.html`** - podstrony go nie maja.
   Domkniete tego samego dnia: bledne pole dostaje `aria-invalid`, jest wiazane
   z komunikatem przez `aria-describedby` i przejmuje fokus.

   Przy okazji poprawiony komunikat: przy samym brakujacym telefonie mowil
   "Uzupelnij imie i numer telefonu", mimo ze imie bylo wypelnione. Dopoki byl to
   tylko tekst pod przyciskiem, bylo to niescisle; po podpieciu `aria-describedby`
   staloby sie **opisem pola telefonu** czytanym przez czytnik ekranu. Teraz sa trzy
   warianty, dobierane do tego, czego faktycznie brakuje.
4. **CSS wazy 175,5 KB** przy budzecie 60 KB. Partia 1 zdjela 16,6 KB (komponenty Webflow),
   partia 2 kolejne **76,9 KB**: wlasne klasy szablonu, czyli strony, ktorych ten serwis
   nie ma - `sales-page_*`, `utilities-*`, `job-*`, `awards-*`, `team-*`, `marquee_*`,
   `legal-aside_*`. 425 regul, 244 klasy. Po gzipie 36,4 -> 29,8 KB.

   Zostalo **16,4 KB regul w calosci martwych** i nie jest to juz jeden duzy kes:
   7,9 KB komponenty Webflow (`w-*`), 4,3 KB reguly zablokowane guardem, 4,0 KB odlozona
   nawigacja, 0,2 KB chronione `w-mod-*`. Budzet 60 KB liczony po dysku jest dla tego
   arkusza nieosiagalny - nawet po wycieciu wszystkiego martwego zostaje ~159 KB.
   Sensownym celem jest gzip, bo to on leci po sieci.

   **Guard "wszystkie klasy w regule martwe" zostaje**, mimo ze kosztuje 4,3 KB
   niewycietych regul typu `.martwa .zywa` (takie faktycznie nie maja szans dopasowania).
   To wlasnie ten guard obronil `.lead-form_status.is-info` - patrz akapit nizej.
   Tanszy blad to zostawic 4 KB niz wyciac dzialajaca regule.

   **Nawigacja odlozona swiadomie:** `navbar-dropdown_*`, `navbar_dropdown`, `dropdown_*`
   wygladaja rownie martwo co reszta, ale pasek to najdelikatniejszy element serwisu
   (fixed, pulapka fokusu, menu mobilne). Idzie osobna partia, zeby przy ewentualnej
   regresji bylo wiadomo, ktore ciecie ja spowodowalo.

   **Nie ruszac bez namyslu:** `w-mod-touch` wyglada na martwa, bo headless Chromium nie
   jest urzadzeniem dotykowym - a regula `html.w-mod-touch * { background-attachment:
   scroll !important }` to realna poprawka pod iOS. Tak samo `w-mod-js/ix/ix3` i klasy CMS.

   **`is-info` - druga pulapka tego samego rodzaju, znaleziona w partii 2.** Inwentarz
   uznal ta klase za martwa, bo runtime jej nie widzi. `index.html` sklada nazwe
   dynamicznie: `className = 'lead-form_status' + (type ? ' is-' + type : '')`, a
   `type='info'` pojawia sie dopiero w trakcie wysylki formularza - stanu, do ktorego
   przebieg inwentarza nigdy nie dochodzi (walidacja konczy sie wczesniej, backendu nie
   ma). Regula `.lead-form_status.is-info` jest nasza i dziala.
   **Wniosek: przy skanowaniu inline JS nie wystarcza literaly `classList.add('x')` -
   trzeba szukac tez nazw SKLADANYCH ze stringow.**

   **Sprostowanie do "szumu zrzutow ekranu" z poprzedniej wersji tego punktu.** Bylo
   napisane, ze szumia piksele, a odciski stylow i geometrii sa stabilne i to one
   rozstrzygaja. Nieprawda: odciski tez potrafily. Pierwsze porownanie partii 2 pokazalo
   256 roznic na `index_320` - a te same 256 roznic wyszlo miedzy dwoma przebiegami na
   NIEZMIENIONYM CSS. Blad byl w harnessie, nie na stronie; opis i poprawka w sekcji 6.
5. ~~**Dane strukturalne (`Dentist`) tylko na `index.html`.**~~ **ZROBIONE 2026-08-21.**
   Sprostowanie: ten wpis byl niescisly - `service.html` mial `Dentist` (plus `FAQPage`)
   juz wczesniej. Brakowalo na `about.html` i `blog.html`; obie strony maja go teraz,
   a cala czworka jest spieta wspolnym `@id`.

   Numer GSM byl wtedy w schemacie, ale w widocznej tresci tylko na `index.html`.
   **Domkniete tego samego dnia** - dodany do stopki na wszystkich czterech stronach.
6. ~~**Brak pulapki fokusu w menu mobilnym.**~~ **ZROBIONE 2026-08-21.** `inert` na
   wszystkim poza paskiem. Przy okazji sprostowanie do sekcji 4: Escape **nie** zamykal
   menu "zawsze" - Webflow wiesza obsluge na nawigacji, wiec dzialal tylko dopoki fokus
   nie uciekl w tresc. Po zalozeniu pulapki uciec juz nie moze, a dodatkowy nasluch
   domyka przypadek fokusu na `<body>`.

---

## 6. Jak weryfikowac

Chromium + Playwright, viewporty **320 / 360 / 412 / 480 / 767 / 991 / 1200 / 1440**.
Mierz, nie ogladaj: `getBoundingClientRect`, `getComputedStyle`, `elementFromPoint`
(czy element jest **naprawde** klikalny, a nie przykryty), `document.documentElement.scrollWidth`
kontra `clientWidth` (poziomy scroll), kontrast liczony z **pikseli zrzutu** gdy tlem jest zdjecie.

**`ariaSnapshot()` Playwrighta nie modeluje `inert`** - pokazuje tresc, ktora dla
przegladarki jest juz poza drzewem dostepnosci. Do sprawdzenia `inert` uzywaj CDP:
`Accessibility.getPartialAXTree` zwraca `ignored:true` z `ignoredReasons: inertElement`.

**IntersectionObserver nie zadziala w karcie, ktora nie kompozytuje klatek.** Panel
przegladarki schowany => `document.visibilityState==="hidden"`, `requestAnimationFrame`
nie strzela ani razu, IO nigdy nie wola callbacka - i `.is-scrolled` "nie dziala", mimo ze
kod jest poprawny. Zanim uznasz to za blad strony, sprawdz `visibilityState` i licznik rAF.
Pomiary rob w Playwrighcie (renderuje naprawde), nie w schowanym panelu.

Uwaga na artefakty testowe: `locator.click()` w Playwright sam przewija element do widoku -
przy pasku nawigacji na `position:absolute` zeruje to `scrollY` i wyglada jak blad strony.

**Krok przewijania przy stabilizacji MUSI byc mniejszy niz okno.** Harness odciskow szedl
skokiem `scrollHeight/10`. Na najdluzszej stronie (`index` @320 px, ~12 900 px) to skok
~1290 px przy oknie 900 px - czesc elementow nigdy nie trafiala do viewportu, ich reveal
(IntersectionObserver + ScrollTrigger) nie ruszal i zostawaly na `opacity:0`. Efekt byl
**bistabilny**: ten sam, niezmieniony CSS dawal raz komplet reveali, raz 28 elementow
nieodslonietych - czyli 256 roznic w porownaniu, wszystkie na `index_320`, wszystkie na
`opacity`/`transform` i wynikajacych z nich przesunieciach. Wyglada to dokladnie jak
regresja po wycieciu CSS.

Poprawka: krok = pol wysokosci okna, wysokosc dokumentu czytana w kazdej iteracji (strona
rosnie w miare odslaniania), na koncu zjazd na sam dol i powrot na gore. Do indeksu doszedl
licznik elementow z `opacity < 0.99`; jego rozjazd miedzy przebiegami zdradza niestabilnosc
POMIARU, zanim zdazysz obwinic CSS.

**Jak rozstrzygac takie przypadki:** nie zgaduj, czy to szum. Zrob przebieg kontrolny na
NIEZMIENIONYM kodzie i porownaj go z poprzednim. Jesli te same roznice wychodza przy tym
samym CSS, wina jest po stronie harnessu. W partii 2: `stary3` vs `stary4` (ten sam stary
CSS) = 0 roznic, `stary3` vs `nowy3` (przed vs po wycieciu 76,9 KB) = 0 roznic. Dopiero to
jest dowod, a nie pojedynczy zielony przebieg.
