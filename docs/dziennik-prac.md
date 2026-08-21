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
2. ~~**Podstrony bloga nie istnieja.**~~ **ZROBIONE 2026-08-21. Wszystkie szesc wpisow
   ma swoje strony**, a na `blog.html` nie ma juz ani jednego kafla prowadzacego sam do
   siebie.

   | plik | obraz | slow |
   |---|---|---|
   | `blog/jak-prawidlowo-szczotkowac-zeby.html` | 4 | 954 |
   | `blog/mity-o-zebach.html` | 6 | 857 |
   | `blog/nic-dentystyczna.html` | 5 | 728 |
   | `blog/produkty-szkodzace-zebom.html` | 3 | 616 |
   | `blog/wybielanie-zebow.html` | 2 | 782 |
   | `blog/codzienne-nawyki-dla-zebow.html` | 1 | 664 |

   **Konwencja:** `blog/<slug>.html`, zasoby przez `../assets/...`. Uklad: ciemny pas
   naglowka (okruszki, kicker, H1, lead, metadane) -> obraz wiodacy -> ramka "W skrocie"
   -> spis tresci z kotwicami -> tresc H2/H3 -> tabela -> FAQ -> zastrzezenie -> CTA ->
   powiazane wpisy. Dane strukturalne: `BlogPosting` + `BreadcrumbList` + `FAQPage`
   w jednym `@graph`, spiete z wezlem `Dentist` przez `@id`.

   **STRONY SA GENEROWANE, NIE KOPIOWANE.** Pierwszy wpis powstal recznie; przy szesciu
   to przestaje miec sens, bo kazda kopia to szansa na cichy rozjazd. Generator
   (`generator.js` w scratchpadzie) sklada z jednego zrodla: `<head>` z meta i JSON-LD,
   okruszki, metadane, CTA, zastrzezenie, "przeczytaj takze" - a takze dwie rzeczy,
   ktore wczesniej trzeba bylo pilnowac recznie:
   - **spis tresci powstaje WPROST z naglowkow `<h2 id>` w tresci**, wiec kotwica nie moze
     rozjechac sie z linkiem,
   - **FAQ widoczne i blok `FAQPage` pochodza z tej samej tablicy**, wiec czytelnik
     i wyszukiwarka zawsze widza identyczne pytania. Sonda i tak porownuje jedno z drugim.

   Tresc merytoryczna kazdego wpisu siedzi osobno w `tresc/<slug>.html` i sklada sie
   wylacznie z sekcji `<section aria-labelledby>` z `<h2 id>`.

   **DLACZEGO NAGLOWEK JEST CIEMNY.** `.navbar_wrap` jest przezroczysty do pierwszego
   przewiniecia, linki maja kolor #f3f6ff, logo jest w wariancie jasnym - pasek
   zaprojektowano pod ciemne hero. Na bialej stronie artykulu nawigacja bylaby bialym
   tekstem na bialym tle.

   **ARTYKULY NIE LADUJA jQuery, WEBFLOW ANI GSAP.** Strony nawigacyjne ciagna 714 KB JS
   (179 KB po gzipie). Artykul to sam tekst; menu obsluguje ~45 linii wlasnego skryptu,
   odtwarzajacego dokladnie te zmiany w DOM, na ktorych opiera sie CSS: `.w--open` na
   przycisku, `.w-nav-overlay` w `.navbar_wrap`, `data-nav-menu-open` na `<nav>`. Skrypty
   wspoldzielone (pasek `.is-scrolled`, pulapka fokusu, oslona obrazkow) sa wyjmowane
   z `blog.html` programowo przy kazdym generowaniu.

   Efekt uboczny na plus: bez `webflow.js` nie ma przechwytywania kotwic, wiec skip link
   i spis tresci przenosza fokus natywnie. Skok ze spisu tresci nie chowa naglowka pod
   paskiem, bo `html` ma juz `scroll-padding-top: calc(var(--navbar-h) + 8px)` z prac nad
   przyklejonym paskiem - zmierzone: naglowek laduje 8 px pod dolna krawedzia paska.

   **Hamburger to `<button>`, nie `<div role="button">`** - bez webflow.js nikt nie dokłada
   ARIA ani obslugi klawiatury. Pulapka, ktora to kosztowalo: przegladarka nadaje
   `<button>` wlasne tlo `rgb(240, 240, 240)`, czyli jasny prostokat 24x18 px na ciemnym
   pasku. Geometria byla identyczna jak w `<div>`, wiec porownanie pudelek tego NIE
   pokazalo - wyszlo przy liczeniu kontrastu, gdy tlem okazal sie sam przycisk.

   **DWA BLEDY Z DRUGIEJ PARTII, WARTE ZAPAMIETANIA:**

   *Podpinanie linkow "od tytulu w tyl" zjada sasiada.* Pierwsza wersja skryptu szukala
   najblizszego POPRZEDZAJACEGO `<a href="blog.html">`. Kafel o szczotkowaniu byl juz
   podpiety z poprzedniej sesji, wiec wyszukiwanie przeskoczylo na kafel wyzej i kafel
   "Prawda o nici dentystycznej" dostal adres artykulu o szczotkowaniu - a licznik
   "kafli prowadzacych do blog.html: 0" pokazywal sukces. Poprawka: dopasowywac CALY
   kafel jednym wyrazeniem i ustawiac href na podstawie tytulu, ktory ten kafel zawiera.
   Skrypt jest wtedy idempotentny. **Wniosek: przy podmianie linkow sprawdzaj mapowanie
   kafel -> adres, a nie liczbe pozostalych starych linkow.**

   *Obraz i alt nie zgadzaly sie z kaflem.* Pierwszy artykul dostal `gen_blog-image-1`
   z opisem "szczoteczka i pasta na blacie", podczas gdy zdjecie 1 przedstawia szczoteczke,
   nic i model szczeki - i nalezy do kafla "5 codziennych nawykow". Kazdy wpis ma teraz
   obraz swojego kafla i alt przepisany z `blog.html`, wiec klikniecie kafla prowadzi na
   strone z tym samym zdjeciem.

   **DATY PUBLIKACJI - USTALONE 2026-08-21: zostaja takie, jakie sa.** Wszystkie szesc
   wpisow powstalo i trafilo na produkcje tego samego dnia, wiec `datePublished` mowi
   prawde. Rozwazane bylo rozlozenie dat wstecz, zeby blog wygladal na prowadzony od
   miesiecy - odrzucone swiadomie: `datePublished` to deklaracja faktu dla wyszukiwarek,
   a te daty byłyby nieprawdziwe. Kolejne wpisy dostana swoje realne daty i historia
   zrobi sie sama.

   **TODO: CLIENT CONFIRMATION - podpis autora.** Do potwierdzenia, czy wpisy podpisuje
   konkretny lekarz (imie, nazwisko, tytul zawodowy), czy zbiorczo "Zespol Amico Dental".
   Dotyczy tresci widocznej i pola `author` w danych strukturalnych, na wszystkich szesciu
   wpisach naraz. Po decyzji: jedna zmiana w generatorze i przegenerowanie kompletu.
   Komentarz `TODO` w plikach HTML nadal wymienia takze date - zostanie poprawiony przy
   tej samej okazji, zeby nie robic commita na sam komentarz.

   **WAZNIEJSZE NIZ PODPIS: tresc nie byla czytana przez nikogo z gabinetu.** Szesc
   artykulow o tematyce zdrowotnej jest na produkcji firmowanych nazwiskiem praktyki.
   Napisane sa na ogolnej, sprawdzonej wiedzy, bez obietnic efektu i bez informacji
   o gabinecie spoza tych, ktore juz byly w serwisie - ale zalecenie kliniczne pod
   szyldem praktyki stomatologicznej powinno przejsc przez osobe z uprawnieniami.
   Najbardziej dotyczy to wpisu o wybielaniu oraz fragmentow o zebach mlecznych
   w "Mitach o zebach". Do zrobienia niezaleznie od tego, jaki podpis zostanie wybrany.

   **Jak dodac siodmy wpis:** dopisac obiekt do tablicy `WPISY` w generatorze, dorzucic
   `tresc/<slug>.html` z sekcjami, uruchomic generator, potem skrypt podpinajacy linki
   i sitemap, na koniec sonde `artykuly.js`. Chrome nie dotykac - przenosi sie sam.
