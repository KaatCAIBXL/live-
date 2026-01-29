# Live transcriptie met correcties

Webapp die spraak live transcribeert (als ondertiteling) en automatisch veelvoorkomende fouten corrigeert via een apart correctiebestand.

## Gebruik

**Als je de app opent** (index.html of de root-URL), kom je op de **hoofdpagina** terecht: **transcriptie links** + **live vertaling rechts** (`index-vertaling.html`).

1. Kies **invoertaal** (taal van je spraak, standaard Frans) en **vertaling naar** (Nederlands, Engels, Fins, Spaans of Portugees).
2. Optioneel: vink **Vertaling voorlezen** aan.
3. Klik op **Start luisteren** en geef microfoontoegang.
4. Praat; links verschijnt de transcriptie (met correcties uit `correcties.json`), rechts de vertaling per segment.
5. Klik op **Stop** om te stoppen.

**Alleen transcriptie** (zonder vertaling): open `index-basis.html` in **Chrome** of **Edge** (via een lokale server).

**Let op:** Spraakherkenning werkt alleen via **https** of **localhost**. Als je het bestand direct opent (`file://`), kan het in sommige browsers niet werken. Start dan een simpele server:

```bash
# Met Python 3:
python -m http.server 8080
# Open http://localhost:8080
```

**Met Node.js:** dubbelklik `start-server.bat` of voer `npm install` en `npm start` uit. Open **http://localhost:3000**.

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

### Accent: kan de transcriptor "wennen" aan mijn uitspraak?

De **Web Speech API** in de browser ondersteunt geen automatische accent- of sprekeraanpassing: er is geen "train mijn stem" of "leer mijn accent" in de API.

Wat wél werkt: **correcties gebruiken als persoonlijke accent-map**. Als de motor door je accent steeds dezelfde fout maakt (bijv. "ze" i.p.v. "the", of "merci" i.p.v. "merci bien"), voeg dan in `correcties.json` toe:

- **sleutel** = wat de motor nu schrijft (de fout)
- **waarde** = wat je echt bedoelt (de correctie)

Hoe meer van dit soort regels je toevoegt, hoe meer de **weergave** in de app aan jouw manier van spreken "went": de motor zelf verandert niet, maar de output wordt na correctie beter. Gebruik dus `correcties.json` actief voor typische accent-fouten; dan wordt de transcriptie gaandeweg beter op jouw stem afgestemd.

### Is JSON het beste?

- **JSON** is hier een goede keuze: de app kan het direct inladen, de structuur is duidelijk (fout → correctie), en het is eenvoudig te parsen. Ideaal voor veel regels en eventueel uitbreiden (bijv. meerdere talen).
- **Alternatief:** een eenvoudig tekstbestand (bijv. `correcties.txt`) met één regel per correctie, bv. `fout => correctie`. Dat is handig om snel in een editor te bewerken; de app zou dan iets meer parsing nodig hebben.

Voor deze app is **JSON** het meest praktisch.

## Bestanden

- `index.html` – **startpagina**: verwijst direct naar de hoofdpagina (`index-vertaling.html`)
- `index-vertaling.html` – **hoofdpagina**: transcriptie links + live vertaling rechts (Nederlands, Engels, Fins, Spaans, Portugees)
- `index-basis.html` – alleen live transcriptie met correcties (zonder vertaling)
- `correcties.json` – jouw lijst fout → correctie (gebruikt door transcriptiepagina's)
- `server.js` + `package.json` – lokale server; root-URL redirect naar `index-vertaling.html`
- `README.md` – deze uitleg

Vertaling gebruikt de gratis MyMemory-API (geen sleutel nodig).
