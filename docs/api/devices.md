---
id: devices
title: 🔌 Informace o zařízení
sidebar_position: 2
---

# Informace o zařízení

## Získání základních informací o vaší nabíjecí stanici

---

## 📍 Endpoint

```
GET /admin-panel/v1/external/device/{deviceId}
```

### Parametry
- **deviceId** (string, povinný) - Identifikátor vašeho zařízení

import ApiExplorer from '@site/src/components/ApiExplorer';

<ApiExplorer
  endpoint="/external/device/{deviceId}"
  method="GET"
  description="Získá detailní informace o konkrétním zařízení"
  pathParams={[
    {
      name: "deviceId",
      description: "ID zařízení (formát: xxxx-xxxx-xxxx-xxxx)",
      example: "abc1-def2-ghi3-jkl4"
    }
  ]}
/>

---

## 📦 Struktura odpovědi

```json
{
  "status": 1,              // 1 = úspěch, 0 = chyba
  "data": {
    // ... data zařízení
  }
}
```

---

## 🔍 Detailní popis dat

### 1️⃣ **Základní identifikace**

```json
{
  "id": 1234567890123456,
  "identifier": "abc1-def2-ghi3-jkl4",
  "title": "Nabíječka 1",
  "machine_id": "MB2024001",
  "serial_number": "MB-12345"
}
```

| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | Unikátní číselné ID v systému |
| `identifier` | string | Textový identifikátor (používáte v API) |
| `title` | string | Název vaší stanice |
| `machine_id` | string | Výrobní číslo |
| `serial_number` | string | Sériové číslo |

---

### 2️⃣ **Stav zařízení**

```json
{
  "status": "paired",
  "state": "ready",
  "firmware_status": "reflashed",
  "pairing_mode": "wifi"
}
```

#### Co znamenají jednotlivé stavy?

**Status** - Stav párování:
- `new` - Nové, nespárované zařízení
- `pairing` - Probíhá párování
- `paired` ✅ - Úspěšně spárováno
- `free` - Volné k použití

**State** - Aktuální stav:
- `not_connected` - Nepřipojeno k internetu
- `disconnected` - Odpojeno (bylo dříve online)
- `ready` ✅ - Online a připraveno
- `charging` - Právě nabíjí vozidlo

**Firmware Status**:
- `new` - Výchozí firmware
- `flashed` - Firmware nahrán
- `reflashed` - Firmware aktualizován

---

### 3️⃣ **Informace o produktu**

```json
{
  "product": {
    "id": 1682081987312165,
    "title": "MyBox Home",
    "version": "7.3",
    "mcu": "ESP32",
    "status": "production",
    "abbreviation": "17",
    "type": "R"
  }
}
```

| Pole | Význam |
|------|---------|
| `title` | Model nabíječky (Home, Post, Profi...) |
| `version` | Verze produktu |
| `mcu` | Typ procesoru |
| `status` | Výrobní status |

---

### 4️⃣ **Vlastník a společnosti**

```json
{
  "owner": {
    "id": 1234567890123,
    "email": "jan.novak@example.com",
    "first_name": "Jan",
    "last_name": "Novák"
  },
  "companies": [
    {
      "id": 1,
      "title": "EnergyTech s.r.o.",
      "alias": "energytech",
      "color": "#49CC56"
    }
  ]
}
```

---

### 5️⃣ **Firmware a verze**

```json
{
  "firmware_version": "7",
  "firmware_name": "1.6.1-7"
}
```

- **firmware_version** - Číslo verze
- **firmware_name** - Celý název firmware

---

### 6️⃣ **Umístění**

```json
{
  "location": "50.075538 14.437800"
}
```

GPS souřadnice ve formátu: `"latitude longitude"`

---

### 7️⃣ **Časová razítka**

```json
{
  "created": "2023-05-18T07:29:10.000Z",
  "updated": "2025-08-28T19:17:33.000Z"
}
```

- **created** - Kdy bylo zařízení přidáno do systému
- **updated** - Poslední aktualizace

