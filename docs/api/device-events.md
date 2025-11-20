# 📊 Události zařízení

## Přehled

API pro události zařízení poskytuje historii všech důležitých událostí, které nastaly na nabíjecí stanici. Události zahrnují starty a ukončení nabíjení, chyby, alarmy, změny konfigurace a další významné akce. Tato data jsou klíčová pro diagnostiku, monitoring a analýzu provozu zařízení.

### Hlavní funkce
- Získání kompletní historie událostí zařízení
- Filtrování podle typu události
- Časové filtrování událostí
- Detailní informace o každé události včetně kontextu
- Podpora stránkování pro velké objemy dat

### Typy událostí
- **Nabíjecí události** - start, stop, přerušení nabíjení
- **Chyby a alarmy** - technické problémy, výpadky
- **Konfigurace** - změny nastavení, aktualizace firmware
- **Uživatelské akce** - autorizace, příkazy
- **Systémové události** - restart, údržba, diagnostika

### Use cases
- **Diagnostika problémů** - analýza chyb a jejich příčin
- **Audit trail** - sledování všech akcí na zařízení
- **Preventivní údržba** - identifikace opakujících se problémů
- **Analýza využití** - statistiky nabíjecích relací
- **Compliance** - evidence pro regulační požadavky

---

## 📋 Historie událostí