3. ~~**Pola formularza nie maja etykiet.**~~ **ZROBIONE 2026-08-21.** Widoczne etykiety
   zamiast placeholderow. Formularz jest **tylko na `index.html`** - podstrony go nie maja.
   Domkniete tego samego dnia: bledne pole dostaje `aria-invalid`, jest wiazane
   z komunikatem przez `aria-describedby` i przejmuje fokus.

   Przy okazji poprawiony komunikat: przy samym brakujacym telefonie mowil
   "Uzupelnij imie i numer telefonu", mimo ze imie bylo wypelnione. Dopoki byl to
   tylko tekst pod przyciskiem, bylo to niescisle; po podpieciu `aria-describedby`
   staloby sie **opisem pola telefonu** czytanym przez czytnik ekranu. Teraz sa trzy
   warianty, dobierane do tego, czego faktycznie brakuje.
4. **CSS wazy 163,1 KB** przy budzecie 60 KB. Cztery partie:

   | partia | zakres | zdjete |
   |---|---|---|
   | 1 | komponenty Webflow bez zastosowania (lightbox, wideo, formularze, layout) | 16,6 KB |
   | 2 | wlasne klasy szablonu (`sales-page_*`, `utilities-*`, `job-*`, `team-*`...) | 76,9 KB |
   | 3 | nawigacja i rozwijane menu | 5,2 KB |
   | 4 | pozostale komponenty Webflow (widgety, helpery, ikony, slider-nav-invert) | 7,2 KB |

   Razem **105,9 KB**: z 269,0 do 163,1 KB (-39%). Po gzipie 38,6 -> 28,1 KB (-27%).

   **To jest podloga tej metody.** Zostalo 4,5 KB regul w calosci martwych i zadnej z nich
   nie da sie ruszyc bez zmiany zasad: 4,3 KB blokuje guard (reguly typu `.martwa .zywa`),
   0,2 KB to swiadomie chronione `w-mod-*` i klasy CMS. Wszystkie kubelki "do kolejnej
   partii" sa puste. Dalsze odchudzanie wymagaloby juz nie usuwania martwych regul, tylko
   ruszania zywych - czyli refaktoru stylow, a nie sprzatania po szablonie.

   Budzet 60 KB liczony po dysku jest dla tego arkusza nieosiagalny: po wycieciu wszystkiego
   martwego zostaje ~159 KB zywych regul Webflow. Sensownym celem jest gzip, bo to on leci
   po sieci - i tam jestesmy na 28,1 KB.

   **Uwaga przy porownywaniu rozmiarow:** na dysku plik ma CRLF, a git normalizuje konce
   linii do LF. Blob w repo i plik serwowany przez Pages sa wiec o tyle bajtow mniejsze,
   ile plik ma linii (przy 163,1 KB to ok. 5,3 KB roznicy). To nie jest zaden ubytek tresci.

   **Guard "wszystkie klasy w regule martwe" zostaje**, mimo ze kosztuje 4,3 KB
   niewycietych regul typu `.martwa .zywa` (takie faktycznie nie maja szans dopasowania).
   To wlasnie ten guard obronil `.lead-form_status.is-info` - patrz akapit nizej.
   Tanszy blad to zostawic 4 KB niz wyciac dzialajaca regule.

   **Partia 3 (nawigacja) - ZROBIONA 2026-08-21.** Wyciete: wlasne klasy podmenu
   (`navbar-dropdown_*`, `navbar_dropdown`, `dropdown_*`), komponent dropdown Webflow
   (`w-dropdown*`, `w-icon-dropdown-toggle`) oraz martwe czesci komponentu nawigacji
   (`w-nav-link`, `w-icon-nav-menu` - serwis uzywa wlasnego `navbar_link` i wlasnych paskow
   hamburgera). `w-slider-nav-invert` **nie** wchodzil do tej partii mimo "nav" w nazwie:
   to nawigacja slidera, nie paska. Zywe klasy paska (`navbar_wrap`, `navbar_menu`,
   `navbar_link`, `navbar-toggler-button`, `w-nav`, `w-nav-menu`, `w-nav-button`,
   `w-nav-brand`, `w-nav-overlay`, `skip-link`) sa nietkniete - kosiarka ma twarda polise:
   jesli po cieciu ktorakolwiek z nich znika z arkusza, plik w ogole nie zostaje zapisany.

   **Partia 4 (komponenty Webflow) - ZROBIONA 2026-08-21.** clearfix, `w-button`,
   `w-code-block`, `w-legacy-badge`, ikony file-upload, helpery `w-hidden-*`, widget mapy,
   widget Twittera, `w-ix-emptyfix` oraz - z okolic slidera - `w-slider-nav-invert`
   i glify `w-icon-slider-left/right`. **Slider opinii dziala i jest uzywany**, wiec jego
   zywe klasy (`w-slider`, `w-slider-mask`, `w-slider-nav`, `w-slider-arrow-left/right`,
   `w-slide`, `w-round`) nie byly nawet kandydatami; ta sama polisa co w partii 3 pilnowala
   18 klas komponentow, ktore ta strona realnie ma.

   **Klasa, ktorej JS SZUKA, to nie to samo, co klasa, ktora JS DOKLADA.** Dwie nazwy
   z partii 4 wystepuja w `webflow.js`: `w-nav-link` i `w-icon-dropdown-toggle` - ale
   w obu przypadkach jako selektory (`.find(".w-nav-link")`), czyli miejsca, gdzie skrypt
   szuka elementow. W markupie ich nie ma, wiec selektor trafia w pustke i CSS jest
   niepotrzebny. Gdyby JS te klasy DOKLADAL, zobaczylby je przebieg inwentarza w DOM.
   Rozroznienie warto robic za kazdym razem, bo goly grep po plikach JS tego nie widzi.

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

