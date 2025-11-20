---
id: overview
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

- [GET /external/device](./devices/list) - Seznam všech zařízení
- [GET /external/device/\{id\}](./devices/detail) - Detail zařízení
- [GET /external/device/\{id\}/events](./devices/events) - Historie událostí

### ⚡ Live Data
Aktuální data z nabíjecích stanic v reálném čase.

- [GET /external/live/device/\{deviceId\}](./live/device) - Live data zařízení
- [GET /external/live/device/\{deviceId\}/telemetry](./live/telemetry) - Telemetrická data
- [GET /external/live/device/\{deviceId\}/option](./live/options) - Konfigurace zařízení

### 📊 Historie
Historická data a statistiky.

- [GET /external/history/snapshot/\{deviceId\}](./history/snapshot) - Snapshot stavu
- [GET /external/history/telemetry/\{deviceId\}/\{telemetryId\}](./history/telemetry) - Historie telemetrie
- [GET /external/history/sensor/\{deviceId\}/\{nodeId\}/\{sensorId\}](./history/sensor) - Historie senzorů

### 🔋 Nabíjecí relace
Správa a reporting nabíjecích relací.

- [GET /external/charging-reports/device/\{id\}](./charging/reports) - Reporty nabíjení
- [GET /external/charging-reports/owner/\{email\}](./charging/by-owner) - Relace dle vlastníka

### 👥 Uživatelé a společnosti
Správa uživatelů a organizací.

- [GET /external/user](./users/list) - Seznam uživatelů
- [GET /external/company](./companies/list) - Seznam společností

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

## 🚀 Rychlý start s API Explorerem

import ApiExplorer from '@site/src/components/ApiExplorer';

### Vyzkoušejte seznam vašich zařízení:

<ApiExplorer
  endpoint="/external/device"
  method="GET"
  description="Získá seznam všech vašich nabíjecích stanic"
/>

## 📖 Další zdroje

- [Swagger UI](https://mybox.too-smart-tech.com/admin-panel/swagger/) - Interaktivní dokumentace
- [Postman Collection](/tools/postman) - Připravená kolekce requestů
- [OpenAPI Spec](/openapi) - Stáhnout OpenAPI definici
