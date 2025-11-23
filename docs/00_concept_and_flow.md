# Project: Underworld Rise - Game Concept

## 1. Áttekintés
Ez egy komplex, böngészőben játszható, körökre osztott (time-based energy system) MMORPG. A téma a szervezett bűnözés. A játékos egy senkiházi bűnözőként kezd, és célja, hogy a város "Keresztapájává" váljon.

## 2. Core Loop (Játékmenet körforgás)
1. **Erőforrás gyűjtés:** A játékosnak van `Energia` (bűntényekhez) és `Akaraterő` (edzéshez). Ezek idővel töltődnek újra.
2. **Cselekvés:** - Bűntények elkövetése (pénz + XP szerzés).
   - Edzés az edzőteremben (statok növelése).
   - Munkavállalás (stabil bevétel).
3. **Fejlődés:** Szintlépés, jobb felszerelés vásárlása, ingatlan bérlés/vétel.
4. **Konfliktus:** PvP támadások más játékosok ellen, vagy bandaháborúk.
5. **Kockázat:** Börtönbe kerülés (időbüntetés) vagy Kórház (időbüntetés).

## 3. Technológiai Irányelvek (AI-nak)
- **Frontend:** React vagy Vue.js (gyors, reaktív UI).
- **Backend:** Node.js (Express/NestJS) vagy Python (Django/FastAPI).
- **Database:** PostgreSQL (relációs adatbázis a komplexitás miatt elengedhetetlen).
- **Security:** JWT Auth, CSRF védelem, Input validation (csalás elleni védelem kritikus).