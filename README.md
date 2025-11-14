# allesbot

allesbot our beloved

## Belangrijk voor mensen die bij willen contributen

Wij gebruiken deno in dit huishouden, dus installeer alle dependencies met

```bash
deno install
```

## Voor docker

Draai dan deze commands

```bash
docker buildx build -t allesbot;
docker run allesbot;
```

## Allesbot draaien

Draai dan deze commands

```bash
deno run dev
```

## Structuur

Hier een korte samenvatting van wat alle files doen

### `client.ts`

Maakt de client aan

### `collectCommands.ts`

Spreekt voor zich, verzamelt alle exports in `commands/` en filtert alles wat geen command is eruit.

### `customTypes.d.ts`

Alle types staan hierin, plus een paar andere belangrijke dingen

### `db.ts`

Maakt en de database en maakt een paar tabellen

### `env.ts`

Leest de `.env` uit en checkt of alle variables aanwezig zijn. Daarna print het de eerste 5 chars van alle values zodat je kan checken of ze ook kloppen.

### `index.ts`

Vergelijkbaar met `collectCommands.ts`, maar in plaats van commands collect het de events uit `events/`. Daarna logt het ook in zodat mensen allesbot kunnen gebruiken.

### `sigHandler.ts`

Zorgt ervoor dat de database goed afgesloten wordt wanneer nodig, en voorkomt dat data gecorrupt wordt.

### `utils.ts`

Bevat een heleboel functies die kunnen worden geimporteerd door andere files.