---

## 📊 Kompletní příklad odpovědi

```json
{
  "data": {
    "id": 1234567890123456,
    "identifier": "abc1-def2-ghi3-jkl4",
    "title": "Nabíječka 1",
    "system_title": "Nabíječka 1",
    "user_title": null,
    "site": null,
    "station_id": null,
    "groups": [],
    "companies": [
      {
        "id": 1,
        "title": "EnergyTech s.r.o.",
        "alias": "energytech",
        "color": "#49CC56"
      },
      {
        "id": 1234567890,
        "title": "SmartCharge Solutions",
        "alias": "smartcharge",
        "color": "#AF73FD"
      }
    ],
    "owner": {
      "id": 1234567890123,
      "email": "jan.novak@example.com",
      "first_name": "Jan",
      "last_name": "Novák",
      "color": null
    },
    "product": {
      "id": 1682081987312165,
      "version": "7.3",
      "title": "MyBox Home",
      "mcu": "ESP32",
      "status": "production",
      "icon": "/object-storage/images/b2745661-bbab-403a-92c1-f4d5835130d3.svg",
      "picture": "/object-storage/images/3bb64e41-e06a-4faa-8534-92f88fbe5c53.jpg",
      "vendor_id": 1662021924396355,
      "production_build": null,
      "updated": "2025-06-18T07:05:08.000Z",
      "created": "2025-06-18T07:05:08.000Z",
      "is_approved": true,
      "is_show_market": true,
      "abbreviation": "17",
      "type": "R"
    },
    "batch": {
      "id": 1684394950737103,
      "name": "Production_09",
      "labels": [],
      "created": "2023-05-18T07:29:10.000Z",
      "updated": "2023-05-18T07:29:10.000Z",
      "deleted": null
    },
    "connectors": null,
    "tariffs": [],
    "linked_devices": [],
    "status": "paired",
    "state": "ready",
    "firmware_status": "reflashed",
    "pairing_mode": "wifi",
    "serial_number": "MB-12345",
    "license": "0000000000",
    "machine_id": "MB2024001",
    "owner_id": 1234567890123,
    "firmware_version": "7",
    "firmware_name": "1.6.1-7",
    "location": "50.075538 14.437800",
    "color": "#989898",
    "build_status": "ready",
    "code_url": "https://cloud.mybox.pro/object-storage/qr-codes/abc1-def2-ghi3-jkl4.png",
    "labels": [],
    "additional": [],
    "deleted": null,
    "created": "2023-05-18T07:29:10.000Z",
    "updated": "2025-08-28T19:17:33.000Z"
  },
  "status": 1
}
```

---

## 💡 Praktické využití těchto dat

### 1. **Kontrola dostupnosti**
Zkontrolujte `state`:
- `ready` = Zařízení je online ✅
- `disconnected` = Zařízení je offline ❌

### 2. **Identifikace modelu**
Z `product.title` zjistíte typ nabíječky:
- MyBox Home - domácí nabíječka
- MyBox Post - stojanová, 2 konektory
- MyBox Profi - profesionální

### 3. **Aktuálnost firmware**
Porovnejte `firmware_name` s nejnovější verzí

### 4. **Lokalizace**
GPS souřadnice v `location` můžete použít pro:
- Zobrazení na mapě
- Výpočet vzdálenosti
- Navigaci

---

## 🔗 Související endpointy

- [Live data](./live-data) - Aktuální provozní data
- [Telemetrie](./telemetry) - Detailní měření
- [Snapshot](./snapshot) - Kompletní stav

---

## ❓ Časté dotazy

**Q: Proč je `user_title` null?**  
A: Uživatel si nenastavil vlastní název. Používá se defaultní `title`.

**Q: Co znamená `state: disconnected` vs `not_connected`?**  
A: `disconnected` = bylo online, ale ztratilo spojení  
`not_connected` = ještě nikdy nebylo online

**Q: Mohu změnit název zařízení?**  
A: Ano, ale to vyžaduje POST endpoint (není součástí základního API).