**Odciski mierza STANY, nie DZIALANIE.** Przy partii nawigacyjnej to za malo: odcisk pokaze,
ze otwarte menu ma te sama geometrie, ale nie sprawdzi, czy klikniecie je otwiera, czy fokus
jest uwieziony, czy Escape zamyka i czy link da sie kliknac, a nie jest przykryty. Stad
osobna sonda (`nawigacja.js`): 4 strony x 2 szerokosci, a w kazdej kombinacji pasek
w spoczynku i po przewinieciu, `elementFromPoint` na kazdym linku, otwarcie menu
(geometria panelu, `aria-expanded`, `w--open`, `inert` na `<main>`), 12 x Tab z kontrola,
czy fokus nie wyszedl poza nawigacje, Escape i skip link. Sonda tez dostaje pare kontrolna.

Dwa artefakty tej sondy, warte zapamietania, bo oba wygladaly jak bledy strony:
- **Fokus trzeba zresetowac przed testem skip linku.** Po zabawie z menu fokus zostaje na
  hamburgerze, wiec kolejny Tab trafia w NASTEPNY element, a nie w pierwszy. Sonda
  "wykrywala" brak skip linku przy 390 px, choc dzialal. Lek: przeladowanie strony
  przed pomiarem, a nie samo przewiniecie na gore.
