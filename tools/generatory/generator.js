/* Generator podstron bloga.
   Pierwszy artykul powstal recznie; przy szesciu to juz nie ma sensu - kazda
   kopia to szansa na rozjazd miedzy spisem tresci a kotwicami, miedzy FAQ
   widocznym a FAQ w danych strukturalnych, albo miedzy tytulem kafla na
   blog.html a <title> podstrony.

   Co jest generowane, a nie przepisywane:
   - <head> z meta, OG, canonical i JSON-LD (BlogPosting + BreadcrumbList + FAQPage),
   - spis tresci - WPROST z naglowkow <h2 id> w tresci, wiec kotwice nie moga sie
     rozjechac z linkami,
   - sekcja FAQ widoczna i blok FAQPage - z JEDNEGO zrodla danych, wiec czytelnik
     i wyszukiwarka zawsze widza to samo,
   - okruszki, metadane, CTA, zastrzezenie i "przeczytaj takze",
   - pasek nawigacji i stopka - wyjmowane z blog.html przy kazdym uruchomieniu.

   Tresc merytoryczna kazdego wpisu siedzi w osobnym pliku tresc/<slug>.html
   i sklada sie wylacznie z <section aria-labelledby="..."> z <h2 id="...">. */
const fs = require('fs');
const path = require('path');

/* Sciezka wyliczana ze scriptu, nie zaszyta na sztywno - generatory leza teraz
   w repo (tools/generatory), wiec dzialaja niezaleznie od tego, gdzie ktos je sklonuje. */
const REPO = path.resolve(__dirname, '..', '..');
const S = __dirname;
const DOMENA = 'https://amicodental.pl';
const DATA = '2026-08-21';
const DATA_PL = '21 sierpnia 2026';

