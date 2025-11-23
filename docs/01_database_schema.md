# Adatbázis Struktúra Terv

Ez a fájl tartalmazza az entitásokat és kapcsolataikat. Az AI-nak ezt kell követnie a migrációk írásakor.

## Fő Táblák

### `Users`
- `id`: UUID
- `username`: string
- `email`: string
- `password_hash`: string
- `level`: integer (default: 1)
- `xp`: integer
- `money_cash`: decimal (Piszkos pénz - rabolható)
- `money_bank`: decimal (Tiszta pénz - védett)
- `credits`: integer (Prémium valuta)
- `health`: integer (0-100%)
- `energy`: integer (Bűntényekhez)
- `nerve`: integer (Komolyabb támadásokhoz/PvP)
- `willpower`: integer (Edzéshez)
- `gang_id`: foreign_key (nullable)
- `prison_release_time`: timestamp
- `hospital_release_time`: timestamp
- `created_at`: timestamp

### `UserStats` (A karakter ereje)
- `user_id`: foreign_key
- `strength`: integer (Sebzés)
- `defense`: integer (Védekezés)
- `agility`: integer (Kitérés/Találati esély)
- `intelligence`: integer (Bűntény sikeresség/Hacking)

### `Crimes` (Bűncselekmények listája)
- `id`: integer
- `name`: string (pl. "Bolti lopás")
- `energy_cost`: integer
- `min_money`: integer
- `max_money`: integer
- `xp_reward`: integer
- `difficulty`: integer (Milyen stat kell hozzá)
- `jail_chance`: percentage
- `jail_time_minutes`: integer

### `Items` (Tárgyak)
- `id`: integer
- `name`: string
- `type`: enum (WEAPON, ARMOR, VEHICLE, CONSUMABLE)
- `effect_stat`: string (melyik statot növeli)
- `effect_value`: integer
- `price`: integer
- `is_tradable`: boolean

### `Inventory`
- `id`: UUID
- `user_id`: foreign_key
- `item_id`: foreign_key
- `equipped`: boolean
- `quantity`: integer

### `Gangs` (Bandák)
- `id`: UUID
- `name`: string
- `leader_id`: foreign_key (User)
- `treasury`: decimal
- `reputation`: integer

### `Properties` (Ingatlanok)
- `id`: integer
- `name`: string
- `cost`: integer
- `happiness_bonus`: integer (Gyorsabb regenerálódást ad)
- `storage_capacity`: integer