- **Fokus na `<body>` po ostatnim elemencie nawigacji to NIE wyciek z pulapki**, tylko
  udokumentowany stan domykany osobnym nasluchem. Wyciekiem byloby dopiero trafienie
  w tresc pod `inert`.

**Pomiar nie zastepuje zrzutu ekranu - i odwrotnie.** Przy pierwszej wersji strony artykulu
WSZYSTKIE sondy byly zielone: zero poziomego scrolla na 320/390/768/1440, zero bledow
konsoli, poprawna hierarchia naglowkow, kontrast tekstu powyzej AA, kotwice spisu tresci
na miejscu, pasek nawigacji mierzacy sie identycznie jak na `blog.html`. Zrzut ekranu
pokazal uklad ewidentnie zepsuty: okruszki wysrodkowane, a kicker, H1, lead i metadane
przyklejone do lewej krawedzi okna.

Przyczyna byla czysto CSS-owa: wspolna regula szerokosci dawala `margin-inline: auto`,
a pozniejsze reguly poszczegolnych elementow ustawialy `margin: 0 0 20px` - skrot `margin`
zeruje rowniez `margin-inline`, wiec kasowal wysrodkowanie. Okruszki przezyly tylko dlatego,
ze marginesu nie mial sam `<nav>`, tylko `<ol>` w srodku.

Dwa wnioski:
- **Do nowej strony (bez "wersji przed") dorzuc pomiar SPOJNOSCI, nie tylko poprawnosci.**
  Tutaj wystarczylo porownac lewe krawedzie elementow kolumny tekstu - po poprawce wszystkie
  daja `340 .. 1100` przy 1440 px i `20 .. 370` przy 390 px. Sonda, ktora sprawdza tylko
  "czy cos jest zle same w sobie", takiego rozjazdu nie widzi.
- **Uwazaj na skroty CSS przy wzorcu `width` + `margin-inline: auto`.** `margin: 0 0 20px`
  w pozniejszej regule cicho wylacza wysrodkowanie. Bezpieczniej `margin-block` albo
  jawne `margin: 0 auto 20px`.
---

## 7. Impeccable jako zestaw regul (2026-08-21)

Przyjety jako glowny zestaw regul do audytow i szlifowania interfejsu.
Zrodlo: `github.com/pbakaus/impeccable`, skill w wersji 4.1.1.

### Co jest zainstalowane

`.claude/skills/impeccable/` (152 pliki, 3,6 MB) + czterej agenci `.claude/agents/impeccable-*.md`.
Skopiowane z klona repo, nie przez `npx impeccable install`.

**`.claude/` jest w `.gitignore`** i celowo nie wchodzi do repozytorium: to narzedzie
deweloperskie, a repo jest jednoczesnie zrodlem deployu Pages. Kto pracuje nad projektem,
instaluje je u siebie.

**`.claude/settings.json` NIE zostal skopiowany.** Zawiera hooki `PostToolUse`
(po kazdym Edit/Write/MultiEdit) i `Stop` (na koniec kazdej tury), ktore uruchamiaja
`node hook.mjs`. To automatyczne wykonywanie kodu przy kazdej edycji pliku - do wlaczenia
osobna, swiadoma decyzja.

### Detektor chodzi w trybie DEGRADED - i to trzeba pamietac

Wbudowany `detect.mjs` sam wypisuje ostrzezenie:

> HTML parser modules unavailable (htmlparser2, css-select, css-tree, domutils).
> Falling back to regex matching. (...) findings are an undercount, not a clean bill of health.

Czyli **jego "0 anti-patterns found" NIE jest zaliczeniem**. Brakuje czterech paczek npm.
Skan URL-i (najsilniejszy tryb, na wyrenderowanym DOM) wymaga dodatkowo `puppeteer`.
Dopoki tego nie ma, wynik detektora traktujemy jako dolne oszacowanie.

Obejscie zastosowane w tej sesji: mierzalne reguly Impeccable zaimplementowane w naszym
harnessie (`impeccable-recznie.js`), z progami wzietymi wprost z ich rejestru
(`scripts/detector/registry/antipatterns.mjs`, 59 regul z ID i opisami).

### Podzial pracy: Impeccable mowi CO, nasz harness mowi CZY

To nie sa konkurencyjne narzedzia. `SKILL.src.md` Impeccable zaleca "bounded passes,
not a loop" - zbuduj, obejrzyj raz, popraw hurtem, koniec - i nazywa otwarte self-QA
nieefektywnym. Nasza metoda jest odwrotna i zostaje bez zmian, bo w tym projekcie
wylapala trzy realne bledy, ktorych pojedynczy przeglad by nie zlapal (bistabilny harness,
tlo `<button>`, kafel podpiety pod zly artykul).

