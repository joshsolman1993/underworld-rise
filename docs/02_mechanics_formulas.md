# Játék Mechanika és Matematika

A "komplexitás" a képletekben rejlik. Az AI kódolónak ezeket kell implementálnia a backend logikába.

## 1. Bűntény Sikeresség (Crime Logic)
Nem fix esély, hanem stat alapú.
$$Chance \% = \left( \frac{\text{User Intelligence} \times 1.5}{\text{Crime Difficulty}} \right) \times 100$$
- Maximum 95% esély (mindig legyen kockázat).
- Ha `Chance` < `Random(0, 100)`, akkor a játékos elbukik.
- Ha elbukik: Újabb dobás a börtönre (`jail_chance`).

## 2. PvP Harcrendszer (Combat System)
Körökre osztott szimuláció a háttérben.
- **Hit Chance (Találat):** $\frac{\text{Attacker Agility}}{\text{Attacker Agility} + \text{Defender Agility}} \times 100$
- **Damage (Sebzés):** $\text{Weapon Damage} + (\text{Attacker Strength} \times 0.5) - (\text{Defender Defense} \times 0.3)$
- **Kritikus találat:** Ha a `Hit Chance` > 90%, akkor 2x sebzés.

## 3. Gazdaság és Pénzmosás
- **Piszkos pénz (Cash):** Bűntényekből jön. Ha megvernek PvP-ben, a nálad lévő Cash 10%-át ellophatják.
- **Tiszta pénz (Bank):** Biztonságos, kamatozik (napi 0.5%).
- **Pénzmosás:** A Cash-t Bankba tenni csak "Pénzmosón" keresztül lehet, aki levesz 20-40% jutalékot (intelligenciától függően csökken a sáp).

## 4. Leveling (Szintlépés)
Szükséges XP a következő szinthez:
$$XP_{next} = 100 \times (\text{Current Level})^2$$