### Endpoint
```
GET /admin-panel/v1/external/device/{id}/events
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `id` | string | ✅ | ID zařízení (16 znaků hexadecimální) |

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `from` | string | ❌ | Počáteční datum (ISO 8601 formát) |
| `to` | string | ❌ | Koncové datum (ISO 8601 formát) |
| `type` | string | ❌ | Filtr typu události |
| `severity` | string | ❌ | Filtr závažnosti (`info`, `warning`, `error`, `critical`) |
| `limit` | number | ❌ | Počet záznamů na stránku (výchozí: 100, max: 1000) |
| `offset` | number | ❌ | Offset pro stránkování |
| `sort` | string | ❌ | Řazení (`asc` nebo `desc`, výchozí: `desc`) |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "device_name": "Nabíjecí stanice - Hlavní budova",
    "total_events": 1234,
    "events": [
      {
        "id": "evt_20240325_142536_000C1234567890AB",
        "timestamp": "2024-03-25T14:25:36.123Z",
        "type": "charging_started",
        "severity": "info",
        "category": "charging",
        "description": "Nabíjení zahájeno",
        "details": {
          "connector_id": 1,
          "user": "jan.novak@example.com",
          "authorization_method": "rfid",
          "rfid_tag": "04:E5:3D:1A:2B:3C",
          "max_power": 11000,
          "energy_meter_start": 15234.56,
          "soc_start": 45,
          "vehicle": {
            "vin": "WVW123456789",
            "brand": "Volkswagen",
            "model": "ID.4"
          }
        },
        "context": {
          "session_id": "sess_20240325_142536",
          "transaction_id": "txn_123456789",
          "tariff": "STANDARD",
          "price_per_kwh": 8.50
        },
        "metadata": {
          "firmware_version": "2.3.4",
          "temperature": 22.5,
          "grid_voltage": 230.5,
          "signal_strength": -65
        }
      },
      {
        "id": "evt_20240325_151823_000C1234567890AB",
        "timestamp": "2024-03-25T15:18:23.456Z",
        "type": "charging_stopped",
        "severity": "info",
        "category": "charging",
        "description": "Nabíjení ukončeno uživatelem",
        "details": {
          "connector_id": 1,
          "user": "jan.novak@example.com",
          "stop_reason": "user_request",
          "energy_meter_end": 15256.78,
          "energy_consumed": 22.22,
          "duration_minutes": 53,
          "soc_end": 80,
          "max_power_reached": 10850
        },
        "context": {
          "session_id": "sess_20240325_142536",
          "transaction_id": "txn_123456789",
          "total_cost": 188.87,
          "currency": "CZK"
        }
      },
      {
        "id": "evt_20240325_090000_000C1234567890AB",
        "timestamp": "2024-03-25T09:00:00.000Z",
        "type": "error_occurred",
        "severity": "error",
        "category": "technical",
        "description": "Chyba komunikace s měřičem energie",
        "details": {
          "error_code": "METER_COMM_ERROR",
          "error_message": "Timeout při čtení dat z měřiče",
          "component": "energy_meter",
          "retry_count": 3,
          "last_successful_read": "2024-03-25T08:59:30.000Z"
        },
        "context": {
          "affected_connectors": [1, 2],
          "service_impact": "degraded",
          "auto_recovery": true
        },
        "resolution": {
          "resolved": true,
          "resolved_at": "2024-03-25T09:02:15.000Z",
          "resolution_type": "automatic",
          "resolution_details": "Komunikace obnovena po restartu modulu"
        }
      },
      {
        "id": "evt_20240324_180000_000C1234567890AB",
        "timestamp": "2024-03-24T18:00:00.000Z",
        "type": "configuration_changed",
        "severity": "warning",
        "category": "configuration",
        "description": "Změna maximálního výkonu",
        "details": {
          "parameter": "max_charging_power",
          "old_value": 22000,
          "new_value": 11000,
          "changed_by": "admin@example.com",
          "change_reason": "Omezení kvůli síťové kapacitě"
        },
        "context": {
          "configuration_version": "1.2.3",
          "backup_created": true,
          "requires_restart": false
        }
      },
      {
        "id": "evt_20240324_030000_000C1234567890AB",
        "timestamp": "2024-03-24T03:00:00.000Z",
        "type": "firmware_updated",
        "severity": "info",
        "category": "maintenance",
        "description": "Firmware aktualizován",
        "details": {
          "old_version": "2.3.3",
          "new_version": "2.3.4",
          "update_duration_seconds": 180,
          "update_source": "ota",
          "changelog": [
            "Oprava chyby v OCPP komunikaci",
            "Vylepšení stability",
            "Přidána podpora pro nové RFID tagy"
          ]
        },
        "context": {
          "initiated_by": "system",
          "scheduled": true,
          "downtime_minutes": 3
        }
      },
      {
        "id": "evt_20240323_140000_000C1234567890AB",
        "timestamp": "2024-03-23T14:00:00.000Z",
        "type": "alarm_triggered",
        "severity": "critical",
        "category": "safety",
        "description": "Detekován únik proudu",
        "details": {
          "alarm_code": "GROUND_FAULT",
          "measured_leakage_ma": 35,
          "threshold_ma": 30,
          "connector_id": 2,
          "immediate_action": "connector_disabled"
        },
        "context": {
          "safety_protocol": "IEC_61851",
          "notification_sent": true,
          "notified_users": ["safety@example.com", "maintenance@example.com"]
        },
        "resolution": {
          "resolved": false,
          "requires_onsite_inspection": true,
          "ticket_id": "TICK-2024-0456"
        }
      }
    ],
    "pagination": {
      "total_records": 1234,
      "current_page": 1,
      "total_pages": 13,
      "limit": 100,
      "offset": 0
    }
  }
}
```

### Struktura dat

#### Event objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | string | Unikátní identifikátor události |
| `timestamp` | string | Čas události (ISO 8601) |
| `type` | string | Typ události |
| `severity` | string | Závažnost (`info`, `warning`, `error`, `critical`) |
| `category` | string | Kategorie události |
| `description` | string | Lidsky čitelný popis |
| `details` | object | Detailní informace specifické pro typ události |
| `context` | object | Kontextové informace |
| `metadata` | object | Dodatečná metadata |
| `resolution` | object | Informace o vyřešení (pokud relevantní) |

