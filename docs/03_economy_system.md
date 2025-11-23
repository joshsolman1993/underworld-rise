# Gazdasági Rendszer és Piac

Ez a dokumentum írja le a játék pénzügyi áramlását (Money Flow). A cél egy stabil gazdaság fenntartása, elkerülve a hiperinflációt.

## 1. Pénznemek

### A. Készpénz (Dirty Money)
- **Forrás:** Bűntények, rablások, utcai harcok.
- **Tulajdonság:** Bármikor ellopható PvP során (ha a játékos kikap), nem kamatozik.
- **Felhasználás:** Drog vásárlás, feketepiaci tranzakciók, kenőpénz.

### B. Bankszámla (Clean Money)
- **Forrás:** Munkabér, "Tisztára mosott" készpénz, Tőzsdei nyereség.
- **Tulajdonság:** Védett (nem lopható), napi kamatot hoz (pl. 0.05% - alacsony legyen!).
- **Felhasználás:** Ingatlan vásárlás, Bolti vásárlás, Részvények.

### C. Kreditek (Premium Currency)
- **Forrás:** Valós pénz (jövőbeli terv), ritka achievementek, napi login bónusz (nagyon kevés).
- **Felhasználás:** Energia utántöltés (limitált), Névváltás, VIP státusz (több XP).

## 2. Faucets & Sinks (Bevétel és Kiadás mechanizmusok)

Az AI-nak figyelnie kell az egyensúlyra. A játéknak több pénzt kell kivonnia (Sink), mint amennyit termel (Faucet), ahogy a játékosok gazdagodnak.

### Faucets (Honnan jön a pénz a rendszerbe?)
1.  **Bűntények:** A legfőbb forrás.
2.  **NPC Munkák:** Fix, inflációmentes bevétel.
3.  **Eladott tárgyak NPC-nek:** A talált tárgyak bolti eladási ára (alacsony).

### Sinks (Hova tűnik el a pénz végleg?)
1.  **Pénzmosás díja:** A készpénz 20-40%-a eltűnik, amikor bankba rakják.
2.  **Adók:** Piaci eladások után 5% "Market Tax".
3.  **Kórház/Börtön kivásárlás:** Drága azonnali gyógyulás.
4.  **Szerencsejáték (Casino):** Hosszú távon a ház mindig nyer (House Edge: 5%).
5.  **Ingatlan fenntartás:** Napi költség a luxuslakásokra.

## 3. Piac (Marketplace)
Játékosok közötti kereskedelem.
- A játékosok listázhatnak tárgyakat (fegyver, páncél, gyógyszer).
- **Dinamika:** Ha valaki felrak egy tárgyat 1000$-ért, a vevő 1000$-t fizet, de az eladó csak 950$-t kap (5% adó kivonása a gazdaságból).

## 4. Dinamikus Feketepiac (Drog kereskedelem)
Ez egy mini-tőzsde.
- **Termékek:** Fű, Kokain, Speed, stb.
- **Mechanika:** Az árak 4 óránként változnak véletlenszerűen +/- 15%-kal.
- **Cél:** "Buy low, sell high". A játékosok utazhatnak a városrészek között, ahol eltérőek az árak (arbitrázs lehetőség).