Ustalenie: **z Impeccable bierzemy reguly, slownictwo i strukture raportu; weryfikacja
zostaje nasza** - para kontrolna na niezmienionym kodzie plus porownanie odciskow.

### Co znalazl przy pierwszym audycie (podstrony bloga)

Dwa realne naruszenia `low-contrast`, oba ponizej progu WCAG AA 4,5:1 dla malego tekstu:

| element | bylo | jest |
|---|---|---|
| kicker `.article-kicker` (13 px) na `primary-900` | `primary-400` #587d81 = **3,82:1** | `primary-500` #24a3b1 = **5,69:1** |
| `.article-related_item-cta` (15 px) na bialym | `primary-600` #1c91a1 = **3,74:1** | `primary-700` #022f34 = **14,4:1** |

Ten sam kolor dostaly linki w tresci (`.article-body a`) - dzis ich tam nie ma, ale
pierwszy dodany inline mialby identyczny problem.

**Dlaczego nasze sondy tego nie zlapaly:** sprawdzaly kontrast WYBRANYCH elementow
(tresc, lead, metadane, okruszki). Impeccable kaze zmierzyc KAZDY element tekstowy.
To jest konkretna wartosc, ktora wnosi, i tak juz zostaje w sondzie.

Jeden falszywy alarm - `nested-cards` na `.article-cta_button`. To moja uproszczona
implementacja reguly zliczyla przycisk (radius 999 px, wlasne tlo) wewnatrz karty CTA.
Przycisk w karcie to nie karta w karcie.

Advisory na wszystkich szesciu wpisach: `em-dash-overuse`, od 18 do 31 myslnikow na wpis.
Regula jest advisory, bo ludzie tez uzywaja myslnikow - ale przy tej gestosci to sygnatura
tekstu generowanego. Do przejscia redakcyjnego.

### Przy okazji: repo bylo serwowane publicznie w calosci

Sprawdzajac, co sie stanie po zacommitowaniu `.claude/`, wyszlo cos wazniejszego.
Repo mialo `.nojekyll`, wiec GitHub Pages serwowalo **cala galaz**. Zmierzone kodem
odpowiedzi na live:

    CLAUDE.md               -> 200
    docs/dziennik-prac.md   -> 200
    tools/generate-webp.js  -> 200

Dziennik prac - z wewnetrznymi notatkami, `TODO: CLIENT CONFIRMATION` i zdaniem o tym,
ze tresci medyczne nie byly czytane przez nikogo z gabinetu - byl publicznie dostepny
pod adresem strony klienta. `robots.txt` ma `Allow: /`, wiec nic tego nie blokowalo.

Naprawa: `.nojekyll` usuniete, dodany `_config.yml` z `exclude` na `docs`, `tools`
i `CLAUDE.md`. Jekyll jest wlaczony **wylacznie** po to, zeby `exclude` dzialalo.
Sprawdzone przed zmiana, ze to bezpieczne: zero wystapien `{{` i `{%` we wszystkich
plikach HTML, JS i CSS, a pliki nie maja front mattera - Jekyll kopiuje je bez zmian.

**Uwaga na przyszlosc:** od teraz deploy przechodzi przez build Jekylla. Jesli build
padnie, strona przestanie sie aktualizowac przy zielonym pushu. Po kazdej zmianie
struktury plikow warto sprawdzic kod odpowiedzi na live, a nie tylko `git push`.
### Detektor wyprowadzony z trybu DEGRADED (2026-08-21)

Doinstalowane cztery paczki parserow do `.claude/skills/impeccable/node_modules`
(`htmlparser2`, `css-select`, `domutils`, `css-tree` - razem 13 paczek, 5,1 MB).
Katalog jest w `.gitignore`, wiec nie wchodzi do repo ani do deployu.

Roznica jest drastyczna. W trybie DEGRADED detektor zglaszal **0 znalezisk**
i szescienie advisory o myslnikach. W pelnym trybie:

| zakres | znalezisk | glowne reguly |
|---|---|---|
| `blog/` | 97 | 73 extreme-negative-tracking, 6 side-tab, 6 flat-type-hierarchy, 6 gradient-text |
| `index.html` | 16 | 4 gradient-text, 3 low-contrast, 3 clipped-overflow-container, 2 cramped-padding |
| `about.html` | 13 | 5 gradient-text, 5 extreme-negative-tracking, 2 clipped-overflow-container |
| `service.html` | 13 | 7 extreme-negative-tracking, 3 gradient-text, 2 clipped-overflow-container |

**To jest backlog na nastepna iteracje, nie lista bledow do natychmiastowej
naprawy.** Wiekszosc to wzorce odziedziczone z szablonu Webflow (gradient w tekscie,
gruby akcent na krawedzi karty, ciasne swiatlo miedzy literami w naglowkach),
a nie rzeczy, ktore napisalismy sami.

`extreme-negative-tracking` z 73 trafieniami na blogu to jedna przyczyna: naglowki
dziedzicza z szablonu `letter-spacing` do -0.13em. Nasze reguly `.article-body h2/h3`
nie ustawiaja swiatla wcale, wiec przechodzi wartosc Webflow. Poprawka byloby jedna
linijka, ale dotknelaby wszystkich naglowkow w serwisie - stad do osobnej iteracji.