#### Typy událostí
| Type | Category | Popis |
|------|----------|-------|
| `charging_started` | charging | Zahájení nabíjení |
| `charging_stopped` | charging | Ukončení nabíjení |
| `charging_interrupted` | charging | Přerušení nabíjení |
| `error_occurred` | technical | Technická chyba |
| `alarm_triggered` | safety | Bezpečnostní alarm |
| `configuration_changed` | configuration | Změna konfigurace |
| `firmware_updated` | maintenance | Aktualizace firmware |
| `device_restarted` | system | Restart zařízení |
| `user_authenticated` | access | Autentizace uživatele |
| `maintenance_performed` | maintenance | Provedena údržba |

### Příklad volání

#### cURL
```bash
# Získání všech událostí za poslední den
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/device/000C1234567890AB/events?from=2024-03-24T00:00:00Z&to=2024-03-25T00:00:00Z" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"

# Filtrování pouze chybových událostí
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/device/000C1234567890AB/events?severity=error&severity=critical" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests
from datetime import datetime, timedelta

def get_device_events(device_id, days_back=7, event_type=None):
    """Získá události zařízení za poslední dny"""

    # Časový rozsah
    date_to = datetime.now()
    date_from = date_to - timedelta(days=days_back)

    # Sestavení URL s parametry
    url = f"https://api.mybox.eco/admin-panel/v1/external/device/{device_id}/events"
    params = {
        'from': date_from.isoformat() + 'Z',
        'to': date_to.isoformat() + 'Z',
        'sort': 'desc',
        'limit': 100
    }

    if event_type:
        params['type'] = event_type

    headers = {
        "Authorization": "Bearer YOUR_API_TOKEN",
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Příklad použití
device_id = "000C1234567890AB"
events = get_device_events(device_id, days_back=7)

# Analýza událostí
event_stats = {}
for event in events['data']['events']:
    event_type = event['type']
    if event_type not in event_stats:
        event_stats[event_type] = 0
    event_stats[event_type] += 1

print("Statistika událostí za posledních 7 dní:")
for event_type, count in sorted(event_stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {event_type}: {count}x")

# Výpis kritických událostí
critical_events = [e for e in events['data']['events'] if e['severity'] == 'critical']
if critical_events:
    print("\n⚠️ Kritické události:")
    for event in critical_events:
        print(f"  [{event['timestamp']}] {event['description']}")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

class DeviceEventMonitor {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.mybox.eco/admin-panel/v1/external';
  }

  async getEvents(deviceId, options = {}) {
    const params = new URLSearchParams({
      from: options.from || new Date(Date.now() - 24*60*60*1000).toISOString(),
      to: options.to || new Date().toISOString(),
      severity: options.severity,
      type: options.type,
      limit: options.limit || 100,
      sort: options.sort || 'desc'
    });

    try {
      const response = await axios.get(
        `${this.baseUrl}/device/${deviceId}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Accept': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events:', error.message);
      throw error;
    }
  }

  async getChargingSessions(deviceId, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const events = await this.getEvents(deviceId, {
      from: from.toISOString(),
      type: 'charging_started'
    });

    // Zpracování nabíjecích relací
    const sessions = [];
    const startEvents = events.events.filter(e => e.type === 'charging_started');

    for (const startEvent of startEvents) {
      const sessionId = startEvent.context.session_id;

      // Najít odpovídající stop událost
      const stopEvent = events.events.find(
        e => e.type === 'charging_stopped' &&
             e.context.session_id === sessionId
      );

      if (stopEvent) {
        sessions.push({
          sessionId,
          start: startEvent.timestamp,
          end: stopEvent.timestamp,
          duration: stopEvent.details.duration_minutes,
          energy: stopEvent.details.energy_consumed,
          cost: stopEvent.context.total_cost,
          user: startEvent.details.user
        });
      }
    }

    return sessions;
  }

  async getErrorAnalysis(deviceId, days = 7) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const events = await this.getEvents(deviceId, {
      from: from.toISOString(),
      severity: 'error'
    });

    // Analýza chyb
    const errorAnalysis = {
      total: 0,
      byType: {},
      byComponent: {},
      unresolved: []
    };

    events.events.forEach(event => {
      if (event.severity === 'error' || event.severity === 'critical') {
        errorAnalysis.total++;

        // Podle typu
        const errorCode = event.details.error_code || 'unknown';
        errorAnalysis.byType[errorCode] = (errorAnalysis.byType[errorCode] || 0) + 1;

        // Podle komponenty
        const component = event.details.component || 'unknown';
        errorAnalysis.byComponent[component] = (errorAnalysis.byComponent[component] || 0) + 1;

        // Nevyřešené
        if (!event.resolution || !event.resolution.resolved) {
          errorAnalysis.unresolved.push({
            id: event.id,
            timestamp: event.timestamp,
            description: event.description,
            code: errorCode
          });
        }
      }
    });

    return errorAnalysis;
  }
}

