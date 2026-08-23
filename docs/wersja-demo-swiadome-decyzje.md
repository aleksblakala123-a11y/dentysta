# Swiadome decyzje wersji demonstracyjnej

Stan na 23.08.2026.

Ten plik istnieje po to, zeby nikt - czlowiek ani narzedzie - nie "naprawil"
rzeczy, ktore sa celowe. Kazda z ponizszych pozycji **wyglada jak blad przy
pobieznym audycie** i kazda ma zostac tak, jak jest, dopoki strona nie trafi
na docelowa domene.

Strona jest wersja demonstracyjna przygotowana pod sprzedaz gabinetowi.
Klient jeszcze jej nie kupil. Adres roboczy:
`https://aleksblakala123-a11y.github.io/dentysta/`
Adres docelowy: `https://amicodental.pl/`

---

## 1. `og:image`, `og:url` i `canonical` wskazuja na amicodental.pl

Wystepowanie: po 6 sztuk kazdego, w `index`, `about`, `service`, `blog`,
`cennik`, `cennik-medycyna-estetyczna`.

**Objaw, ktory to daje:** na wersji demo podglad linku (Facebook, LinkedIn,
Messenger, Slack) nie wyrenderuje obrazka, bo `amicodental.pl` jeszcze nie
serwuje tresci. Wyglada to na zepsute Open Graph.

**Dlaczego zostaje:** to sa adresy produkcyjne i po przeniesieniu na docelowa
domene beda poprawne od pierwszej sekundy. Przestawienie ich teraz na
`github.io` oznaczaloby, ze przy wdrozeniu trzeba pamietac o cofnieciu zmiany
w 18 miejscach - a `canonical` wskazujacy na `github.io` po wdrozeniu
kazalby Google traktowac wersje robocza jako zrodlo prawdy.

**Kiedy to ruszyc:** dopiero gdy `amicodental.pl` zacznie serwowac te pliki.
Wtedy nie trzeba nic zmieniac - adresy juz sa poprawne.

---

## 2. `noindex, nofollow` na 16 stronach

Wystepowanie: wszystkie strony HTML, dodane w commicie `c7fbd8b`.

**Objaw:** audyt SEO zglosi to jako blad krytyczny ("strona zablokowana
przed indeksowaniem").

**Dlaczego zostaje:** wersja demo nie moze konkurowac w wynikach wyszukiwania
z przyszla strona produkcyjna ani pokazywac sie pacjentom szukajacym gabinetu.
Gabinet istnieje naprawde - zaindeksowana wersja robocza z adresem i telefonem
kierowalaby do niej ruch, ktorego nikt nie obsluguje.

**Kiedy to ruszyc:** przy wdrozeniu na `amicodental.pl` - usunac znacznik
`<meta name="robots" content="noindex, nofollow">` ze wszystkich plikow.
Szukac komentarza `WERSJA DEMONSTRACYJNA - USUNAC PRZED URUCHOMIENIEM`.

---

## 3. `robots.txt` i `sitemap.xml` wskazuja na domene produkcyjna

`robots.txt` zawiera `Sitemap: https://amicodental.pl/sitemap.xml`,
a `sitemap.xml` listuje adresy `https://amicodental.pl/...`.

**Objaw:** na wersji demo sitemap wskazuje na nieistniejace adresy.

**Dlaczego zostaje:** ten sam powod co w punkcie 1. Dodatkowo `noindex`
z punktu 2 i tak sprawia, ze zaden robot nie potraktuje tej wersji powaznie.

---

## 4. Inicjaly zamiast zdjec lekarzy

Sekcja zespolu na `about.html` pokazuje kola z inicjalami (JM, MM, JK, IB, AG).

**Objaw:** wyglada na niedokonczona sekcje z placeholderami.

**Dlaczego zostaje:** gabinet nie dostarczyl zdjec i dostarczy je dopiero,
jesli zdecyduje sie kupic strone. Wczesniej podstawiono tu **wygenerowane
twarze obcych ludzi** i commit `a64256e` celowo je usunal - podpisywanie
cudzej twarzy nazwiskiem lekarza wprowadza pacjenta w blad co do tego,
kto go bedzie leczyl.

**Uwaga - pulapka:** w `assets/img/opt/` nadal leza pliki `gen_team-image-2..6`
w wariantach 400w/800w. Wygladaja jak zdjecia lekarzy i jest ich dokladnie
piec. **To sa te wygenerowane twarze.** Nie podstawiac ich z powrotem.
Prefiks `gen_` w tym repo oznacza obraz generowany.

**Kiedy to ruszyc:** gdy przyjda prawdziwe zdjecia od gabinetu. Podmiana jest
przygotowana: klasa `.team-avatar_foto` w `amico.css` i gotowy wzorzec
`<picture>` w komentarzu przy pierwszej karcie w `about.html`.
Lista brakow: `docs/TODO-materialy-od-klienta.md`.

---

## Czego ten plik NIE usprawiedliwia

Nie kazda rzecz wygladajaca na celowa jest celowa. Otwarte dlugi techniczne
sa opisane w `docs/dziennik-prac.md`, miedzy innymi:

- `amico.css` ma ~190 KB, w duzej czesci martwe reguly po Webflow
- `index`, `about`, `service`, `blog` laduja jQuery i runtime Webflow
  (~135 KB transferu) dla samego menu, akordeonu i slidera, podczas gdy
  `cennik.html` i wpisy `blog/` radza sobie bez nich
- w repo leza nieuzywane pliki graficzne
