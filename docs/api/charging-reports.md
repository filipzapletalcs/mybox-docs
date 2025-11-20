---
id: charging-reports
title: 🔋 Charging Reports
sidebar_position: 6
---

# 7. Charging Reports (Nabíjecí reporty)

## Přehled

Charging Reports API umožňuje získat kompletní přehled o všech nabíjecích relacích vašich stanic - dokončených i probíhajících. Získáte informace o spotřebované energii, době nabíjení a nákladech.

## Základní endpointy

Pro získání charging reportů použijte následující endpointy s vašimi API klíči:

### 1. Reporty pro všechna vaše zařízení

```http
GET /external/charging-reports/device/{deviceId}
```

## 🚀 Interaktivní API Explorer

import ApiExplorer from '@site/src/components/ApiExplorer/ApiExplorer';

<ApiExplorer
  endpoint="/external/charging-reports/device/{deviceId}"
  method="GET"
  title="Získat Charging Reports ze zařízení"
  description="Získejte historii všech nabíjecích relací z vaší stanice - dokončených i probíhajících. Obsahuje informace o spotřebované energii, době nabíjení a nákladech."
  requiresAuth={true}
  defaultDeviceId={true}
  parameters={[
    {
      name: "deviceId",
      type: "path",
      required: true,
      description: "ID vašeho zařízení (automaticky se načte seznam vašich zařízení)",
      example: "abc1-def2-ghi3-jkl4"
    },
    {
      name: "startDate",
      type: "query",
      required: false,
      description: "Počáteční datum a čas (ISO 8601 formát)",
      example: "2025-09-01T00:00:00Z"
    },
    {
      name: "endDate",
      type: "query",
      required: false,
      description: "Koncové datum a čas (ISO 8601 formát)",
      example: "2025-09-30T23:59:59Z"
    },
    {
      name: "order",
      type: "query",
      required: false,
      description: "Řazení výsledků (ASC nebo DESC)",
      example: "DESC"
    },
    {
      name: "limit",
      type: "query",
      required: false,
      description: "Počet záznamů (default: 100)",
      example: "100"
    },
    {
      name: "offset",
      type: "query",
      required: false,
      description: "Posun pro stránkování (default: 0)",
      example: "0"
    }
  ]}
  responseExample={{
    "status": 1,
    "data": [
      {
        "session_id": "077",
        "device_id": "abc1-def2-ghi3-jkl4",
        "device_title": "Nabíječka 1",
        "status": "Finished",
        "energy_delivered": "67.59",
        "duration": "12h 43m 8s",
        "start_time": "2025-08-31T16:35:04.000Z",
        "end_time": "2025-09-01T05:18:12.000Z",
        "cost": "0.00",
        "currency": "EUR",
        "price": "0.00",
        "user_id": "0A896C4E000000",
        "owner": {
          "email": "user@example.com"
        },
        "connector": 1,
        "type": "personal"
      }
    ]
  }}
/>

---

**Parametry:**
- `deviceId` - ID vašeho zařízení (získáte z `/external/device`)
- `startDate` - Počáteční datum a čas (formát: ISO 8601, např. `2025-09-01T00:00:00Z`)
  - Default: aktuální čas minus 1 týden
- `endDate` - Koncové datum a čas (formát: ISO 8601, např. `2025-09-30T23:59:59Z`)
  - Default: aktuální čas
- `order` - Řazení výsledků: `ASC` nebo `DESC` (default: `DESC`)
- `limit` - Počet záznamů (default: 100)
- `offset` - Posun pro stránkování (default: 0)

## 📦 Struktura dat

Každý charging report obsahuje tyto klíčové informace:

```json
{
  "session_id": "077",
  "device_id": "abc1-def2-ghi3-jkl4",
  "device_title": "Nabíječka 1",
  "status": "Finished",
  "energy_delivered": "67.59",
  "duration": "12h 43m 8s",
  "start_time": "2025-08-31T16:35:04.000Z",
  "end_time": "2025-09-01T05:18:12.000Z",
  "cost": "0.00",
  "currency": "EUR",
  "price": "0.00",
  "user_id": "0A896C4E000000",
  "owner": {
    "email": "user@example.com"
  },
  "connector": 1,
  "type": "personal"
}
```

---

## 📊 Popis polí

### Základní informace

| Pole | Typ | Popis |
|------|-----|-------|
| `session_id` | string | Unikátní ID nabíjecí relace |
| `device_id` | string | ID nabíjecí stanice |
| `device_title` | string | Název stanice |
| `status` | string | "Finished" nebo "In Progress" |

### Časové údaje

| Pole | Typ | Popis |
|------|-----|-------|
| `start_time` | ISO 8601 | Začátek nabíjení (UTC) |
| `end_time` | ISO 8601 | Konec nabíjení (UTC, prázdné u "In Progress") |
| `duration` | string | Doba nabíjení (formát: "12h 43m 8s") |

### Energetické údaje

| Pole | Typ | Popis |
|------|-----|-------|
| `energy_delivered` | string | Dodaná energie v kWh |

### Finanční údaje

| Pole | Typ | Popis |
|------|-----|-------|
| `cost` | string | Celkové náklady |
| `currency` | string | Měna (EUR, CZK) |
| `price` | string | Cena za kWh |

### Uživatelské údaje