// Použití
const monitor = new DeviceEventMonitor('YOUR_API_TOKEN');

// Monitoring v reálném čase
async function realtimeMonitoring(deviceId) {
  console.log('🔍 Spouštím monitoring zařízení:', deviceId);

  setInterval(async () => {
    try {
      // Získat události za posledních 5 minut
      const fiveMinutesAgo = new Date(Date.now() - 5*60*1000);
      const events = await monitor.getEvents(deviceId, {
        from: fiveMinutesAgo.toISOString(),
        limit: 10
      });

      // Zkontrolovat kritické události
      const criticalEvents = events.events.filter(e =>
        e.severity === 'critical' || e.severity === 'error'
      );

      if (criticalEvents.length > 0) {
        console.log(`⚠️ Detekováno ${criticalEvents.length} kritických událostí!`);
        criticalEvents.forEach(event => {
          console.log(`  [${event.severity.toUpperCase()}] ${event.description}`);

          // Odeslat notifikaci
          sendAlert({
            device: deviceId,
            event: event
          });
        });
      }
    } catch (error) {
      console.error('Chyba při monitoringu:', error.message);
    }
  }, 60000); // Každou minutu
}

// Spustit monitoring
realtimeMonitoring('000C1234567890AB');
```

---

## 📊 Pokročilé použití

### Analýza trendů poruchovosti
```python
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