const WPISY = [
  {
    slug: 'jak-prawidlowo-szczotkowac-zeby',
    tytul: 'Jak prawidłowo szczotkować zęby? Kompletny poradnik',
    tytulSeo: 'Jak prawidłowo szczotkować zęby? Poradnik',
    opis: 'Technika Bassa krok po kroku, dwie minuty, których nie warto skracać, i najczęstsze błędy przy szczotkowaniu zębów. Praktyczny poradnik zespołu Amico Dental ze Świdnika.',
    opisOg: 'Technika Bassa krok po kroku, dwie minuty, których nie warto skracać, i najczęstsze błędy przy szczotkowaniu zębów.',
    kicker: 'Profilaktyka i higiena',
    obraz: 4,
    alt: 'Kobieta myjąca zęby szczoteczką przed lustrem w łazience',
    minuty: 7,
    lead: 'Większość z nas szczotkuje zęby od dziecka i jest przekonana, że robi to dobrze. Tymczasem próchnica i stany zapalne dziąseł najczęściej pojawiają się nie dlatego, że ktoś szczotkuje za rzadko, tylko dlatego, że szczotkuje w miejscach, które i tak są czyste. Poniżej znajdziesz technikę, która to zmienia.',
    wSkrocie: [
      'Dwa razy dziennie, po <strong>dwie pełne minuty</strong> — rano i przed snem.',
      'Szczoteczka o <strong>miękkim włosiu</strong>, ustawiona pod kątem <strong>45°</strong> do linii dziąsła.',
      'Krótkie ruchy wymiatające od dziąsła w stronę korony zęba — nie piłowanie na boki.',
      'Szczotkowanie nie sięga między zęby: raz dziennie nić dentystyczna, szczoteczka międzyzębowa lub irygator.',
      'Po szczotkowaniu wypluj pastę, ale <strong>nie płucz ust wodą</strong> — zostaw fluor na zębach.'
    ],
    faq: [
      ['Szczotkować zęby przed śniadaniem czy po nim?', 'Obie opcje mają sens, natomiast jeśli śniadanie było kwaśne — sok, owoce, kawa z cytryną — nie szczotkuj bezpośrednio po nim. Wygodnym rozwiązaniem jest szczotkowanie przed śniadaniem, a po posiłku przepłukanie ust wodą.'],
      ['Ile razy dziennie trzeba szczotkować zęby?', 'Dwa razy: rano i wieczorem, po dwie minuty. Wieczorne szczotkowanie jest ważniejsze, bo w nocy spada wydzielanie śliny, która w ciągu dnia naturalnie oczyszcza zęby i neutralizuje kwasy.'],
      ['Czy szczoteczka soniczna jest lepsza od manualnej?', 'Dobrze używana szczoteczka manualna czyści skutecznie. Elektryczna bywa jednak wygodniejsza i bardziej powtarzalna, a czujnik nacisku i timer pomagają uniknąć dwóch najczęstszych błędów: zbyt mocnego nacisku i zbyt krótkiego czasu.'],
      ['Jak często wymieniać szczoteczkę?', 'Mniej więcej co trzy miesiące, a wcześniej, jeśli włosie się rozchyliło. Szczoteczkę wymienia się także po przebytej infekcji gardła lub jamy ustnej.']
    ],
    powiazane: ['nic-dentystyczna', 'codzienne-nawyki-dla-zebow']
  },
  {
    slug: 'mity-o-zebach',
    tytul: 'Mity o zębach: czego naprawdę potrzebuje Twój uśmiech',
    tytulSeo: 'Mity o zębach — 8 przekonań, które szkodzą',
    opis: 'Krwawiące dziąsła to nie norma, brak bólu to nie zdrowie, a twarda szczoteczka nie czyści lepiej. Osiem powtarzanych mitów o zębach i to, co naprawdę wynika z praktyki stomatologicznej.',
    opisOg: 'Krwawiące dziąsła to nie norma, brak bólu to nie zdrowie, a twarda szczoteczka nie czyści lepiej. Osiem mitów o zębach i fakty.',
    kicker: 'Profilaktyka i higiena',
    obraz: 6,
    alt: 'Lekarz omawiający z pacjentką model uzębienia',
    minuty: 8,
    lead: 'Część przekonań o zębach powtarzamy tak długo, że przestały brzmieć jak opinia, a zaczęły jak wiedza. Problem w tym, że kilka z nich realnie opóźnia leczenie — bo każe czekać na ból, który przy próchnicy przychodzi na końcu, a nie na początku. Oto osiem mitów, na które warto spojrzeć jeszcze raz.',
    wSkrocie: [
      'Krwawiące dziąsła <strong>nie są normą</strong> — to zwykle objaw stanu zapalnego.',
      'Brak bólu nie oznacza zdrowych zębów: <strong>próchnica na wczesnym etapie nie boli</strong>.',
      'Twarda szczoteczka nie czyści lepiej — ściera szkliwo i cofa dziąsła.',
      'Płukanka nie zastąpi nici: nie usuwa mechanicznie płytki spomiędzy zębów.',
      'Zęby mleczne leczy się, bo mają wpływ na zęby stałe i na mowę dziecka.'
    ],
    faq: [
      ['Czy krwawienie dziąseł przy szczotkowaniu jest normalne?', 'Nie. Zdrowe dziąsło nie krwawi przy prawidłowym szczotkowaniu. Krwawienie zwykle oznacza stan zapalny wywołany płytką nazębną. Przy rozpoczynaniu nitkowania krwawienie przez kilka pierwszych dni bywa spodziewane, ale jeśli utrzymuje się dłużej niż kilkanaście dni, to sygnał do wizyty.'],
      ['Czy jeśli ząb nie boli, na pewno jest zdrowy?', 'Nie. Próchnica na wczesnym etapie nie daje żadnych objawów, a ból pojawia się dopiero wtedy, gdy zmiana sięgnie głębszych warstw zęba. Dlatego przeglądy kontrolne mają sens także wtedy, gdy nic nie dolega.'],
      ['Czy wybielanie zębów niszczy szkliwo?', 'Wybielanie przeprowadzone przez stomatologę lub stomatologa, po ocenie stanu zębów, nie uszkadza szkliwa. Ryzyko wiąże się z preparatami niewiadomego pochodzenia i z domowymi sposobami w rodzaju sody czy soku z cytryny, które działają ściernie lub kwasowo.'],
      ['Czy guma do żucia może zastąpić szczotkowanie?', 'Nie. Guma bez cukru pobudza wydzielanie śliny i pomaga po posiłku poza domem, ale nie usuwa płytki nazębnej. Traktuj ją jako doraźne uzupełnienie, nie zamiennik.']
    ],
    powiazane: ['jak-prawidlowo-szczotkowac-zeby', 'nic-dentystyczna']
  },
  {
    slug: 'nic-dentystyczna',
    tytul: 'Prawda o nici dentystycznej: dlaczego nie warto jej pomijać',
    tytulSeo: 'Nić dentystyczna — jak używać i dlaczego warto',
    opis: 'Szczotkowanie omija powierzchnie między zębami, a to tam próchnica rozwija się najdłużej niezauważona. Jak nitkować krok po kroku, jaką nić wybrać i kiedy lepiej sprawdzi się szczoteczka międzyzębowa.',
    opisOg: 'Szczotkowanie omija powierzchnie między zębami. Jak nitkować krok po kroku, jaką nić wybrać i kiedy lepsza jest szczoteczka międzyzębowa.',
    kicker: 'Profilaktyka i higiena',
    obraz: 5,
    alt: 'Kobieta czyszcząca zęby nicią dentystyczną',
    minuty: 7,
    lead: 'Nitkowanie to etap, który wypada z rutyny najszybciej — jest mniej wygodne niż szczotkowanie i na pierwszy rzut oka mniej spektakularne. Tyle że szczoteczka fizycznie nie wchodzi między zęby, a to właśnie tam próchnica potrafi rosnąć miesiącami, zanim ktokolwiek ją zauważy.',
    wSkrocie: [
      'Szczotkowanie oczyszcza tylko część powierzchni zęba — <strong>przestrzenie międzyzębowe zostają</strong>.',
      'Raz dziennie wystarczy; najlepiej wieczorem, przed szczotkowaniem.',
      'Nić prowadzi się <strong>wzdłuż zęba, literą C</strong> — nie wbija prosto w dziąsło.',
      'Przy szerszych przestrzeniach i pracach protetycznych lepiej sprawdza się szczoteczka międzyzębowa.',
      'Irygator jest dobrym uzupełnieniem, ale nie zastępuje mechanicznego przetarcia powierzchni.'
    ],
    faq: [
      ['Czy nitkować przed szczotkowaniem, czy po nim?', 'Wygodniej przed: nić usuwa resztki spomiędzy zębów, a pasta z fluorem dociera potem w oczyszczone miejsca. Ważniejsze od kolejności jest to, żeby robić to codziennie.'],
      ['Dziąsła krwawią mi przy nitkowaniu — czy przerwać?', 'Zwykle nie. Krwawienie przy rozpoczynaniu nitkowania to najczęściej objaw istniejącego stanu zapalnego, który ustępuje po kilku–kilkunastu dniach regularnego czyszczenia. Jeśli utrzymuje się dłużej, jest obfite lub towarzyszy mu ból, umów wizytę.'],
      ['Irygator zamiast nici — czy to wystarczy?', 'Irygator dobrze radzi sobie z resztkami pokarmu i jest bardzo pomocny przy aparatach ortodontycznych, implantach i mostach. Nie usuwa jednak przylegającej płytki tak skutecznie jak mechaniczne przetarcie powierzchni zęba, dlatego najlepiej używać go jako uzupełnienia.'],
      ['Jaką nić wybrać?', 'Woskowana łatwiej wchodzi w ciasne kontakty i rzadziej się strzępi, niewoskowana daje lepsze czucie. Taśma sprawdza się przy szerszych przestrzeniach. Najlepsza jest ta, po którą faktycznie sięgasz codziennie.']
    ],
    powiazane: ['jak-prawidlowo-szczotkowac-zeby', 'mity-o-zebach']
  },
  {
    slug: 'produkty-szkodzace-zebom',
    tytul: 'Produkty, które po cichu szkodzą zębom — i co jeść zamiast nich',
    tytulSeo: 'Co szkodzi zębom? Produkty i zdrowsze zamienniki',
    opis: 'Nie tylko cukier. Kwaśne napoje, suszone owoce i chrupiące przekąski skrobiowe potrafią szkodzić zębom bardziej, niż się wydaje — a największe znaczenie ma nie ilość, tylko częstotliwość.',
    opisOg: 'Nie tylko cukier. Kwaśne napoje, suszone owoce i przekąski skrobiowe — i to, dlaczego częstotliwość szkodzi bardziej niż ilość.',
    kicker: 'Dieta i profilaktyka',
    obraz: 3,
    alt: 'Model zęba obok słodyczy szkodliwych dla uzębienia',
    minuty: 7,
    lead: 'Przy diecie a zębach niemal zawsze rozmawiamy o cukrze. To prawdziwy, ale niepełny obraz: część produktów uchodzących za zdrowe działa na szkliwo równie mocno, a o wyniku decyduje coś, o czym rzadko się mówi — jak często, a nie jak dużo.',
    wSkrocie: [
      '<strong>Częstotliwość szkodzi bardziej niż ilość</strong> — po każdej przekąsce szkliwo potrzebuje czasu na odbudowę.',
      'Kwas działa nie tylko w słodyczach: soki, napoje gazowane, wino i cytrusy obniżają pH w ustach.',
      'Suszone owoce i chrupiące przekąski skrobiowe przyklejają się do zębów na długo.',
      'Woda po kwaśnym lub słodkim to najprostsza rzecz, jaką możesz zrobić od razu.',
      'Po kwaśnym <strong>odczekaj około 30 minut</strong> ze szczotkowaniem.'
    ],
    faq: [
      ['Co szkodzi zębom bardziej — jedna duża porcja słodyczy czy podjadanie przez cały dzień?', 'Podjadanie. Po każdej porcji cukru lub kwasu pH w jamie ustnej spada na kilkadziesiąt minut i dopiero potem wraca do normy. Sześć małych przekąsek oznacza sześć takich okien, jedna porcja przy posiłku — jedno.'],
      ['Czy soki owocowe są dobrą alternatywą dla napojów gazowanych?', 'Pod względem wpływu na szkliwo różnica bywa mniejsza, niż się wydaje — soki cytrusowe i jabłkowe są kwaśne, a picie ich małymi łykami przez dłuższy czas wydłuża kontakt kwasu z zębami. Woda jest bezpieczniejszym wyborem na co dzień.'],
      ['Czy suszone owoce są bezpieczne dla zębów?', 'Są wartościowe odżywczo, ale lepkie i skoncentrowane w cukry, przez co długo pozostają na powierzchni zębów. Warto jeść je przy posiłku, a nie jako samodzielną przekąskę, i popić wodą.'],
      ['Czy picie przez słomkę pomaga?', 'Przy kwaśnych i słodzonych napojach ogranicza kontakt płynu z przednimi zębami, więc bywa pomocne. Nie zmienia to jednak samego napoju — traktuj to jako drobne ograniczenie ryzyka, nie rozwiązanie.']
    ],
    powiazane: ['codzienne-nawyki-dla-zebow', 'mity-o-zebach']
  },
  {
    slug: 'wybielanie-zebow',
    tytul: 'Wybielanie zębów — jak bezpiecznie rozjaśnić uśmiech',
    tytulSeo: 'Wybielanie zębów — metody i bezpieczeństwo',
    opis: 'Skąd biorą się przebarwienia, czym różni się higienizacja od wybielania, jakie metody są dostępne i dlaczego soda, węgiel i cytryna to zły pomysł. Rzetelne omówienie bez obietnic.',
    opisOg: 'Skąd biorą się przebarwienia, czym różni się higienizacja od wybielania i dlaczego soda, węgiel i cytryna to zły pomysł.',
    kicker: 'Stomatologia estetyczna',
    obraz: 2,
    alt: 'Uśmiechnięta pacjentka na fotelu dentystycznym z rozjaśnionym uśmiechem',
    minuty: 8,
    lead: 'Wybielanie to temat, wokół którego krąży najwięcej obietnic i najwięcej domowych sposobów — z których część realnie uszkadza szkliwo. Poniżej to, co warto wiedzieć, zanim podejmiesz decyzję: skąd biorą się przebarwienia, co da się zrobić, a czego oczekiwać nie ma sensu.',
    wSkrocie: [
      'Przebarwienia dzielą się na <strong>zewnętrzne</strong> (osad z kawy, herbaty, wina, tytoniu) i <strong>wewnętrzne</strong> (w strukturze zęba).',
      'Higienizacja usuwa osad i często sama rozjaśnia uśmiech — to inny zabieg niż wybielanie.',
      'Wybielanie działa na tkanki zęba; <strong>nie zmienia koloru wypełnień, koron i licówek</strong>.',
      'Soda, węgiel aktywny i sok z cytryny nie wybielają — ścierają szkliwo albo je odwapniają.',
      'Nadwrażliwość po zabiegu jest częsta i zwykle przemijająca.'
    ],
    faq: [
      ['Czym różni się higienizacja od wybielania?', 'Higienizacja usuwa kamień i osad nazębny z powierzchni zębów, więc przywraca ich naturalny kolor. Wybielanie działa na tkanki zęba i rozjaśnia go ponad ten naturalny odcień. To dwa różne zabiegi, choć efekt wizualny bywa mylony.'],
      ['Czy wybielanie zadziała na wypełnienia i korony?', 'Nie. Materiały protetyczne i kompozytowe nie zmieniają koloru pod wpływem preparatów wybielających. Jeśli w strefie uśmiechu są wypełnienia, po wybielaniu mogą odróżniać się od rozjaśnionych zębów i wymagać wymiany — to warto omówić przed zabiegiem.'],
      ['Czy soda oczyszczona i węgiel aktywny wybielają zęby?', 'Nie wybielają, tylko ścierają. Mogą chwilowo usunąć część osadu, ale przy regularnym stosowaniu uszkadzają szkliwo, a odsłonięta pod nim zębina jest ciemniejsza — efekt bywa więc odwrotny od zamierzonego. Sok z cytryny dodatkowo odwapnia szkliwo.'],
      ['Jak długo utrzymuje się efekt wybielania?', 'To zależy przede wszystkim od diety i nawyków — kawa, herbata, czerwone wino i tytoń przyspieszają powrót przebarwień. Trwałość efektu jest kwestią indywidualną i ocenia ją stomatolog po zbadaniu stanu zębów.']
    ],
    powiazane: ['mity-o-zebach', 'produkty-szkodzace-zebom']
  },
  {
    slug: 'codzienne-nawyki-dla-zebow',
    tytul: '5 codziennych nawyków, które chronią Twój uśmiech na lata',
    tytulSeo: '5 nawyków, które chronią zęby na lata',
    opis: 'Pięć rzeczy, które robi się codziennie i które w perspektywie lat decydują o stanie zębów bardziej niż pojedyncze zabiegi. Konkretnie, bez ogólników.',
    opisOg: 'Pięć codziennych nawyków, które w perspektywie lat decydują o stanie zębów bardziej niż pojedyncze zabiegi.',
    kicker: 'Profilaktyka i higiena',
    obraz: 1,
    alt: 'Szczoteczka do zębów, nić dentystyczna i model szczęki',
    minuty: 6,
    lead: 'O stanie zębów po dwudziestu latach nie decydują pojedyncze zabiegi, tylko to, co robisz codziennie przez te dwadzieścia lat. Dobra wiadomość jest taka, że lista jest krótka i żaden punkt nie wymaga specjalnego wysiłku — wymaga tylko powtarzalności.',
    wSkrocie: [
      'Dwa razy dziennie po dwie minuty — wieczorne szczotkowanie jest ważniejsze.',
      'Raz dziennie przestrzenie międzyzębowe: nić, szczoteczka międzyzębowa lub irygator.',
      'Ogranicz <strong>częstotliwość</strong> słodkich i kwaśnych przekąsek, nie tylko ich ilość.',
      'Woda zamiast napojów słodzonych — także po kawie i po kwaśnym posiłku.',
      'Regularne przeglądy, również wtedy, gdy nic nie boli.'
    ],
    faq: [
      ['Jak często chodzić na przegląd, jeśli nic mi nie dolega?', 'Częstotliwość dobiera się indywidualnie — zależy od stanu zębów i dziąseł, historii próchnicy i nawyków. Zasada ogólna jest taka, że przegląd ma sens także przy braku objawów, bo wczesna próchnica nie boli, a wykryta wcześnie wymaga mniejszego leczenia.'],
      ['Czy płukanka jest potrzebna, jeśli szczotkuję i nitkuję?', 'Przy dobrej higienie zwykle nie jest konieczna. Bywa zalecana w konkretnych sytuacjach — na przykład przy stanach zapalnych dziąseł lub po zabiegach — i wtedy warto stosować ją zgodnie z zaleceniem, a nie zaraz po szczotkowaniu, żeby nie spłukiwać fluoru z pasty.'],
      ['Czy zaciskanie zębów w nocy trzeba leczyć?', 'Warto je zgłosić. Bruksizm potrafi ścierać szkliwo, powodować pękanie wypełnień, bóle mięśni i głowy. Stomatolog ocenia zużycie zębów i może zaproponować szynę ochronną.'],
      ['Czy dzieci potrzebują tych samych nawyków?', 'Tak, w wersji dostosowanej do wieku — z pastą z fluorem w ilości dobranej do wieku dziecka i z pomocą osoby dorosłej przy szczotkowaniu tak długo, jak to potrzebne. Szczegóły warto ustalić na wizycie.']
    ],
    powiazane: ['jak-prawidlowo-szczotkowac-zeby', 'produkty-szkodzace-zebom']
  }
];

