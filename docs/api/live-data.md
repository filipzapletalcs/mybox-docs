---
id: live-data
title: ⚡ Live Data
sidebar_position: 3
---

# Live Data - Aktuální stav zařízení

## Získání real-time dat z vaší nabíjecí stanice

---

## 📍 Endpoint

```
GET /admin-panel/v1/external/live/device/{deviceId}
```

### Parametry
- **deviceId** (string, povinný) - Identifikátor vašeho zařízení

## 🚀 Interaktivní API Explorer

import ApiExplorer from '@site/src/components/ApiExplorer/ApiExplorer';

<ApiExplorer
  endpoint="/external/live/device/{deviceId}"
  method="GET"
  title="Získat Live Data ze zařízení"
  description="Získejte aktuální real-time data z vaší nabíjecí stanice včetně telemetrie, senzorů a konfigurace. API automaticky načte seznam vašich zařízení."
  requiresAuth={true}
  defaultDeviceId={true}
  parameters={[
    {
      name: "deviceId",
      type: "path",
      required: true,
      description: "Jedinečný identifikátor zařízení (automaticky se načte seznam vašich zařízení)",
      example: "qfeb-od13-ul2c-sgrl"
    }
  ]}
  responseExample={{
    "status": 1,
    "data": [
      {
        "owner": "8fecc345f3ce5304...",
        "device": {
          "id": "qfeb-od13-ul2c-sgrl",
          "name": "MyBox Home",
          "state": "ready",
          "localIp": "192.168.1.23",
          "mac": "7c-df-a1-f3-e1-ac",
          "firmwareVersion": "7",
          "telemetry": [
            {
              "id": "signal",
              "name": "WiFi Signal",
              "value": "84",
              "dataType": "integer",
              "unit": "%"
            },
            {
              "id": "ipw",
              "name": "IP WIFI",
              "value": "192.168.1.23",
              "dataType": "string"
            }
          ],
          "nodes": [
            {
              "id": "evse",
              "name": "EVSE",
              "state": "ready",
              "sensors": [
                {
                  "id": "act-power",
                  "name": "Active Power",
                  "value": "0.00",
                  "dataType": "float",
                  "unit": "kW"
                },
                {
                  "id": "session-energy",
                  "name": "Session Energy",
                  "value": "0.00",
                  "dataType": "float",
                  "unit": "kWh"
                }
              ]
            }
          ]
        }
      }
    ]
  }}
/>

---

## ⚠️ Důležité upozornění

API vrací **pole objektů** - může obsahovat více záznamů pro různé vlastníky nebo stavy zařízení. 
**Aktuální data jsou obvykle v posledním záznamu s nejkompletněji vyplněnými hodnotami.**

---

## 📦 Struktura odpovědi

```json
{
  "data": [
    {
      "owner": "hash_vlastníka",
      "device": {
        "id": "abc1-def2-ghi3-jkl4",
        "name": "MyBox Home",
        "state": "ready",
        "options": [...],
        "telemetry": [...],
        "nodes": [...]
      }
    }
  ]
}
```

---

## 🔍 Hlavní sekce dat

### 1️⃣ **Základní informace o zařízení**

```json
{
  "id": "abc1-def2-ghi3-jkl4",
  "name": "MyBox Home",
  "firmwareName": "1682081987312165",
  "firmwareVersion": "7",
  "state": "ready",
  "localIp": "192.168.1.23",
  "mac": "7c-df-a1-f3-e1-ac",
  "implementation": "esp-idf"
}
```

| Pole | Význam |
|------|---------|
| `state` | Aktuální stav (ready/disconnected) |
| `localIp` | IP adresa v lokální síti |
| `mac` | MAC adresa zařízení |

---

### 2️⃣ **Options - Možnosti ovládání**

```json
"options": [
  {
    "id": "reboot",
    "name": "Reboot device",
    "value": "false",
    "dataType": "boolean",
    "settable": "true"
  },
  {
    "id": "ota-available",
    "name": "OTA available",
    "value": "false",
    "dataType": "boolean",
    "settable": "false"
  }
]
```

**Důležité options:**
- `reboot` - Možnost restartovat zařízení
- `reboot-required` - Zda je potřeba restart
- `ota-available` - Dostupná aktualizace firmware

---

### 3️⃣ **Telemetry - Základní telemetrie**

```json
"telemetry": [
  {
    "id": "signal",
    "name": "WiFi Signal",
    "value": "78",
    "dataType": "integer",
    "unit": "%"
  },
  {
    "id": "fw",
    "name": "Firmware",
    "value": "7",
    "dataType": "string"
  },
  {
    "id": "ipw",
    "name": "IP WIFI",
    "value": "192.168.1.23",
    "dataType": "string"
  }
]
```

**Co najdete v telemetrii:**
- `signal` - Síla WiFi signálu (0-100%)
- `fw` - Verze firmware
- `ipw` - IP adresa přes WiFi
- `ipe` - IP adresa přes Ethernet (pokud připojeno)

---

