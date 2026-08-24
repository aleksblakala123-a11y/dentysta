# TODO: CLIENT CONFIRMATION - materialy do uzupelnienia

Stan na 24.08.2026. Lista rzeczy, ktorych **nie wolno wymyslic** - musza przyjsc
od gabinetu albo zostac przez gabinet potwierdzone.

---

## 1. Zdjecia lekarzy

| Lekarz | Stan |
|---|---|
| dr n. med. Jacek Majewski | **zdjecie jest** - kadr ze strony gabinetu |
| lek. stom. Malgorzata Majewska | **zdjecie jest** - kadr ze strony gabinetu |
| lek. stom. Julita Kosior | TODO: CLIENT CONFIRMATION |
| lek. stom. Ilona Bednarska | TODO: CLIENT CONFIRMATION |
| lek. stom. Anna Galazka-Wojcik | TODO: CLIENT CONFIRMATION |

### Skad pochodza dwa istniejace zdjecia

Ze zdjecia `assets/images/mm_jm_amicodental.jpg` na stronie gabinetu
(amicodental.pl), podpisanego tam jako "Malgorzata Majewska i Jacek Majewski".
Jest to jeden kadr poziomy 537x278 z dwiema osobami; zostal przyciety na dwa
portrety 3:4 po 208x278.

**Do potwierdzenia przed uruchomieniem - nie jest to formalnosc:**

- **zgoda na wizerunek.** To sa zdjecia konkretnych, rozpoznawalnych osob.
  Fakt, ze zdjecie jest publiczne na ich wlasnej stronie, nie jest zgoda na
  uzycie go gdzie indziej. Wystarczy ustne potwierdzenie od gabinetu, ale musi
  paść.
- **prawa do samej fotografii.** Zdjecie zrobil ktos - fotograf albo gabinet.
  Jesli fotograf, to on ma prawa autorskie i gabinet moze nie miec prawa
  przekazac ich dalej.

Dopoki to nie jest potwierdzone, zdjecia sa uzasadnione **wylacznie** jako
element wersji demonstracyjnej pokazywanej temu gabinetowi. Wersja demo ma
`noindex` na wszystkich stronach.

### Wymagania na docelowe zdjecia

Obecne kadry maja 208x278 px, a kafelek renderuje sie w 343x460 (mobile) i
373x500 (desktop). To znaczy **powiekszenie okolo 1,7x** - zdjecia sa miekkie.
Dzialaja jako dowod, ze sekcja jest gotowa, ale nie jako material docelowy.

- kadr **pionowy 3:4**, zrodlo minimum 600x800 px
- jednolite tlo i podobny kadr dla calej piatki
- nazewnictwo: `assets/img/lekarz-imie-nazwisko.jpg` + `assets/img/opt/*.webp`
- `alt` = imie i nazwisko + specjalizacja

**Nie podstawiac zdjec stockowych.** W `assets/img/opt/` lezaly kiedys pliki
`gen_team-image-*` - wygenerowane twarze obcych ludzi podstawione pod nazwiska
prawdziwych lekarzy. Commit `a64256e` celowo je usunal, a `657c8fe` skasowal
sieroty. Nie przywracac.

---

## 2. Formularz zamawiania wizyty - brak backendu

`rezerwacja.html` dziala, waliduje pola i sklada gotowa wiadomosc, ale strona
jest statyczna, wiec **nic nie wysyla w tle** - otwiera program pocztowy
uzytkownika. Jest to napisane wprost pod przyciskiem, zeby nikt nie czekal na
potwierdzenie, ktore nie przyjdzie.

**Przed uruchomieniem trzeba podpiac prawdziwy endpoint.** Opcje:

- skrypt PHP na hostingu gabinetu (stara strona ma wlasny backend, wiec hosting
  to obsluguje),
- usluga zewnetrzna typu Formspree albo Netlify Forms.

W obu przypadkach zmienia sie jedna rzecz w `rezerwacja.html`: zamiast budowac
`mailto:` robimy `fetch` POST-em. Walidacja, komunikaty bledow i dostepnosc
zostaja bez zmian - patrz komentarz w skrypcie na dole tego pliku.

**Do ustalenia z gabinetem:** na jaki adres maja trafiac zgloszenia i kto je
odbiera. Formularz zbiera dane osobowe (imie, telefon, e-mail), wiec potrzebna
jest tez zgodnosc z polityka prywatnosci - checkbox linkuje do `privacy.html`,
ale tresc tej polityki powinna zostac sprawdzona pod katem formularza.

---

## 3. Biogramy zespolu - do zatwierdzenia

Szesc profili (`zespol-*.html`) zostalo zbudowanych z **realnych danych ze strony
gabinetu** (amicodental.pl, sekcja "O NAS"). Nic nie zostalo wymyslone: uczelnie,
lata dyplomow, specjalizacje, czlonkostwa, stypendia i staze sa przepisane 1:1.

Poprawione zostaly wylacznie brakujace spacje po kropkach i przecinkach, ktore
sa bledem w zrodle ("podrozami.Wciaz", "spokoj,ktory").

| Osoba | Rola | Zdjecie |
|---|---|---|
| dr n. med. Jacek Majewski | chirurgia, protetyka | jest |
| lek. stom. Malgorzata Majewska | stomatologia zachowawcza z endodoncja | jest |
| lek. stom. Julita Kosior | specjalista ortodoncji | inicjaly |
| lek. stom. Ilona Bednarska | zachowawcza, endodoncja, periodontologia | inicjaly |
| lek. stom. Anna Galazka-Wojcik | specjalista stomatologii dzieciecej | inicjaly |
| dypl. hig. Karolina Sprycha | higienistka i asystentka | inicjaly |

**TODO: CLIENT CONFIRMATION** - tresc biogramow jest wlasnoscia gabinetu i
pochodzi z ich strony. Przed uruchomieniem trzeba potwierdzic, ze moze zostac
uzyta w tej formie, oraz sprawdzic, czy dane sa nadal aktualne - najstarsze
wpisy moga miec kilka lat (np. "w lutym 2013 uzyskal stopien doktora").

Nadal brakuje i warto dopytac:

- numery **PWZ** (prawo wykonywania zawodu) - w Polsce podnosza wiarygodnosc
- jezyki obce, w ktorych przyjmuja
- aktualne szkolenia i certyfikaty z ostatnich lat

## 4. Tresc podstron zabiegow

Osiem podstron (`uslugi-*.html`) zawiera zakres zabiegow przepisany z
`service.html` i odnosniki do wlasciwych grup w cenniku. **Nie ma tam opisow
medycznych** - zadnych wyjasnien, wskazan ani przebiegu leczenia, bo takich
tresci nie ma w repo i nie wolno ich wymyslac.

Stara strona gabinetu ma opisy dla pietnastu zabiegow. Do decyzji: przepisac je
za zgoda gabinetu czy zamowic nowe teksty. Kazdy opis powinien przejsc przez
osobe z uprawnieniami - to tresc medyczna.

---

## 5. Do decyzji wlasciciela strony

- **Karty lekarzy sa self-linkami.** Kazda ma dwa `<a href="about.html">` -
  na stronie "O nas" linkuja same do siebie. Docelowo powinny prowadzic do
  podstron `/zespol/imie-nazwisko` albo przestac byc linkami.
- **`aria-label="doctor's profile"`** - angielski opis na polskiej stronie,
  10x w `about.html`, 3x w `index.html`.
- Nazwy klas `team-menmber_name` i `team-menuber_designation` zawieraja dwie
  rozne literowki z Webflow.