### Jak czytac znaleziska `low-contrast` - trzy z czterech byly artefaktami

Detektor liczy kaskade STATYCZNIE, wiec potrafi sparowac kolor tekstu z tlem, ktore
nigdy razem nie wystepuje. Kazde znalezisko przeszlo weryfikacje w przegladarce:

- **linki paska nawigacji, rzekomo 1,08:1** - artefakt. Pasek jest przezroczysty,
  a pod nim lezy hero z **gradientem**. Ani przejscie po przodkach, ani
  `elementsFromPoint` tego nie widza, bo oba czytaja `backgroundColor`, a gradient
  siedzi w `background-image`. Zrzut ekranu rozstrzygnal w sekunde: linki sa czytelne
  na ciemnym gradiencie. To ten sam prog, o ktorym mowi sekcja 6 - **gdy tlem jest
  obraz albo gradient, kontrast liczy sie z pikseli, nie z wartosci CSS**.
- **`.text-highlighted` na `about.html`, rzekomo 1,21:1** - artefakt tego samego
  rodzaju. Element ma gradient w tle (prawdopodobnie `background-clip: text`, co
  zreszta zapala u Impeccable regule `gradient-text`).
- **akapit FAQ na `#c8c8c8`, 2,96:1 przy 390 px** - **kandydat na realny blad,
  niedokonczona weryfikacja.** Rodzic `a.faq_item` ma nieprzezroczyste tlo
  `rgb(200, 200, 200)` - to domyslne tlo aktywnej zakladki Webflow
  (`.w-tab-link.w--current`). Tekst odpowiedzi `#707070` na tym tle daje 2,96:1
  przy progu 4,5. Zrzut zlapal element w trakcie animacji rozwijania, wiec stanu
  spoczynkowego NIE potwierdzono. Do sprawdzenia na poczatku nastepnej iteracji:
  otworzyc pozycje FAQ, odczekac na koniec animacji, zmierzyc ponownie.
  Dotyczy `index.html` i `blog.html` przy 390 px.

### Sprzatanie martwego `#333` okazalo sie zmiana wizualna

Zadanie brzmialo "wyczysc martwe `#333` w `.article-body`" i wygladalo na kosmetyke.
Pomiar przed i po (6 podstron x 4 szerokosci, 19 026 elementow) pokazal co innego:
**10 263 roznice w stylach, zero w geometrii**. Po odsianiu elementow, ktore nie
renderuja tekstu, zostaje obraz rzeczywisty:

| element | bylo | jest |
|---|---|---|
| `td` (1254 trafienia) | #333333, 12,63:1 | #707070, 4,95:1 |
| `li` (550) | #333333, 12,63:1 | #707070, 4,95:1 |
| `strong` (484) | #333333, 12,63:1 | #707070, 4,95:1 |
| `p` (66) | #6e7677, 4,65:1 | #707070, 4,95:1 |

Czyli `#333` wcale nie bylo martwe - bylo martwe TYLKO dla akapitow (bo globalna
regula `p` Webflow bije dziedziczenie), a listy, komorki tabel i pogrubienia
faktycznie z niego korzystaly. Tresc miala dwa rozne kolory tekstu obok siebie
i nikt tego nie zauwazyl.