def analyze_failure_trends(device_id, months=3):
    """Analyzuje trendy poruchovosti za období"""

    # Získat události
    date_from = datetime.now() - timedelta(days=months*30)
    events = get_device_events(device_id, date_from)

    # Převést na DataFrame
    df = pd.DataFrame(events['data']['events'])
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)

    # Filtrovat chyby
    errors = df[df['severity'].isin(['error', 'critical'])]

    # Denní agregace
    daily_errors = errors.resample('D').size()

    # Týdenní klouzavý průměr
    weekly_avg = daily_errors.rolling(window=7).mean()

    # Vizualizace
    plt.figure(figsize=(12, 6))
    plt.plot(daily_errors.index, daily_errors.values, alpha=0.3, label='Denní počet chyb')
    plt.plot(weekly_avg.index, weekly_avg.values, linewidth=2, label='7-denní průměr')
    plt.xlabel('Datum')
    plt.ylabel('Počet chyb')
    plt.title(f'Trend poruchovosti - {device_id}')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.show()

    # Identifikace problematických komponent
    component_errors = {}
    for _, event in errors.iterrows():
        if 'component' in event.get('details', {}):
            component = event['details']['component']
            if component not in component_errors:
                component_errors[component] = 0
            component_errors[component] += 1

    print("\nNejproblematičtější komponenty:")
    for component, count in sorted(component_errors.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {component}: {count} chyb")

    return daily_errors, weekly_avg
```

### Prediktivní údržba
```javascript
class PredictiveMaintenance {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  async analyzeMaintenanceNeeds(deviceId) {
    const monitor = new DeviceEventMonitor(this.apiToken);

    // Získat události za posledních 90 dní
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const events = await monitor.getEvents(deviceId, {
      from: threeMonthsAgo.toISOString()
    });

    const analysis = {
      deviceId,
      recommendedActions: [],
      riskLevel: 'low',
      nextMaintenanceDate: null
    };

    // Analýza pattern chyb
    const errorPatterns = this.findErrorPatterns(events.events);

    // Kontrola opakujících se chyb
    for (const [errorCode, occurrences] of Object.entries(errorPatterns)) {
      if (occurrences.count > 5) {
        analysis.recommendedActions.push({
          action: 'investigate_recurring_error',
          errorCode,
          occurrences: occurrences.count,
          lastOccurrence: occurrences.lastDate,
          component: occurrences.component,
          priority: occurrences.count > 10 ? 'high' : 'medium'
        });
      }
    }

    // Kontrola době od poslední údržby
    const lastMaintenance = events.events.find(
      e => e.type === 'maintenance_performed'
    );

    if (lastMaintenance) {
      const daysSinceMaintenance = Math.floor(
        (new Date() - new Date(lastMaintenance.timestamp)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceMaintenance > 180) {
        analysis.recommendedActions.push({
          action: 'schedule_routine_maintenance',
          reason: 'No maintenance in 6+ months',
          priority: 'medium'
        });
        analysis.nextMaintenanceDate = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();
      }
    }

    // Určení úrovně rizika
    const criticalErrors = events.events.filter(
      e => e.severity === 'critical' &&
           (!e.resolution || !e.resolution.resolved)
    );

    if (criticalErrors.length > 0) {
      analysis.riskLevel = 'high';
    } else if (analysis.recommendedActions.length > 3) {
      analysis.riskLevel = 'medium';
    }

    return analysis;
  }

  findErrorPatterns(events) {
    const patterns = {};

    events.forEach(event => {
      if (event.severity === 'error' || event.severity === 'critical') {
        const errorCode = event.details?.error_code || 'unknown';

        if (!patterns[errorCode]) {
          patterns[errorCode] = {
            count: 0,
            dates: [],
            component: event.details?.component,
            lastDate: null
          };
        }

        patterns[errorCode].count++;
        patterns[errorCode].dates.push(event.timestamp);
        patterns[errorCode].lastDate = event.timestamp;
      }
    });

    return patterns;
  }
}
```

### Export událostí pro compliance
```python
import csv
import json
from datetime import datetime

def export_events_for_audit(device_id, year, month):
    """Exportuje události pro audit/compliance"""

    # Časový rozsah
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    # Získat všechny události
    all_events = []
    offset = 0
    limit = 1000

    while True:
        response = requests.get(
            f"https://api.mybox.eco/admin-panel/v1/external/device/{device_id}/events",
            headers={"Authorization": "Bearer YOUR_API_TOKEN"},
            params={
                'from': start_date.isoformat() + 'Z',
                'to': end_date.isoformat() + 'Z',
                'limit': limit,
                'offset': offset
            }
        )

        data = response.json()['data']
        all_events.extend(data['events'])

        if len(data['events']) < limit:
            break
        offset += limit

    # Export do CSV
    csv_filename = f"audit_events_{device_id}_{year}_{month:02d}.csv"

    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = [
            'event_id', 'timestamp', 'type', 'severity',
            'category', 'description', 'user', 'resolution_status'
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for event in all_events:
            writer.writerow({
                'event_id': event['id'],
                'timestamp': event['timestamp'],
                'type': event['type'],
                'severity': event['severity'],
                'category': event['category'],
                'description': event['description'],
                'user': event.get('details', {}).get('user', 'system'),
                'resolution_status': 'resolved' if event.get('resolution', {}).get('resolved') else 'open'
            })

    # Export do JSON (pro archivaci)
    json_filename = f"audit_events_{device_id}_{year}_{month:02d}_full.json"
    with open(json_filename, 'w', encoding='utf-8') as jsonfile:
        json.dump({
            'device_id': device_id,
            'period': f"{year}-{month:02d}",
            'exported_at': datetime.now().isoformat(),
            'total_events': len(all_events),
            'events': all_events
        }, jsonfile, indent=2, ensure_ascii=False)

    print(f"Export dokončen:")
    print(f"  CSV: {csv_filename} ({len(all_events)} událostí)")
    print(f"  JSON: {json_filename}")

    return csv_filename, json_filename
```

---

## ⚠️ Chybové stavy

### Možné chybové odpovědi

#### 400 Bad Request
```json
{
  "status": 0,
  "error": "Bad Request",
  "message": "Invalid date format. Use ISO 8601 format."
}
```
**Řešení:** Zkontrolujte formát datumů (YYYY-MM-DDTHH:mm:ss.sssZ).

#### 401 Unauthorized
```json
{
  "status": 0,
  "error": "Unauthorized",
  "message": "Invalid or missing API token"
}
```
**Řešení:** Ověřte správnost API tokenu.

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "Device not found"
}
```
**Řešení:** Zkontrolujte ID zařízení.

#### 429 Too Many Requests
```json
{
  "status": 0,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded"
}
```
**Řešení:** Implementujte rate limiting a exponential backoff.

---

## 💡 Best Practices

### 1. Efektivní stránkování
```python
def get_all_events_paginated(device_id, batch_size=500):
    """Efektivně načte všechny události po dávkách"""
    all_events = []
    offset = 0

    while True:
        response = requests.get(
            f"https://api.mybox.eco/admin-panel/v1/external/device/{device_id}/events",
            headers={"Authorization": "Bearer YOUR_API_TOKEN"},
            params={'limit': batch_size, 'offset': offset}
        )

        batch = response.json()['data']['events']
        if not batch:
            break

        all_events.extend(batch)
        offset += batch_size

        # Progress indication
        print(f"Načteno {len(all_events)} událostí...")

    return all_events
```

### 2. Real-time monitoring s WebSocket (pokud podporováno)
```javascript
class EventStreamMonitor {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.ws = null;
  }

  connect() {
    this.ws = new WebSocket(`wss://api.mybox.eco/stream/device/${this.deviceId}/events`);

    this.ws.onopen = () => {
      console.log('Connected to event stream');
      this.ws.send(JSON.stringify({
        type: 'auth',
        token: 'YOUR_API_TOKEN'
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleEvent(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from event stream');
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };
  }

  handleEvent(event) {
    console.log(`New event: ${event.type} - ${event.description}`);

    // Handle specific event types
    switch(event.severity) {
      case 'critical':
        this.handleCriticalEvent(event);
        break;
      case 'error':
        this.handleErrorEvent(event);
        break;
      default:
        this.logEvent(event);
    }
  }

  handleCriticalEvent(event) {
    // Send immediate notification
    console.error('CRITICAL EVENT:', event);
    // Trigger alerts, notifications, etc.
  }
}
```

### 3. Cachování a optimalizace
```python
from functools import lru_cache
import hashlib

class EventCache:
    def __init__(self):
        self.cache = {}

    @lru_cache(maxsize=100)
    def get_events_cached(self, device_id, date_from, date_to, event_type=None):
        """Cache události pro opakované dotazy"""
        cache_key = hashlib.md5(
            f"{device_id}{date_from}{date_to}{event_type}".encode()
        ).hexdigest()

        if cache_key in self.cache:
            age = time.time() - self.cache[cache_key]['timestamp']
            if age < 300:  # 5 minut cache
                return self.cache[cache_key]['data']

        # Fetch from API
        data = self._fetch_from_api(device_id, date_from, date_to, event_type)
        self.cache[cache_key] = {
            'data': data,
            'timestamp': time.time()
        }

        return data
```

---

## 📚 Další zdroje

- [Live Data API](/api/live-data) - Aktuální stav zařízení
- [Telemetrie](/api/telemetry) - Telemetrická data
- [Konfigurace zařízení](/api/device-configuration) - Nastavení zařízení
- [FAQ - Časté dotazy](/faq#udalosti) - Odpovědi na časté dotazy