// ---------------------------------------------------------------- narzedzia

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bezZnacznikow = (s) => s.replace(/<[^>]*>/g, '');
const tytulSlug = (slug) => (WPISY.find(w => w.slug === slug) || {}).tytul || slug;

/* Chrome z blog.html - wyjmowane przy kazdym uruchomieniu, nie przepisywane. */
function chrome() {
  const zrodlo = fs.readFileSync(path.join(REPO, 'blog.html'), 'utf8');
  const L = zrodlo.split('\r\n');
  const odNav = L.findIndex(l => l.includes('data-collapse="medium"'));
  const doMain = L.findIndex(l => l.includes('<main class="main-wrapper"'));
  const odFoot = L.findIndex(l => l.includes('<footer class="section_footer"'));
  const doFoot = L.findIndex(l => l.trim() === '</footer>');
  if (odNav < 0 || doMain < 0 || odFoot < 0 || doFoot < 0) throw new Error('nie znalazlem chrome w blog.html');

  const wGore = (t) => t
    .replace(/(href|src)="(?!https?:|tel:|mailto:|#|\/|\.\.)/g, '$1="../')
    .replace(/srcset="([^"]*)"/g, (m, v) => 'srcset="' + v.replace(/(^|,\s*)(?!https?:|\/|\.\.)/g, '$1../') + '"');

  let nav = wGore(L.slice(odNav, doMain).join('\r\n'));
  nav = nav.replace('href="../blog.html" aria-current="page" class="navbar_link w-inline-block w--current"',
    'href="../blog.html" class="navbar_link w-inline-block w--current"');
  nav = nav.replace('<nav role="navigation" class="navbar_menu w-nav-menu">',
    '<nav id="navbar-menu" role="navigation" class="navbar_menu w-nav-menu">');
  nav = nav.replace('<div class="navbar-toggler-button w-nav-button">',
    '<button type="button" class="navbar-toggler-button w-nav-button" aria-label="Otw\u00f3rz menu" aria-controls="navbar-menu" aria-expanded="false">');
  const od = nav.indexOf('<button type="button" class="navbar-toggler-button');
  const wciecie = nav.slice(nav.lastIndexOf('\n', od) + 1).match(/^\s*/)[0];
  const znacznik = '\r\n' + wciecie + '</div>';
  const koniec = nav.indexOf(znacznik, od);
  if (koniec < 0) throw new Error('nie znalazlem zamkniecia hamburgera');
  nav = nav.slice(0, koniec) + '\r\n' + wciecie + '</button>' + nav.slice(koniec + znacznik.length);

  const stopka = wGore(L.slice(odFoot, doFoot + 1).join('\r\n'));

  const blok = (znak) => {
    const i = zrodlo.indexOf(znak);
    if (i < 0) throw new Error('brak bloku ' + znak);
    return zrodlo.slice(zrodlo.lastIndexOf('<script>', i), zrodlo.indexOf('</script>', i) + 9);
  };
  return { nav, stopka, oslona: blok('/* Amico image guard'), pasek: blok('/* Pasek nawigacji:') };
}

