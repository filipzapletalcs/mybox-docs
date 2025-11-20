---
id: telemetry  
title: 📈 Telemetrie
sidebar_position: 4
---

# Telemetrie - Historická data

## Získání historických telemetrických dat ze zařízení

---

## 📍 Endpointy

### Telemetrie zařízení
```
GET /admin-panel/v1/external/history/telemetry/{deviceId}/{telemetryId}
```

### Telemetrie konkrétního modulu (node)
```
GET /admin-panel/v1/external/history/telemetry/{deviceId}/{nodeId}/{telemetryId}
```

import ApiExplorer from '@site/src/components/ApiExplorer/ApiExplorer';

<ApiExplorer
  endpoint="/external/history/telemetry/{deviceId}/{telemetryId}"
  method="GET"
  title="Získat historická telemetrická data"
  description="Získejte historii telemetrických dat z vašeho zařízení. Vhodné pro vytváření grafů, analýz a reportů o spotřebě energie."
  requiresAuth={true}
  defaultDeviceId={true}
  parameters={[
    {
      name: "deviceId",
      type: "path",
      required: true,
      description: "Jedinečný identifikátor zařízení (automaticky se načte seznam vašich zařízení)",
      example: "qfeb-od13-ul2c-sgrl"
    },
    {
      name: "telemetryId",
      type: "path",
      required: true,
      description: "ID telemetrie (např. act-power pro výkon, session-energy pro spotřebu)",
      example: "act-power",
      enum: ["act-power", "voltage-l1", "voltage-l2", "voltage-l3", "current-l1", "current-l2", "current-l3", "session-energy", "session-time", "total-energy", "signal"]
    },
    {
      name: "dateFrom",
      type: "query",
      required: false,
      description: "Počáteční datum (formát: YYYY-MM-DD HH:MM:SS)",
      example: "2025-01-01 00:00:00"
    },
    {
      name: "dateTo",
      type: "query",
      required: false,
      description: "Koncové datum (formát: YYYY-MM-DD HH:MM:SS)",
      example: "2025-01-31 23:59:59"
    },
    {
      name: "limit",
      type: "query",
      required: false,
      description: "Maximální počet záznamů (max 10000)",
      example: "1000"
    }
  ]}
  responseExample={{
    "status": 1,
    "data": [
      {
        "timestamp": "2025-01-15 14:30:00",
        "value": 7280.5,
        "unit": "W"
      },
      {
        "timestamp": "2025-01-15 14:31:00",
        "value": 7285.2,
        "unit": "W"
      },
      {
        "timestamp": "2025-01-15 14:32:00",
        "value": 7290.8,
        "unit": "W"
      }
    ]
  }}
/>

---

## 📊 Dostupné telemetrické hodnoty

### ⚡ Elektrické hodnoty

| ID telemetrie | Jednotka | Popis | Modul |
|---------------|----------|-------|-------|
| `act-power` | W | Aktuální výkon | evse |
| `voltage-l1` | V | Napětí fáze L1 | evse |
| `voltage-l2` | V | Napětí fáze L2 | evse |
| `voltage-l3` | V | Napětí fáze L3 | evse |
| `current-l1` | A | Proud fáze L1 | evse |
| `current-l2` | A | Proud fáze L2 | evse |
| `current-l3` | A | Proud fáze L3 | evse |

### 🔋 Nabíjecí relace

| ID telemetrie | Jednotka | Popis | Modul |
|---------------|----------|-------|-------|
| `session-time` | s | Délka nabíjecí relace | evse |
| `session-energy` | kWh | Energie v aktuální relaci | evse |
| `total-energy` | kWh | Celková dodaná energie | evse |

### 📶 Síť a konektivita

| ID telemetrie | Jednotka | Popis | Modul |
|---------------|----------|-------|-------|
| `signal` | % | Síla WiFi signálu | device |
| `wifi-sta-rssi` | dBm | RSSI WiFi | wifi |

---

## 📦 Struktura odpovědi

```json
{
  "status": 1,
  "data": [
    {
      "timestamp": "2024-01-15 14:30:00",
      "value": 7280.5,
      "unit": "W"
    },
    {
      "timestamp": "2024-01-15 14:31:00",
      "value": 7285.2,
      "unit": "W"
    }
  ]
}
```

---

## 💡 Praktické použití

### Získání historie výkonu za posledních 24 hodin

```python
import requests
from datetime import datetime, timedelta

# Časové rozmezí
date_to = datetime.now()
date_from = date_to - timedelta(hours=24)

# API volání
params = {
    'dateFrom': date_from.strftime('%Y-%m-%d %H:%M:%S'),
    'dateTo': date_to.strftime('%Y-%m-%d %H:%M:%S')
}

response = requests.get(
    f"{BASE_URL}/external/history/telemetry/{device_id}/evse/act-power",
    auth=HTTPBasicAuth(API_KEY, API_SECRET),
    params=params
)

data = response.json()['data']
```

### Vytvoření grafu spotřeby

```javascript
// Získání dat
const telemetryData = await fetchTelemetryHistory(deviceId, 'session-energy');

// Příprava pro graf
const chartData = telemetryData.map(point => ({
  x: new Date(point.timestamp),
  y: parseFloat(point.value)
}));

// Vykreslení pomocí Chart.js
new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Spotřeba (kWh)',
      data: chartData
    }]
  }
});
```

---

## 🔄 Agregace dat

Pro dlouhé časové období API automaticky agreguje data:

| Období | Interval dat |
|--------|--------------|
| < 1 den | Každá minuta |
| 1-7 dní | Každých 5 minut |
| 7-30 dní | Každých 15 minut |
| > 30 dní | Každou hodinu |

---

## ⚠️ Limity a omezení

- Maximálně **10 000 záznamů** na jeden požadavek
- Data jsou uchovávána **90 dní**
- Pro starší data kontaktujte podporu

---

## 📈 Doporučené use cases

1. **Monitoring spotřeby** - Sledování denní/měsíční spotřeby
2. **Detekce anomálií** - Identifikace neobvyklých hodnot
3. **Reporty** - Generování přehledů pro fakturaci
4. **Optimalizace** - Analýza nabíjecích vzorců

---

## 🔗 Související endpointy

- [Live Data](./live-data) - Aktuální hodnoty
- [Snapshot](./snapshot) - Kompletní stav
- [Charging Reports](./charging-reports) - Přehledy nabíjení