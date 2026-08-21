/* Buduje strony cennika z danych przepisanych ze starej strony gabinetu
   oraz z chrome wyjetego PROGRAMOWO z index.html.

   Dwie strony z jednego generatora. Medycyna estetyczna idzie osobno: to inna
   kategoria uslug niz stomatologia, a stara strona gabinetu nie ma jej nawet
   w menu. W pasku nawigacji zostaje sam "Cennik" - podstrona estetyczna jest
   linkowana z cennika i z powrotem, zeby nie rozmywac profilu gabinetu.

   Cennik lezy w roocie, wiec sciezki wzgledne zostaja bez zmian - w odroznieniu
   od podstron bloga, gdzie trzeba je podnosic o poziom.

   Danych strukturalnych z cenami CELOWO NIE EMITUJEMY. Schema `Offer` z `price`
   to deklaracja handlowa dla wyszukiwarki; ceny pochodza ze starej strony
   i moga byc nieaktualne, wiec publikujemy je jako tresc z zastrzezeniem,
   a nie jako dane maszynowe. */
const fs = require('fs');
const path = require('path');

/* Sciezka wyliczana ze scriptu, nie zaszyta na sztywno - generatory leza teraz
   w repo (tools/generatory), wiec dzialaja niezaleznie od tego, gdzie ktos je sklonuje. */
const REPO = path.resolve(__dirname, '..', '..');
const S = __dirname;
const WERSJA = 'v=20260821m';