### 4️⃣ **Nodes - Detailní data modulů**

Každé zařízení má několik modulů (nodes), které obsahují senzory:

#### 🌡️ **Status-control node**
```json
{
  "id": "status-control",
  "sensors": [
    {
      "id": "temp-evse",
      "value": "32.67",
      "unit": "#",
      "format": "-50:200"
    },
    {
      "id": "temp-chip",
      "value": "57.70",
      "unit": "#",
      "format": "-50:200"
    },
    {
      "id": "cloud-mqtt",
      "value": "true"
    }
  ]
}
```

**Klíčové senzory:**
- `temp-evse` - Teplota nabíjecího modulu (°C)
- `temp-chip` - Teplota procesoru (°C)
- `cloud-mqtt` - Připojení ke cloudu
- `wifi-sta` - Stav WiFi připojení

#### 💻 **System node**
```json
{
  "id": "system",
  "sensors": [
    {
      "id": "system-uptime",
      "value": "1024:48:16"  // hodiny:minuty:sekundy
    },
    {
      "id": "system-heap",
      "value": "1910"  // volná paměť v KB
    }
  ]
}
```

#### 📶 **WiFi node**
```json
{
  "id": "wifi",
  "sensors": [
    {
      "id": "wifi-sta-rssi",
      "value": "-61"  // síla signálu v dBm
    },
    {
      "id": "wifi-sta-ssid",
      "value": "MyHomeWiFi"
    }
  ]
}
```

#### ⚡ **EVSE (nabíjecí modul)**
```json
{
  "id": "evse",
  "sensors": [
    {
      "id": "state",
      "value": "3",  // 1=idle, 2=ready, 3=charging
      "name": "State"
    },
    {
      "id": "pp-state",
      "value": "1",  // proximity pilot
      "name": "PP State"
    },
    {
      "id": "lock-state",
      "value": "1",  // 0=unlocked, 1=locked
      "name": "Lock State"
    }
  ],
  "telemetry": [
    {
      "id": "act-power",
      "value": "7280",
      "unit": "W",
      "name": "Actual Power"
    },
    {
      "id": "voltage-l1",
      "value": "231.45",
      "unit": "V"
    },
    {
      "id": "current-l1",
      "value": "31.47",
      "unit": "A"
    }
  ]
}
```

---

## 📊 Klíčové hodnoty pro monitoring

### 🔋 Stav nabíjení

| Senzor | Umístění | Hodnoty |
|--------|----------|---------|
| `state` | evse node | 1=idle, 2=ready, 3=charging |
| `pp-state` | evse node | Proximity pilot status |
| `lock-state` | evse node | 0=odemčeno, 1=zamčeno |

### ⚡ Elektrické hodnoty

| Telemetrie | Jednotka | Popis |
|------------|----------|-------|
| `act-power` | W | Aktuální výkon |
| `voltage-l1/l2/l3` | V | Napětí na fázích |
| `current-l1/l2/l3` | A | Proud na fázích |
| `session-time` | s | Čas nabíjecí relace |
| `session-energy` | kWh | Nabito v aktuální relaci |

### 🌡️ Teploty

| Senzor | Jednotka | Běžné hodnoty |
|--------|----------|---------------|
| `temp-evse` | °C | 20-60°C |
| `temp-chip` | °C | 30-70°C |
| `temp-amb` | °C | okolní teplota |

---

## 💡 Praktické využití

### Kontrola stavu nabíjení
```javascript
// Získání stavu nabíjení
const evseNode = data[0].device.nodes.find(n => n.id === 'evse');
const state = evseNode.sensors.find(s => s.id === 'state');

switch(state.value) {
  case '1': console.log('Idle - čeká'); break;
  case '2': console.log('Ready - připojeno vozidlo'); break;
  case '3': console.log('Charging - nabíjí'); break;
}
```

### Monitoring výkonu
```javascript
// Získání aktuálního výkonu
const evseNode = data[0].device.nodes.find(n => n.id === 'evse');
const power = evseNode.telemetry.find(t => t.id === 'act-power');
console.log(`Aktuální výkon: ${power.value} W`);
```

### Kontrola připojení
```javascript
// Kontrola cloud připojení
const statusNode = data[0].device.nodes.find(n => n.id === 'status-control');
const cloudMqtt = statusNode.sensors.find(s => s.id === 'cloud-mqtt');
if (cloudMqtt.value === 'true') {
  console.log('Připojeno ke cloudu ✅');
}
```

---

## 🔄 Doporučené intervaly obnovování

- **Při nabíjení:** každých 10-30 sekund
- **V klidu:** každých 60-300 sekund
- **Pro grafy:** každých 30-60 sekund

:::tip Optimalizace
Pro snížení zátěže API používejte delší intervaly, když zařízení nenabíjí.
:::

---

## 🔗 Související endpointy

- [Informace o zařízení](./devices) - Základní informace
- [Telemetrie](./telemetry) - Historická telemetrická data
- [Snapshot](./snapshot) - Kompletní stav všech senzorů