// ---------------------------------------------------------------- skladanie

function head(w) {
  const adres = DOMENA + '/blog/' + w.slug + '.html';
  const obrazUrl = DOMENA + '/assets/img/gen_blog-image-' + w.obraz + '.jpg';
  const graf = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': adres + '#article',
        headline: w.tytul,
        description: w.opisOg,
        image: obrazUrl,
        datePublished: DATA,
        dateModified: DATA,
        inLanguage: 'pl-PL',
        articleSection: w.kicker,
        mainEntityOfPage: { '@type': 'WebPage', '@id': adres },
        author: { '@type': 'Organization', '@id': DOMENA + '/#dentist', name: 'Amico Dental' },
        publisher: { '@id': DOMENA + '/#dentist' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Strona główna', item: DOMENA + '/index.html' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: DOMENA + '/blog.html' },
          { '@type': 'ListItem', position: 3, name: w.tytul }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: w.faq.map(([p, o]) => ({ '@type': 'Question', name: p, acceptedAnswer: { '@type': 'Answer', text: o } }))
      }
    ]
  };

  return [
    '<!DOCTYPE html>',
    '<html lang="pl">',
    '    <head>',
    '        <meta charset="utf-8"/>',
    '        <title>' + esc(w.tytulSeo) + ' | Amico Dental Świdnik</title>',
    '        <meta content="' + esc(w.opis) + '" name="description"/>',
    '        <meta content="' + esc(w.tytul) + '" property="og:title"/>',
    '        <meta content="' + esc(w.opisOg) + '" property="og:description"/>',
    '        <meta content="' + obrazUrl + '" property="og:image"/>',
    '        <meta property="og:type" content="article"/>',
    '        <meta property="og:url" content="' + adres + '"/>',
    '        <meta property="og:locale" content="pl_PL"/>',
    '        <meta property="article:published_time" content="' + DATA + '"/>',
    '        <meta property="article:section" content="' + esc(w.kicker) + '"/>',
    /* WERSJA DEMONSTRACYJNA - USUNAC PRZED URUCHOMIENIEM NA DOCELOWEJ DOMENIE.
       Demo stoi pod github.io, a canonical wskazuje na domene klienta, gdzie tych
       adresow nie ma (404). Bez noindex do Google trafilaby kopia strony gabinetu
       z niepotwierdzonym cennikiem. Po przeniesieniu na docelowa domene ten blok
       MUSI zniknac - inaczej strona nie pojawi sie w wyszukiwarce. */
    '        <!-- ===== WERSJA DEMONSTRACYJNA - USUNAC PRZED URUCHOMIENIEM ===== -->',
    '        <meta name="robots" content="noindex, nofollow"/>',
    '        <meta content="width=device-width, initial-scale=1" name="viewport"/>',
    '        <link href="' + adres + '" rel="canonical"/>',
    '        <script type="application/ld+json">',
    JSON.stringify(graf, null, 4).split('\n').map(l => '        ' + l).join('\r\n'),
    '        </script>',
    '        <link href="../assets/fonts/sora-latin.woff2" as="font" type="font/woff2" rel="preload" crossorigin=""/>',
    '        <link href="../assets/fonts/sora-latin-ext.woff2" as="font" type="font/woff2" rel="preload" crossorigin=""/>',
    '        <link href="../assets/css/amico.css?v=20260821m" rel="stylesheet" type="text/css"/>',
    '        <script type="text/javascript">',
    '            !function(o, c) {',
    '                var n = c.documentElement',
    '                  , t = " w-mod-";',
    '                n.className += t + "js",',
    '                ("ontouchstart"in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch")',
    '            }(window, document);',
    '        </script>',
    '        <link href="../assets/img/favicon.svg" rel="shortcut icon" type="image/x-icon"/>',
    '        <link href="../assets/img/webclip.png" rel="apple-touch-icon"/>',
    '    </head>',
    '    <body>',
    '        <a href="#main" class="skip-link">Przejdź do treści</a>',
    '        <div class="page-wrapper">'
  ].join('\r\n');
}

