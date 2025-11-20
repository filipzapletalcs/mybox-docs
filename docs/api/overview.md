---
id: api-overview
title: 📚 API Reference
sidebar_position: 1
---

# API Reference

Kompletní přehled všech dostupných endpointů MyBox API.

## 🌐 Základní informace

- **Base URL:** `https://cloud.mybox.pro/admin-panel/v1`
- **Protokol:** HTTPS (povinné)
- **Autentizace:** Basic Auth
- **Formát:** JSON
- **Rate Limit:** 100 požadavků/minuta

## 📋 Kategorie endpointů

### 🔌 Zařízení (Devices)
Správa a monitoring nabíjecích stanic.

- [GET /external/device](./devices) - Seznam všech zařízení
- [GET /external/device/\{id\}](./devices) - Detail zařízení
- [GET /external/device/\{id\}/events](./device-events) - Historie událostí

### ⚡ Live Data
Aktuální data z nabíjecích stanic v reálném čase.

- [GET /external/live/device/\{deviceId\}](./live-data) - Live data zařízení
- [GET /external/live/device/\{deviceId\}/telemetry](./telemetry) - Telemetrická data
- [GET /external/live/device/\{deviceId\}/option](./device-configuration) - Konfigurace zařízení

### 📊 Historie
Historická data a statistiky.

- [GET /external/history/snapshot/\{deviceId\}](./snapshot) - Snapshot stavu
- [GET /external/history/telemetry/\{deviceId\}/\{telemetryId\}](./historical-data) - Historie telemetrie
- [GET /external/history/sensor/\{deviceId\}/\{nodeId\}/\{sensorId\}](./advanced-historical-data) - Historie senzorů

### 🔋 Nabíjecí relace
Správa a reporting nabíjecích relací.

- [GET /external/charging-reports/device/\{id\}](./charging-reports) - Reporty nabíjení
- [GET /external/charging-reports/owner/\{email\}](./charging-reports) - Relace dle vlastníka

### 👥 Uživatelé a společnosti
Správa uživatelů a organizací.

- [GET /external/user](./users-management) - Seznam uživatelů
- [GET /external/company](./companies-management) - Seznam společností

## 🔐 Autentizace

Všechny požadavky vyžadují Basic Authentication:

```bash
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/device" \
  -u "API_KEY:API_SECRET" \
  -H "Accept: application/json"
```

## 📝 Formát odpovědi

Všechny odpovědi mají jednotný formát:

```json
{
  "status": 1,  // 1 = úspěch, 0 = chyba
  "data": {     // Data odpovědi
    // ...
  },
  "error": null // Chybová zpráva (pokud status = 0)
}
```

## ⚠️ Chybové kódy

| Kód | Význam | Řešení |
|-----|--------|--------|
| 400 | Bad Request | Zkontrolujte formát požadavku |
| 401 | Unauthorized | Ověřte API credentials |
| 403 | Forbidden | Nemáte oprávnění k této akci |
| 404 | Not Found | Zařízení nebo endpoint neexistuje |
| 429 | Too Many Requests | Překročen rate limit |
| 500 | Internal Server Error | Chyba serveru, zkuste později |

## 🚀 Rychlý start

### Příklad - získání seznamu zařízení:

```bash
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/device" \
  -u "YOUR_API_KEY:YOUR_API_SECRET" \
  -H "Accept: application/json"
```

### Příklad odpovědi:

```json
{
  "status": 1,
  "data": [
    {
      "id": 1234567890,
      "deviceId": "device-xxx-xxx",
      "name": "MyBox Home Station 1",
      "type": "AC",
      "status": "online"
    }
  ]
}
```

## 📖 Další zdroje

- **API Base URL:** `https://cloud.mybox.pro/admin-panel/v1/external`
- **Dokumentace:** Tato stránka obsahuje kompletní API referenci
- **Podpora:** Pro získání API klíčů kontaktujte MyBox support