Wybrany wariant: **jeden token `gray-600` na wszystkie elementy tekstowe tresci**.
Artykul czyta sie jak jeden glos, kolor zgadza sie z reszta serwisu, wszystko
powyzej AA. Cena: listy, tabele i pogrubienia sa jasniejsze niz byly.
Alternatywy, gdyby decyzja miala byc inna - obie to jedna linijka:
`gray-800` (#646464, 5,8:1) jako kompromis albo `primary-900` (17,19:1), jesli
tresc ma byc wyraznie ciemniejsza niz reszta serwisu.

**Wniosek ogolny, ten sam co przy skrocie `margin` i przy tle `<button>`:
"czyszczenie martwego kodu" trzeba zmierzyc jak kazda inna zmiane.** Trzeci raz
tego samego dnia deklaracja wygladajaca na nieaktywna okazala sie dzialac.
---

## 8. Cennik (2026-08-21)

Nowe strony: `cennik.html` (10 kategorii, 73 pozycje) i `cennik-medycyna-estetyczna.html`
(8 pozycji). "Cennik" doszedl do paska nawigacji na wszystkich 11 stronach, miedzy
"Uslugi" a "Blog".

### Zrodlo i sposob przepisania

Ceny pochodza ze starej strony gabinetu:
`http://www.amicodental.pl/cennik-dentysta-swidnik.html`. Pobrane curlem jako surowy
HTML i sparsowane programowo (`cennik-przepisz.js`) - **zero przepisywania recznie**,
zeby nie dalo sie przekrecic kwoty.

Kontrola integralnosci po przepisaniu:

    pozycji:  zrodlo 80 -> wyjscie 81   (roznica 1 = rozdzielona pozycja, patrz nizej)
    liczb:    123 -> 123   ZBIORY IDENTYCZNE
    slow:     277 -> 277   ZBIORY IDENTYCZNE

Jedyna normalizacja: odstep przed "zl" (zrodlo ma raz `800 zł`, raz `800zł`).
Cyfry nietkniete.

### Trzy rzeczy wymagajace interpretacji - wszystkie do potwierdzenia przez gabinet

**1. Zrodlo nie ma kategorii.** To jedna plaska lista `<ol>` z 80 pozycjami.
Podzial na kategorie jest NASZ i wynika wylacznie z kolejnosci pozycji - nic nie
zostalo przestawione, wstawione sa tylko naglowki w naturalnych granicach.
Granice w generatorze wyznaczone sa po NAZWIE uslugi, a nie po numerze, wiec
przesuniecie w zrodle wywali blad zamiast po cichu rozjechac podzial.

**2. Jedna pozycja skleja dwie uslugi** - w zrodle brakuje znacznika zamykajacego:

    Leczenie "bezwiertłowe" - 180zł + koszt wypełnienia Rekonstrukcja zęba na
    włóknie szklanym - 550zł

Rozdzielona na dwa wiersze. To jedyna ingerencja w tresc.

**3. Jedenascie pozycji ma po kilka cen w jednym zdaniu** (np. `twarz- 900 zł;
twarz+szyja- 1100 zł`). Tych NIE rozdzielamy na sile - dostaja klase `is-caly`
i ida jednym blokiem, w surowym zapisie. Lepiej pokazac oryginal niz zgadywac,
ktora kwota jest glowna. Parser ma na to dwa zabezpieczenia: jesli po odcieciu
ceny w nazwie zostaje "zl" albo mysnik z liczba, pozycja idzie w calosci.

### Dwie anomalie w zrodle - CELOWO NIEPOPRAWIONE

- `Wybielanie endo - 200 / druga i kolejna wizyta - 180zł` - pierwsza kwota
  nie ma jednostki.
- `PRX -T33 twarz-300zł/ twarz+szyja- 400zł/ twarz+szyja+dekolt- 200zł` -
  najszerszy zakres zabiegu jest TANSZY niz sama twarz. Wyglada na literowke,
  ale poprawianie cudzych cen to nie nasza decyzja.

### Decyzje

**Medycyna estetyczna osobno.** Ustalone z klientem 2026-08-21. To inna kategoria
uslug niz stomatologia, a stara strona gabinetu nie ma jej nawet w menu. Osobna
strona, linkowana z cennika i z powrotem, poza paskiem nawigacji - zeby nie
rozmywac profilu gabinetu.

**Bez schematu `Offer` z cenami.** Strony maja `WebPage` + `BreadcrumbList` spiete
z wezlem `Dentist`, ale cen NIE emitujemy jako danych maszynowych. `Offer` z `price`
to deklaracja handlowa dla wyszukiwarki; ceny pochodza ze starej strony i moga byc
nieaktualne. Ustalenie z klientem: publikujemy je jako tresc z zastrzezeniem,
a poprawimy, gdy gabinet je zweryfikuje.

**Strony cennika sa tekstowe, wiec nie laduja jQuery, Webflow ani GSAP** - dokladnie
jak wpisy bloga. Menu obsluguje ten sam skrypt, hamburger jest natywnym `<button>`.

### Weryfikacja

Zakres zmian w stronach bazowych sprawdzony diffem: jedyne co doszlo to trzy linie
pozycji "Cennik" w pasku i podbity `?v=`. Nic wiecej.

Nowe selektory CSS (`.cennik-*`, `.cennik-page .article-*`) sprawdzone w przegladarce
na wszystkich pozostalych stronach: **zero trafien**, wiec nie moga niczego ruszyc.

Obie strony cennika na 320/390/768/1440: zero poziomego scrolla, zero bledow konsoli,
jeden `<h1>`, hierarchia naglowkow bez przeskokow, wszystkie kotwice spisu kategorii
istnieja, lewe krawedzie kolumny zgodne, kontrast - usluga 4,95:1, cena 17,19:1,
link przelacznika 13,32:1. Detektor Impeccable: 11 znalezisk, wszystkie odziedziczone
z szablonu (`extreme-negative-tracking`, `side-tab`, `gradient-text`), zero nowych,
zero `low-contrast`.

Szesc wpisow bloga przegenerowanych z nowym paskiem - sonda bez uwag, 10 linkow
wewnetrznych na stronie zamiast 9.

**Poprawka przy okazji:** link telefoniczny w ramce nad cennikiem mierzyl 21 px.
Formalnie WCAG wylacza spod wymogu 24 px linki w zdaniu, ale to numer telefonu na
stronie gabinetu - najcenniejsze dotkniecie na calej stronie. Traktujemy go jak
przycisk, nie jak odnosnik w tekscie.

**Falszywy alarm sondy, wart zapamietania:** przycisk hamburgera raportuje 18 px
wysokosci, bo `getBoundingClientRect()` nie widzi pseudo-elementu `::after`, ktory
powieksza obszar klikalny do 44x44 (patrz sekcja o menu mobilnym). To nie jest blad.
---

## 9. Opinie pacjentow (2026-08-21)

### Sekcja obiecywala cos, czego nie miala

Naglowek "Dlaczego pacjenci nam ufaja" stal nad trzema autoopisami gabinetu
("Spokojna atmosfera", "Jasna komunikacja", "Zespol specjalistow") - czyli nad
marketingiem podpisanym nazwiskiem gabinetu, a nie nad glosem pacjentow.
Zmienione na **"Jak pracujemy"**, etykieta nad naglowkiem z "Dlaczego my" na
"Nasze podejscie". Tresc slajdow bez zmian - zmienila sie obietnica, nie zawartosc.

### Co udalo sie ustalic o prawdziwych opiniach

| zrodlo | stan |
|---|---|
| **Google Business** | profil ISTNIEJE, Place ID `ChIJGbb8sEhUIkcR8cLGWtfI1UI`, wspolrzedne 51.2117, 22.6907 |
| ocena | **4,1/5 z 62 opinii** wg agregatora porownajdentyste.pl, ktory czyta Google |
| **ZnanyLekarz** | profil lek. dent. Malgorzaty Majewskiej: 4 opinie, ocena 4,0, tylko prywatnie, **bez rezerwacji online**; profilu samego gabinetu brak |
| **Orly Stomatologii** | gabinet figuruje jako laureat plebiscytu w Swidniku |

**Czego NIE udalo sie zweryfikowac:** liczb 4,1/62 bezposrednio u Google. Profil
otwiera sie na scianie zgod na cookies, a klikanie "akceptuje" po to, zeby
zescrapowac dane, to nie jest czynnosc do wykonania bez zgody wlasciciela.
Gabinet potwierdzi liczby w panelu Google Business w kilkanascie sekund.
Do czasu potwierdzenia w `index.html` wisi `TODO: CLIENT CONFIRMATION`.

### Co zostalo wdrozone: wariant lekki

Statyczny blok `.opinie-google` pod sliderem: ocena, liczba opinii, link do profilu
Google i **data odczytu**. Zero zewnetrznych skryptow, zero widzetow.

**Dlaczego nie widzet.** Zmierzone rozmiary samych loaderow:

    Trustindex  loader.js     87 797 B  (~86 KB)
    Elfsight    platform.js   44 086 B  (~43 KB)

I to jest samo wejscie - potem dociagaja dane opinii, awatary i wlasne fonty.
Strona glowna ma 184 KB JS i 3 s do DOMContentLoaded, wiec widzet to wzrost
JavaScriptu o 25-50% na stronie, ktora juz jest za wolna. Do tego zewnetrzne
cookies do obslugi w zgodach.

**Dlaczego jest data odczytu.** Ocena w Google sie zmienia, a to jest statyczny
HTML. Bez daty strona twierdzilaby swoje jeszcze za rok.

### Dwie rzeczy, ktorych CELOWO nie ma

**`AggregateRating` w danych strukturalnych.** Wytyczne Google zabraniaja firmie
oznaczania wlasnej zbiorczej oceny do rich resultow - to podstawa do recznej kary.
Ocena jest trescia strony, nie schema. Sprawdzone po wdrozeniu: w `index.html`
nie ma slowa `AggregateRating`.

**Tresci opinii.** Przepisanie ich z Google to scrapowanie wbrew regulaminowi
i cudza tresc. Tresc wejdzie dopiero przez oficjalne API - patrz backlog.

### Backlog: zadania wymagajace zaangazowania klienta

1. **Wariant C - opinie przez Google Places API.** Tresc opinii wypiekana
   w statyczny HTML na etapie generowania, czyli zero kosztu w przegladarce -
   jedyna droga, ktora pokazuje opinie bez spowalniania strony.
   **Wymaga od gabinetu:** klucza Google Places API z kontem rozliczeniowym.
   Ograniczenia: maksymalnie 5 opinii, obowiazkowa atrybucja, cache do 30 dni,
   wiec generator trzeba przepuszczac cyklicznie.
2. **Orly Stomatologii.** Gabinet figuruje jako laureat plebiscytu.
   **Wymaga od gabinetu:** potwierdzenia roku i zgody na uzycie znaku.
   Slabszy sygnal niz opinie Google, ale darmowy.
3. **Potwierdzenie oceny 4,1/62** w panelu Google Business.
4. **Zbieranie opinii.** ZnanyLekarz ma dla tego gabinetu tylko 4 opinie
   i nie oferuje rezerwacji online. Google ma 62 - i to tam warto kierowac
   pacjentow. Najprostsza droga: krotki link (`g.page`) na karcie po wizycie.

### Kontrola

Blok zmierzony na 320/390/768/1440: zero poziomego scrolla, zero bledow konsoli,
**zero zewnetrznych skryptow**, przycisk 44 px i klikalny (`elementFromPoint`),
kontrast na tle `primary-700` - liczba 14,4:1, tekst 12,41:1, data 11,77:1,
link 14,4:1. Wszystko daleko powyzej AA.