function tresc(w) {
  const sekcje = fs.readFileSync(path.join(S, 'tresc', w.slug + '.html'), 'utf8').replace(/\r\n/g, '\n').trimEnd();

  /* Spis tresci budowany Z naglowkow w tresci - nie z osobnej listy.
     Dzieki temu kotwica i link nie moga sie rozjechac przy edycji tekstu. */
  const pozycje = [...sekcje.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(m => [m[1], m[2]]);
  pozycje.push(['faq', 'Najczęstsze pytania']);

  const faqHtml = w.faq.map(([p, o]) =>
    '                            <h3>' + esc(p) + '</h3>\n' +
    '                            <p>' + esc(o) + '</p>').join('\n\n');

  const powiazane = w.powiazane.map(s =>
    '                            <li>\n' +
    '                                <a href="' + s + '.html" class="article-related_item">\n' +
    '                                    <span class="article-related_item-title">' + esc(tytulSlug(s)) + '</span>\n' +
    '                                    <span class="article-related_item-cta">Czytaj więcej</span>\n' +
    '                                </a>\n' +
    '                            </li>').join('\n');

  return [
    '            <main class="main-wrapper article-page" id="main" tabindex="-1">',
    '                <article class="article">',
    '                    <header class="article-head">',
    '                        <nav class="article-breadcrumb" aria-label="Ścieżka nawigacji">',
    '                            <ol>',
    '                                <li><a href="../index.html">Strona główna</a></li>',
    '                                <li><a href="../blog.html">Blog</a></li>',
    '                                <li aria-current="page">' + esc(w.tytul) + '</li>',
    '                            </ol>',
    '                        </nav>',
    '                        <p class="article-kicker">' + esc(w.kicker) + '</p>',
    '                        <h1 class="article-title">' + esc(w.tytul) + '</h1>',
    '                        <p class="article-lead">' + w.lead + '</p>',
    '                        <!-- TODO: CLIENT CONFIRMATION - podpis autora i data publikacji.',
    '                             Do potwierdzenia, czy wpisy podpisuje konkretny lekarz (imie,',
    '                             nazwisko, tytul zawodowy), czy zbiorczo "Zespol Amico Dental".',
    '                             Ta sama decyzja dotyczy pola "author" w danych strukturalnych. -->',
    '                        <p class="article-meta">',
    '                            <span class="article-meta_item">Zespół Amico Dental</span>',
    '                            <span class="article-meta_sep" aria-hidden="true">·</span>',
    '                            <time class="article-meta_item" datetime="' + DATA + '">' + DATA_PL + '</time>',
    '                            <span class="article-meta_sep" aria-hidden="true">·</span>',
    '                            <span class="article-meta_item">ok. ' + w.minuty + ' min czytania</span>',
    '                        </p>',
    '                    </header>',
    '',
    '                    <figure class="article-figure">',
    '                        <picture>',
    '                            <source type="image/webp" srcset="../assets/img/opt/gen_blog-image-' + w.obraz + '-400w.webp 400w,',
    '                                ../assets/img/opt/gen_blog-image-' + w.obraz + '-800w.webp 800w,',
    '                                ../assets/img/opt/gen_blog-image-' + w.obraz + '-1200w.webp 1200w" sizes="(max-width: 767px) 100vw, (max-width: 991px) 90vw, 760px"/>',
    '                            <img src="../assets/img/gen_blog-image-' + w.obraz + '.jpg" alt="' + esc(w.alt) + '" class="article-figure_image" width="1344" height="752" loading="eager" fetchpriority="high"/>',
    '                        </picture>',
    '                    </figure>',
    '',
    '                    <aside class="article-summary" aria-labelledby="w-skrocie">',
    '                        <h2 id="w-skrocie" class="article-summary_title">W skrócie</h2>',
    '                        <ul>',
    w.wSkrocie.map(p => '                            <li>' + p + '</li>').join('\n'),
    '                        </ul>',
    '                    </aside>',
    '',
    '                    <nav class="article-toc" aria-labelledby="spis-tresci">',
    '                        <h2 id="spis-tresci" class="article-toc_title">Spis treści</h2>',
    '                        <ol>',
    pozycje.map(([id, t]) => '                            <li><a href="#' + id + '">' + esc(t) + '</a></li>').join('\n'),
    '                        </ol>',
    '                    </nav>',
    '',
    '                    <div class="article-body">',
    sekcje,
    '',
    '                        <section class="article-faq" aria-labelledby="faq">',
    '                            <h2 id="faq">Najczęstsze pytania</h2>',
    '',
    faqHtml,
    '                        </section>',
    '',
    '                        <p class="article-disclaimer">Ten artykuł ma charakter informacyjny i nie zastępuje konsultacji stomatologicznej. W razie bólu, krwawienia lub innych niepokojących objawów umów wizytę.</p>',
    '                    </div>',
    '',
    '                    <aside class="article-cta">',
    '                        <h2 class="article-cta_title">Czas na kontrolę?</h2>',
    '                        <p class="article-cta_text">Regularny przegląd i higienizacja pozwalają wychwycić próchnicę zanim zacznie boleć. Zadzwoń i umów dogodny termin.</p>',
    '                        <div class="article-cta_actions">',
    '                            <a href="tel:+48814580029" class="article-cta_button">Zadzwoń: 81 458 00 29</a>',
    '                            <a href="../service.html#profilaktyka" class="article-cta_link">Zobacz zakres profilaktyki</a>',
    '                        </div>',
    '                    </aside>',
    '',
    '                    <section class="article-related" aria-labelledby="powiazane">',
    '                        <h2 id="powiazane" class="article-related_title">Przeczytaj także</h2>',
    '                        <ul class="article-related_list">',
    powiazane,
    '                        </ul>',
    '                        <p class="article-related_note"><a href="../blog.html">Wróć do wszystkich wpisów</a></p>',
    '                    </section>',
    '                </article>',
    '            </main>'
  ].join('\n').replace(/\n/g, '\r\n');
}

// ---------------------------------------------------------------- start

const ch = chrome();
const kat = path.join(REPO, 'blog');
fs.mkdirSync(kat, { recursive: true });

console.log('Generuje ' + WPISY.length + ' podstron:\n');
for (const w of WPISY) {
  const out = [head(w), ch.nav, tresc(w), ch.stopka, '        </div>',
    ch.oslona.replace(/\r\n/g, '\r\n'), ch.pasek, fs.readFileSync(path.join(S, 'artykul-menu.html'), 'utf8').replace(/\r?\n/g, '\r\n').trimEnd(),
    '    </body>', '</html>', ''].join('\r\n').replace(/(\r\n){3,}/g, '\r\n\r\n');

  fs.writeFileSync(path.join(kat, w.slug + '.html'), out, 'utf8');

  const slowa = (bezZnacznikow(fs.readFileSync(path.join(S, 'tresc', w.slug + '.html'), 'utf8')).match(/[A-Za-zĄąĆćĘꣳŃńÓóŚśŹźŻż]{2,}/g) || []).length;
  const h2 = (out.match(/<h2 id="/g) || []).length;
  console.log('  ' + (w.slug + '.html').padEnd(38) + String((out.length / 1024).toFixed(1)).padStart(6) + ' KB   ' +
    String(slowa).padStart(4) + ' slow tresci   ' + h2 + ' sekcji   obraz ' + w.obraz);
}

fs.writeFileSync(path.join(S, 'wpisy.json'), JSON.stringify(WPISY.map(w => ({ slug: w.slug, tytul: w.tytul, obraz: w.obraz })), null, 1));
console.log('\nGotowe.');