| Pole | Typ | Popis |
|------|-----|-------|
| `user_id` | string | ID RFID karty nebo uživatele |
| `owner.email` | string | Email vlastníka/uživatele |

### Další informace

| Pole | Typ | Popis |
|------|-----|-------|
| `connector` | number | Číslo konektoru (1 nebo 2) |
| `type` | string | Typ nabíjení (např. "personal") |

---

## Praktické příklady

### 1. Získání reportů za měsíc (CURL)

```bash
# Získání všech nabíjení za září 2025
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/charging-reports/device/abc1-def2-ghi3-jkl4?startDate=2025-09-01T00:00:00Z&endDate=2025-09-30T23:59:59Z" \
  -u "VÁŠ_API_KEY:VÁŠ_API_SECRET" \
  -H "Accept: application/json"
```

### 2. Python - měsíční přehled spotřeby

```python
import requests
from datetime import datetime, timedelta, timezone

# Vaše přihlašovací údaje
API_KEY = "váš_api_key"
API_SECRET = "váš_api_secret"
DEVICE_ID = "váš_device_id"
BASE_URL = "https://cloud.mybox.pro/admin-panel/v1"

# Získání dat za posledních 30 dní
date_to = datetime.now(timezone.utc)
date_from = date_to - timedelta(days=30)

response = requests.get(
    f"{BASE_URL}/external/charging-reports/device/{DEVICE_ID}",
    auth=(API_KEY, API_SECRET),
    params={
        'startDate': date_from.isoformat(),  # ISO 8601 formát
        'endDate': date_to.isoformat()
    }
)

if response.status_code == 200:
    data = response.json()
    reports = data['data']

    # Výpočet statistik
    total_energy = sum(float(r['energy_delivered']) for r in reports)
    total_sessions = len(reports)

    print(f"Celkem nabíjení: {total_sessions}")
    print(f"Celková energie: {total_energy:.2f} kWh")
    print(f"Průměr na nabíjení: {total_energy/total_sessions:.2f} kWh")
```

### 3. Export do CSV

```python
import csv
import requests

def export_charging_reports_to_csv(device_id, filename='nabijeni.csv'):
    """Exportuje charging reporty do CSV souboru"""

    # Získání dat z API
    response = requests.get(
        f"https://cloud.mybox.pro/admin-panel/v1/external/charging-reports/device/{device_id}",
        auth=(API_KEY, API_SECRET),
        params={'limit': 500}
    )

    if response.status_code != 200:
        print("Chyba při získávání dat")
        return

    reports = response.json()['data']

    # Zápis do CSV
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Datum', 'Čas začátku', 'Doba nabíjení', 'Energie (kWh)',
                     'Náklady', 'Měna', 'RFID/Uživatel']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for report in reports:
            writer.writerow({
                'Datum': report['start_time'].split('T')[0],
                'Čas začátku': report['start_time'].split('T')[1].replace('Z', ''),
                'Doba nabíjení': report['duration'],
                'Energie (kWh)': report['energy_delivered'],
                'Náklady': report['cost'],
                'Měna': report['currency'],
                'RFID/Uživatel': report.get('user_id', '')
            })

    print(f"Export dokončen: {filename}")
```


## Stránkování

Pro velké množství dat (více než 100 záznamů) použijte parametr `offset`:

```bash
# První stránka (záznamy 0-99)
curl -X GET "...?limit=100&offset=0"

# Druhá stránka (záznamy 100-199)
curl -X GET "...?limit=100&offset=100"
```



## Důležité informace

- **Časové zóny**: Všechny časy jsou v UTC (přičtěte +1 hod pro zimní čas, +2 hod pro letní čas)
- **Formát dat**: Energie v kWh, náklady v EUR nebo CZK
- **Limity**: Maximum 1000 záznamů na jeden požadavek
- **Probíhající nabíjení**: Status = "In Progress", end_time je prázdné

## Řešení problémů

**Prázdná odpověď?**
- Zkontrolujte správnost device ID
- Ověřte, že v daném období proběhlo nabíjení

**Chyba 401 Unauthorized?**
- Zkontrolujte API klíče
- Ověřte, že používáte správný formát autentizace

## Dostupné exportní formáty

### Pro zákazníky s API klíči (External API)

External API vrací data pouze v **JSON formátu**. Pro export do CSV nebo Excel musíte data zpracovat lokálně (viz příklady výše).

### Poznámka k dalším formátům

Přímý export do CSV/XLSX vyžaduje session autentizaci a není dostupný přes Basic Auth. Endpointy jako:
- `/site/charging-session-reports/csv` - CSV export
- `/site/charging-session-reports/xlsx` - Excel export
- `/site/charging-session-reports/statistics/csv` - Statistiky

Tyto funkce jsou dostupné pouze přes webové rozhraní MyBox Cloud s přihlášením.

## Jak začít?

1. **Získejte ID vašich zařízení:**
   ```bash
   curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/device" \
     -u "VÁŠ_API_KEY:VÁŠ_API_SECRET"
   ```

2. **Stáhněte reporty pro vaše zařízení:**
   ```bash
   curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/charging-reports/device/DEVICE_ID" \
     -u "VÁŠ_API_KEY:VÁŠ_API_SECRET"
   ```

3. **Zpracujte JSON data** - použijte Python/JavaScript příklady výše pro konverzi do CSV/Excel
