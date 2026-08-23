# TODO: CLIENT CONFIRMATION - materialy do uzupelnienia

Stan na 23.08.2026. Lista rzeczy, ktorych **nie wolno wymyslic** - musza przyjsc
od gabinetu. Do czasu ich dostarczenia strona dziala, ale sekcja zespolu opiera sie
na inicjalach zamiast twarzy, a to najslabszy punkt strony budujacej zaufanie.

---

## 1. Zdjecia lekarzy (priorytet najwyzszy)

Piec kart w sekcji "Poznaj lekarzy Amico Dental" (`about.html`) pokazuje kolka
z inicjalami: JM, MM, JK, IB, AG. Markup i CSS sa juz przygotowane pod podmiane -
patrz komentarz przy pierwszej karcie w `about.html` oraz `.team-avatar_foto`
na koncu `assets/css/amico.css`.

| Lekarz | Inicjaly | Zdjecie |
|---|---|---|
| dr n. med. Jacek Majewski | JM | TODO: CLIENT CONFIRMATION |
| lek. stom. Malgorzata Majewska | MM | TODO: CLIENT CONFIRMATION |
| lek. stom. Julita Kosior | JK | TODO: CLIENT CONFIRMATION |
| lek. stom. Ilona Bednarska | IB | TODO: CLIENT CONFIRMATION |
| lek. stom. Anna Galazka-Wojcik | AG | TODO: CLIENT CONFIRMATION |

Wymagania techniczne:

- kadr **pionowy 3:4**, zrodlo minimum 600x800 px (box na karcie to 373x500 px
  przy 1280 px viewportu, wiec 600x800 starcza takze na ekrany 2x)
- jednolite tlo i podobny kadr dla calej piatki - piec roznych stylow zdjec
  wyglada gorzej niz piec spojnych inicjalow
- nazewnictwo zgodne z konwencja repo: `assets/img/lekarz-imie-nazwisko.jpg`
  + warianty `assets/img/opt/lekarz-imie-nazwisko-{400,800}w.webp`
- `alt` = imie i nazwisko + specjalizacja, np.
  `alt="dr n. med. Jacek Majewski - chirurgia, protetyka"`

**Nie podstawiac zdjec stockowych.** Na stronie "poznaj naszych lekarzy" zdjecie
obcej osoby to wprowadzenie pacjenta w blad co do tego, kto go bedzie leczyl.
Inicjaly sa uczciwe, stock nie jest.

---

## 2. Dane zawodowe lekarzy

Obecnie kazda karta ma tylko nazwisko i jedna linijke specjalizacji. Do uzupelnienia
dla kazdego z piatki:

- numer **PWZ** (prawo wykonywania zawodu) - w Polsce podnosi wiarygodnosc
  i jest oczekiwany przez czesc pacjentow
- uczelnia i rok dyplomu
- staz pracy
- jezyki obce, w ktorych przyjmuje
- szkolenia i certyfikaty warte pokazania

Te dane sa tez potrzebne do rozbudowy `Person` w structured data - obecnie
w JSON-LD sa tylko `name`, `jobTitle` i specjalizacja, bo tylko tyle wynika
z tresci strony.

---

## 3. Do decyzji wlasciciela strony (nie material od klienta)

Ustalenia z audytu, ktore czekaja na decyzje, bo zmieniaja zachowanie strony:

- **Karty lekarzy sa self-linkami.** Kazda karta ma dwa `<a href="about.html">`
  (jeden na awatarze, jeden na nazwisku) - czyli na stronie "O nas" linkuja
  same do siebie. 10 linkow, ktore nic nie robia. Docelowo powinny prowadzic
  do podstron `/zespol/imie-nazwisko`, albo przestac byc linkami.
- **`aria-label="doctor's profile"`** - angielski opis na polskiej stronie,
  10 wystapien w `about.html` i 3 w `index.html`. Do poprawy przy okazji
  decyzji o self-linkach, bo obie zmiany dotykaja tego samego markupu.
- Nazwy klas `team-menmber_name` i `team-menuber_designation` zawieraja
  dwie rozne literowki z Webflow. Zmiana wymaga ruszenia CSS i HTML naraz.
