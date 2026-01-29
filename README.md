# Live transcriptie met correcties

Webapp die spraak live transcribeert (als ondertiteling) en automatisch veelvoorkomende fouten corrigeert via een apart correctiebestand.

## Gebruik

**Als je de app opent** (index.html of de root-URL), kom je eerst op de **I-tech / Disciple**-pagina terecht (kies je rol). De basis transcriptie-only pagina staat op `index-basis.html`.

Voor alleen transcriptie (zonder I-tech/Disciple):
1. Open `index-basis.html` in **Chrome** of **Edge** (via een lokale server).
2. Klik op **Start luisteren** en geef microfoontoegang.
3. Praat; de tekst verschijnt live en wordt gecorrigeerd volgens `correcties.json`.
4. Klik op **Stop** om te stoppen.

**Let op:** Spraakherkenning werkt alleen via **https** of **localhost**. Als je het bestand direct opent (`file://`), kan het in sommige browsers niet werken. Start dan een simpele server, bijvoorbeeld:

```bash
# Met Python 3:
python -m http.server 8080
# Open http://localhost:8080
```

## Correcties bestand: `correcties.json`

Bewerk `correcties.json` in deze map. Elk **sleutel** is een fout die de spraakherkennning vaak maakt; de **waarde** is de gewenste correctie. De app laadt het bestand bij het starten van luisteren en past de vervangingen toe vóór de output.

**Voorbeeld:**

```json
{
  "vaak voorkomende fout": "vaak voorkomende correctie",
  "verkeerd gespeld": "juist gespeld",
  "naam van persoon": "Naam van Persoon",
  "afkorting": "uitgeschreven vorm"
}
```

Vervanging is **niet hoofdlettergevoelig**: "Fout" en "fout" worden allebei gecorrigeerd. Na het wijzigen van `correcties.json` de pagina vernieuwen en opnieuw **Start luisteren** klikken.

### Accent: kan de transcriptor “wennen” aan mijn uitspraak?

De **Web Speech API** in de browser ondersteunt geen automatische accent- of sprekeraanpassing: er is geen “train mijn stem” of “leer mijn accent” in de API.

Wat wél werkt: **correcties gebruiken als persoonlijke accent-map**. Als de motor door je accent steeds dezelfde fout maakt (bijv. “ze” i.p.v. “the”, of “merci” i.p.v. “merci bien”), voeg dan in `correcties.json` toe:

- **sleutel** = wat de motor nu schrijft (de fout)
- **waarde** = wat je echt bedoelt (de correctie)

Hoe meer van dit soort regels je toevoegt, hoe meer de **weergave** in de app aan jouw manier van spreken “went”: de motor zelf verandert niet, maar de output wordt na correctie beter. Gebruik dus `correcties.json` actief voor typische accent-fouten; dan wordt de transcriptie gaandeweg beter op jouw stem afgestemd.

### Is JSON het beste?

- **JSON** is hier een goede keuze: de app kan het direct inladen, de structuur is duidelijk (fout → correctie), en het is eenvoudig te parsen. Ideaal voor veel regels en eventueel uitbreiden (bijv. meerdere talen).
- **Alternatief:** een eenvoudig tekstbestand (bijv. `correcties.txt`) met één regel per correctie, bv. `fout => correctie`. Dat is handig om snel in een editor te bewerken; de app zou dan iets meer parsing nodig hebben.

Voor deze app is **JSON** het meest praktisch.

## Bestanden

- `index.html` – **startpagina**: verwijst direct naar de I-tech/Disciple-app (`index-itech-disciple.html`)
- `index-itech-disciple.html` – **hoofdapp**: kies I-tech of Disciple bij het openen (komt als eerste als je de app opent)
- `index-basis.html` – basis: alleen live transcriptie met correcties (zonder I-tech/Disciple)
- `index-vertaling.html` – transcriptie **links** + live **vertaling rechts** (Nederlands, Engels, Fins, Spaans, Portugees)
- `correcties.json` – jouw lijst fout → correctie (gebruikt door transcriptiepagina’s)
- `server.js` + `package.json` – server voor I-tech ↔ Disciple
- `README.md` – deze uitleg

### Twee gebruikers: I-tech en Disciple

**Eén programma** met twee rollen. Bij het openen kies je je rol:

1. **I-tech** – alleen **input** (transcriptie)
   - Ziet hetzelfde als het vertaalprogramma maar **alleen de transcriptie** (geen vertaling).
   - Kiest invoertaal, start luisteren, praat. De transcriptie wordt naar de server gestuurd.
   - Alleen I-tech is verantwoordelijk voor de input.

2. **Disciple** – alleen **output** (vertaling)
   - **Ontvangt** de transcriptie van I-tech en ziet **alleen de vertaling**.
   - Kan de taal van de vertaling kiezen (Nederlands, Engels, Fins, Spaans, Portugees).
   - Kan kiezen of de vertaling wordt voorgelezen.

**Starten (stap voor stap):**

1. **Node.js installeren** (eenmalig)  
   - Ga naar **https://nodejs.org**  
   - Download de **LTS**-versie en installeer (Next, Next, Finish).  
   - Sluit alle terminals/Cursor en open opnieuw.

2. **Server starten**  
   - Dubbelklik in de projectmap op **`start-server.bat`**  
   - Of open een terminal in deze map en typ: `npm install` en daarna `npm start`.

3. **App openen**  
   - In je browser: **http://localhost:3000**  
   - Kies **I-tech** of **Disciple**.

- **I-tech:** klik op "I-tech", kies invoertaal, start luisteren en praat.
- **Disciple:** klik op "Disciple", kies doeltaal en eventueel voorlezen, wacht op transcriptie.

I-tech praat → transcriptie gaat via de server → Disciple ziet de vertaling (en eventueel voorlezen).

### Transcriptie + vertaling (`index-vertaling.html`)

Dezelfde transcriptie als basis, met rechts de vertaling in de gekozen doeltaal:

1. **Invoertaal:** taal van je spraak (standaard Frans).
2. **Vertaling naar:** Nederlands, Engels, Fins, Spaans of Portugees.
3. Start luisteren → links verschijnt de transcriptie (met correcties), rechts de vertaling per segment.

Vertaling gebruikt de gratis MyMemory-API (geen sleutel nodig). Open bv. `http://localhost:8080/index-vertaling.html`.