const STRONY = [
  {
    plik: 'cennik.html',
    dane: 'cennik-dane-stomatologia.json',
    tytulSeo: 'Cennik',
    h1: 'Cennik usług stomatologicznych',
    kicker: 'Cennik',
    okruszek: 'Cennik',
    opis: 'Orientacyjny cennik usług stomatologicznych gabinetu Amico Dental w Świdniku — leczenie zachowawcze, endodoncja, protetyka, chirurgia, ortodoncja i profilaktyka.',
    lead: 'Poniżej znajdziesz orientacyjne ceny zabiegów wykonywanych w naszym gabinecie. Zakres leczenia i jego ostateczny koszt ustalamy zawsze po badaniu.',
    aktywny: true,
    dodatkowy: { href: 'cennik-medycyna-estetyczna.html', tekst: 'Cennik medycyny estetycznej' }
  },
  {
    plik: 'cennik-medycyna-estetyczna.html',
    dane: 'cennik-dane-estetyczna.json',
    tytulSeo: 'Cennik medycyny estetycznej',
    h1: 'Cennik medycyny estetycznej',
    kicker: 'Medycyna estetyczna',
    okruszek: 'Medycyna estetyczna',
    opis: 'Orientacyjny cennik zabiegów medycyny estetycznej w gabinecie Amico Dental w Świdniku.',
    lead: 'Zabiegi medycyny estetycznej wykonujemy po konsultacji, na której omawiamy oczekiwania, przeciwwskazania i możliwy efekt. Ceny poniżej są orientacyjne.',
    aktywny: false,
    dodatkowy: { href: 'cennik.html', tekst: 'Cennik stomatologiczny' }
  }
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const id = s => s.toLowerCase().replace(/[ąćęłńóśźż]/g, c => 'acelnoszz'['ąćęłńóśźż'.indexOf(c)])
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- chrome
const zrodlo = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
const L = zrodlo.split('\r\n');
const odNav = L.findIndex(l => l.includes('data-collapse="medium"'));
const doMain = L.findIndex(l => l.includes('<main class="main-wrapper"'));
const odFoot = L.findIndex(l => l.includes('<footer class="section_footer"'));
const doFoot = L.findIndex(l => l.trim() === '</footer>');
if (odNav < 0 || doMain < 0 || odFoot < 0 || doFoot < 0) throw new Error('nie znalazlem chrome w index.html');

const stopka = L.slice(odFoot, doFoot + 1).join('\r\n');
const navBazowy = L.slice(odNav, doMain).join('\r\n');
if (!navBazowy.includes('cennik.html')) throw new Error('pasek nie zawiera linku do cennika - dodaj go najpierw w index.html');

/* Strony cennika sa tekstowe, dokladnie jak wpisy bloga - nie laduja jQuery,
   Webflow ani GSAP. Menu obsluguje ten sam ~45-liniowy skrypt co blog, wiec
   hamburger musi byc natywnym <button>, a panel dostaje id dla aria-controls. */
function przygotujNav(aktywny) {
  let nav = navBazowy
    .replace('<a href="index.html" aria-current="page" class="navbar_link w-inline-block w--current">',
      '<a href="index.html" class="navbar_link w-inline-block">')
    .replace('<nav role="navigation" class="navbar_menu w-nav-menu">',
      '<nav id="navbar-menu" role="navigation" class="navbar_menu w-nav-menu">')
    .replace('<div class="navbar-toggler-button w-nav-button">',
      '<button type="button" class="navbar-toggler-button w-nav-button" aria-label="Otwórz menu" aria-controls="navbar-menu" aria-expanded="false">');

  /* Pozycja "Cennik" jest oznaczona jako biezaca takze na podstronie
     estetycznej - to nadal ta sama galaz serwisu, a uzytkownik ma widziec,
     gdzie jest. Roznica: `aria-current` tylko na stronie doslownie wskazanej. */
  nav = aktywny
    ? nav.replace('<a href="cennik.html" class="navbar_link w-inline-block">',
      '<a href="cennik.html" aria-current="page" class="navbar_link w-inline-block w--current">')
    : nav.replace('<a href="cennik.html" class="navbar_link w-inline-block">',
      '<a href="cennik.html" class="navbar_link w-inline-block w--current">');

  const od = nav.indexOf('<button type="button" class="navbar-toggler-button');
  if (od < 0) throw new Error('nie podmienilem hamburgera na <button>');
  const wciecie = nav.slice(nav.lastIndexOf('\n', od) + 1).match(/^\s*/)[0];
  const znacznik = '\r\n' + wciecie + '</div>';
  const koniec = nav.indexOf(znacznik, od);
  if (koniec < 0) throw new Error('nie znalazlem zamkniecia hamburgera');
  return nav.slice(0, koniec) + '\r\n' + wciecie + '</button>' + nav.slice(koniec + znacznik.length);
}

/* Skrypty wspoldzielone wyjmowane z index.html przy kazdym uruchomieniu -
   nie przepisywane, zeby nie rozjechaly sie z reszta serwisu. */
function blokSkryptu(znak) {
  const i = zrodlo.indexOf(znak);
  if (i < 0) throw new Error('brak bloku skryptu: ' + znak);
  return zrodlo.slice(zrodlo.lastIndexOf('<script>', i), zrodlo.indexOf('</script>', i) + 9);
}
const skrypty = [
  blokSkryptu('/* Amico image guard'),
  blokSkryptu('/* Pasek nawigacji:'),
  fs.readFileSync(path.join(S, 'artykul-menu.html'), 'utf8').replace(/\r?\n/g, '\r\n').trimEnd()
].join('\r\n');

// ---------------------------------------------------------------- strona
function zbuduj(k) {
  const DANE = JSON.parse(fs.readFileSync(path.join(S, k.dane), 'utf8'));
  const ADRES = 'https://amicodental.pl/' + k.plik;

  const graf = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': ADRES,
        name: k.h1,
        description: k.opis,
        inLanguage: 'pl-PL',
        isPartOf: { '@id': 'https://amicodental.pl/#dentist' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://amicodental.pl/index.html' },
          { '@type': 'ListItem', position: 2, name: k.okruszek }
        ]
      }
    ]
  };

  const spis = DANE.map(g => '                            <li><a href="#' + id(g.kategoria) + '">' + esc(g.kategoria) + '</a></li>').join('\r\n');

  const sekcje = DANE.map(g => {
    const wiersze = g.pozycje.map(p => p.calosc
      ? '                                <div class="cennik-pozycja is-caly">' + esc(p.nazwa) + '</div>'
      : '                                <div class="cennik-pozycja">\r\n' +
        '                                    <span class="cennik-usluga">' + esc(p.nazwa) + '</span>\r\n' +
        '                                    <span class="cennik-cena">' + esc(p.cena) + '</span>\r\n' +
        '                                </div>').join('\r\n');
    return [
      '                        <section class="cennik-grupa" aria-labelledby="' + id(g.kategoria) + '">',
      '                            <h2 id="' + id(g.kategoria) + '">' + esc(g.kategoria) + '</h2>',
      '                            <div class="cennik-lista">',
      wiersze,
      '                            </div>',
      '                        </section>'
    ].join('\r\n');
  }).join('\r\n\r\n');

  // spis kategorii ma sens dopiero przy kilku grupach
  const blokSpisu = DANE.length > 1 ? [
    '',
    '                    <nav class="article-toc" aria-labelledby="spis-tresci">',
    '                        <h2 id="spis-tresci" class="article-toc_title">Kategorie</h2>',
    '                        <ol>',
    spis,
    '                        </ol>',
    '                    </nav>'
  ].join('\r\n') : '';

  const strona = [
    '<!DOCTYPE html>',
    '<html lang="pl">',
    '    <head>',
    '        <meta charset="utf-8"/>',
    '        <title>' + esc(k.tytulSeo) + ' | Amico Dental Świdnik</title>',
    '        <meta content="' + esc(k.opis) + '" name="description"/>',
    '        <meta content="' + esc(k.tytulSeo) + ' | Amico Dental Świdnik" property="og:title"/>',
    '        <meta content="' + esc(k.opis) + '" property="og:description"/>',
    '        <meta content="https://amicodental.pl/assets/img/gen_dentist-examining-patients-teeth-close-up_1.jpg" property="og:image"/>',
    '        <meta property="og:type" content="website"/>',
    '        <meta property="og:url" content="' + ADRES + '"/>',
    '        <meta property="og:locale" content="pl_PL"/>',
    /* WERSJA DEMONSTRACYJNA - USUNAC PRZED URUCHOMIENIEM NA DOCELOWEJ DOMENIE.
       Demo stoi pod github.io, a canonical wskazuje na domene klienta, gdzie tych
       adresow nie ma (404). Bez noindex do Google trafilaby kopia strony gabinetu
       z niepotwierdzonym cennikiem. Po przeniesieniu na docelowa domene ten blok
       MUSI zniknac - inaczej strona nie pojawi sie w wyszukiwarce. */
    '        <!-- ===== WERSJA DEMONSTRACYJNA - USUNAC PRZED URUCHOMIENIEM ===== -->',
    '        <meta name="robots" content="noindex, nofollow"/>',
    '        <meta content="width=device-width, initial-scale=1" name="viewport"/>',
    '        <link href="' + ADRES + '" rel="canonical"/>',
    '        <script type="application/ld+json">',
    JSON.stringify(graf, null, 4).split('\n').map(l => '        ' + l).join('\r\n'),
    '        </script>',
    '        <link href="assets/fonts/sora-latin.woff2" as="font" type="font/woff2" rel="preload" crossorigin=""/>',
    '        <link href="assets/fonts/sora-latin-ext.woff2" as="font" type="font/woff2" rel="preload" crossorigin=""/>',
    '        <link href="assets/css/amico.css?' + WERSJA + '" rel="stylesheet" type="text/css"/>',
    '        <script type="text/javascript">',
    '            !function(o, c) {',
    '                var n = c.documentElement',
    '                  , t = " w-mod-";',
    '                n.className += t + "js",',
    '                ("ontouchstart"in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch")',
    '            }(window, document);',
    '        </script>',
    '        <link href="assets/img/favicon.svg" rel="shortcut icon" type="image/x-icon"/>',
    '        <link href="assets/img/webclip.png" rel="apple-touch-icon"/>',
    '    </head>',
    '    <body>',
    '        <a href="#main" class="skip-link">Przejdź do treści</a>',
    '        <div class="page-wrapper">',
    przygotujNav(k.aktywny),
    '            <main class="main-wrapper article-page cennik-page" id="main" tabindex="-1">',
    '                <article class="article">',
    '                    <header class="article-head">',
    '                        <nav class="article-breadcrumb" aria-label="Ścieżka nawigacji">',
    '                            <ol>',
    '                                <li><a href="index.html">Strona główna</a></li>',
    (k.aktywny ? '' : '                                <li><a href="cennik.html">Cennik</a></li>\r\n') +
    '                                <li aria-current="page">' + esc(k.okruszek) + '</li>',
    '                            </ol>',
    '                        </nav>',
    '                        <p class="article-kicker">' + esc(k.kicker) + '</p>',
    '                        <h1 class="article-title">' + esc(k.h1) + '</h1>',
    '                        <p class="article-lead">' + esc(k.lead) + '</p>',
    '                    </header>',
    '',
    '                    <aside class="article-summary" aria-labelledby="zastrzezenie">',
    '                        <h2 id="zastrzezenie" class="article-summary_title">Zanim zajrzysz do cennika</h2>',
    '                        <ul>',
    '                            <li><strong>Podane ceny są orientacyjne.</strong> Ostateczny koszt leczenia ustalamy po badaniu i przedstawieniu planu leczenia.</li>',
    '                            <li>Część zabiegów wyceniana jest widełkowo — końcowa kwota zależy od zakresu pracy.</li>',
    '                            <li>Masz pytanie o konkretny zabieg? <a href="tel:+48814580029">Zadzwoń: 81 458 00 29</a> — chętnie wyjaśnimy.</li>',
    '                        </ul>',
    '                    </aside>',
    blokSpisu,
    '',
    '                    <div class="article-body">',
    sekcje,
    '',
    '                        <p class="cennik-przelacznik"><a href="' + k.dodatkowy.href + '">' + esc(k.dodatkowy.tekst) + '</a></p>',
    '',
    '                        <p class="article-disclaimer">Cennik ma charakter informacyjny i nie stanowi oferty w rozumieniu przepisów Kodeksu cywilnego. Plan leczenia oraz jego koszt ustalamy indywidualnie po badaniu.</p>',
    '                    </div>',
    '',
    '                    <aside class="article-cta">',
    '                        <h2 class="article-cta_title">Masz pytanie o koszt leczenia?</h2>',
    '                        <p class="article-cta_text">Najprościej zapytać wprost. Powiedz, co Cię boli albo co chcesz zrobić — podpowiemy, czego się spodziewać i umówimy termin.</p>',
    '                        <div class="article-cta_actions">',
    '                            <a href="tel:+48814580029" class="article-cta_button">Zadzwoń: 81 458 00 29</a>',
    '                            <a href="service.html" class="article-cta_link">Zobacz zakres usług</a>',
    '                        </div>',
    '                    </aside>',
    '                </article>',
    '            </main>',
    stopka,
    '        </div>',
    skrypty,
    '    </body>',
    '</html>',
    ''
  ].join('\r\n').replace(/(\r\n){3,}/g, '\r\n\r\n');

  fs.writeFileSync(path.join(REPO, k.plik), strona, 'utf8');
  const pozycji = DANE.reduce((a, g) => a + g.pozycje.length, 0);
  console.log('  ' + k.plik.padEnd(34) + (strona.length / 1024).toFixed(1).padStart(6) + ' KB   ' +
    DANE.length + ' kategorii, ' + pozycji + ' pozycji   LF: ' + (strona.match(/(?<!\r)\n/g) || []).length);
  return pozycji;
}

console.log('Generuje strony cennika:\n');
const razem = STRONY.map(zbuduj).reduce((a, b) => a + b, 0);
console.log('\nRazem pozycji na obu stronach: ' + razem);
