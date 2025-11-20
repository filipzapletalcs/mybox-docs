# Configuration History API

## Přehled

Configuration History API umožňuje sledovat historii změn konfigurací (options) zařízení MyBox. Toto API je kritické pro troubleshooting, audit trail a možnost vrácení předchozích nastavení.

## Klíčové koncepty

### Co jsou Options?
Options představují konfigurovatelné parametry zařízení:
- **Systémové**: `reboot`, `reboot-required`, `ota-available`
- **Vlastnické**: `change-owner`
- **Node specifické**: `unit-1-reboot-required`, `unit-1-ota-available`
- **Provozní**: `max-current`, `charging-enabled`, `access-control`

### Typy options podle přístupu
- **Settable (true)**: Lze měnit přes API (např. `reboot`, `change-owner`)
- **Settable (false)**: Pouze pro čtení (např. `reboot-required`, `ota-available`)
- **Retained (true)**: Hodnota se ukládá a přežije restart
- **Retained (false)**: Dočasná hodnota, resetuje se

## Endpointy

### 1. Historie option zařízení

```
GET /external/history/option/{deviceId}/{optionId}
```

Získá historii změn konkrétní konfigurace zařízení.

#### Parametry
- `deviceId` - ID zařízení
- `optionId` - ID konfigurace (např. `reboot-required`, `ota-available`)
- `from` - Začátek období (ISO 8601 formát)
- `to` - Konec období (ISO 8601 formát)

#### Příklad požadavku
```bash
GET /external/history/option/5jwm-0a26-byid-8api/reboot-required?from=2025-09-01T00:00:00Z&to=2025-09-24T23:59:59Z
```

#### Příklad odpovědi

```json
{
  "status": 1,
  "data": [
    {
      "time": "2025-09-15T23:40:18.162Z",
      "value": "false"
    },
    {
      "time": "2025-08-19T19:05:39.171Z",
      "value": "false"
    },
    {
      "time": "2025-08-19T19:05:05.561Z",
      "value": "true"
    },
    {
      "time": "2025-08-13T12:41:34.063Z",
      "value": "false"
    },
    {
      "time": "2025-08-13T12:40:59.859Z",
      "value": "true"
    }
  ],
  "meta": {
    "totalCount": 15
  }
}
```

### 2. Historie option nodu

```
GET /external/history/option/{deviceId}/{nodeId}/{optionId}
```

Získá historii změn konfigurace konkrétního nodu v zařízení.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu (např. `ac-module-1`, `control`)
- `optionId` - ID konfigurace nodu
- `from` - Začátek období
- `to` - Konec období

#### Příklad požadavku
```bash
GET /external/history/option/5jwm-0a26-byid-8api/ac-module-1/max-current?from=2025-09-01T00:00:00Z&to=2025-09-24T23:59:59Z
```

### 3. Aktuální konfigurace zařízení

```
GET /external/live/device/{deviceId}/option
```

Získá všechny aktuální konfigurace zařízení.

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "device": {
      "options": [
        {
          "id": "reboot",
          "name": "Reboot device",
          "value": "false",
          "dataType": "boolean",
          "settable": "true",
          "retained": "false",
          "unit": "#",
          "format": ""
        },
        {
          "id": "reboot-required",
          "name": "Reboot required",
          "value": "false",
          "dataType": "boolean",
          "settable": "false",
          "retained": "true",
          "unit": "#",
          "format": ""
        },
        {
          "id": "ota-available",
          "name": "OTA available",
          "value": "false",
          "dataType": "boolean",
          "settable": "false",
          "retained": "true",
          "unit": "#",
          "format": ""
        },
        {
          "id": "change-owner",
          "name": "Change owner",
          "value": "",
          "dataType": "string",
          "settable": "true",
          "retained": "false",
          "unit": "#",
          "format": ""
        }
      ]
    }
  }],
  "status": 1
}
```

### 4. Konkrétní konfigurace zařízení

```
GET /external/live/device/{deviceId}/option/{optionId}
```

Získá aktuální hodnotu konkrétní konfigurace.

## Příklady použití

### Python - Sledování reboot cyklů

```python
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime, timedelta

# Konfigurace
API_URL = "https://cloud.mybox.pro/admin-panel/v1/external"
API_KEY = "váš_api_klíč"
API_SECRET = "váš_api_secret"

def get_reboot_history(device_id, days_back=30):
    """Získá historii rebootů za posledních N dní"""

    # Časový rozsah
    to_date = datetime.now()
    from_date = to_date - timedelta(days=days_back)

    # API volání
    response = requests.get(
        f"{API_URL}/history/option/{device_id}/reboot-required",
        params={
            'from': from_date.isoformat() + 'Z',
            'to': to_date.isoformat() + 'Z'
        },
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Analyzuj reboot cykly
        reboots = []
        prev_value = None

        for entry in data['data']:
            current_value = entry['value']

            # Detekce reboot cyklu (true -> false znamená reboot)
            if prev_value == 'true' and current_value == 'false':
                reboots.append({
                    'timestamp': entry['time'],
                    'type': 'reboot_completed'
                })
            elif prev_value == 'false' and current_value == 'true':
                reboots.append({
                    'timestamp': entry['time'],
                    'type': 'reboot_required'
                })

            prev_value = current_value

        return {
            'total_reboot_cycles': len([r for r in reboots if r['type'] == 'reboot_completed']),
            'events': reboots,
            'current_state': data['data'][0]['value'] if data['data'] else None
        }

    return None

# Použití
device_id = "5jwm-0a26-byid-8api"
history = get_reboot_history(device_id, 60)

if history:
    print(f"Počet rebootů za 60 dní: {history['total_reboot_cycles']}")
    print(f"Aktuální stav: {'Reboot vyžadován' if history['current_state'] == 'true' else 'OK'}")

    print("\nPosledních 5 událostí:")
    for event in history['events'][:5]:
        print(f"  {event['timestamp']}: {event['type']}")
```

### JavaScript - Sledování OTA aktualizací

```javascript
const axios = require('axios');

const API_URL = 'https://cloud.mybox.pro/admin-panel/v1/external';
const API_KEY = 'váš_api_klíč';
const API_SECRET = 'váš_api_secret';

async function trackOTAUpdates(deviceId) {
    try {
        // Získej historii OTA dostupnosti
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const response = await axios.get(
            `${API_URL}/history/option/${deviceId}/ota-available`,
            {
                params: {
                    from: monthAgo.toISOString(),
                    to: now.toISOString()
                },
                auth: {
                    username: API_KEY,
                    password: API_SECRET
                }
            }
        );

        if (response.data.status === 1) {
            const history = response.data.data;

            // Analyzuj změny
            const otaEvents = [];
            for (let i = 1; i < history.length; i++) {
                if (history[i-1].value === 'false' && history[i].value === 'true') {
                    otaEvents.push({
                        time: history[i].time,
                        event: 'OTA_AVAILABLE'
                    });
                } else if (history[i-1].value === 'true' && history[i].value === 'false') {
                    otaEvents.push({
                        time: history[i].time,
                        event: 'OTA_INSTALLED'
                    });
                }
            }

            return {
                currentState: history[0]?.value,
                events: otaEvents,
                totalCount: history.length
            };
        }
    } catch (error) {
        console.error('Chyba:', error.message);
    }

    return null;
}

// Použití
trackOTAUpdates('5jwm-0a26-byid-8api').then(result => {
    if (result) {
        console.log('OTA Status:', result.currentState === 'true' ? 'Dostupná' : 'Aktuální');
        console.log('Události:');
        result.events.forEach(event => {
            console.log(`  ${event.time}: ${event.event}`);
        });
    }
});
```

### cURL - Získání historie konfigurace

```bash
# Historie reboot-required za posledních 30 dní
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/history/option/5jwm-0a26-byid-8api/reboot-required?from=2025-08-24T00:00:00Z&to=2025-09-24T23:59:59Z" \
  -u "váš_api_klíč:váš_api_secret" \
  -H "Accept: application/json"
```

## Praktické případy použití

### 1. Audit Trail pro compliance

```python
def generate_configuration_audit_report(device_id, option_ids):
    """Generuje audit report změn konfigurací"""

    audit_entries = []

    for option_id in option_ids:
        response = requests.get(
            f"{API_URL}/history/option/{device_id}/{option_id}",
            params={
                'from': '2025-01-01T00:00:00Z',
                'to': datetime.now().isoformat() + 'Z'
            },
            auth=HTTPBasicAuth(API_KEY, API_SECRET)
        )

        if response.status_code == 200:
            data = response.json()

            for i in range(1, len(data['data'])):
                if data['data'][i-1]['value'] != data['data'][i]['value']:
                    audit_entries.append({
                        'timestamp': data['data'][i-1]['time'],
                        'option': option_id,
                        'old_value': data['data'][i]['value'],
                        'new_value': data['data'][i-1]['value']
                    })

    # Seřaď podle času
    audit_entries.sort(key=lambda x: x['timestamp'], reverse=True)

    return audit_entries

# Použití
critical_options = ['change-owner', 'max-current', 'charging-enabled']
audit = generate_configuration_audit_report('5jwm-0a26-byid-8api', critical_options)

print("Audit Log konfiguračních změn:")
for entry in audit[:10]:
    print(f"{entry['timestamp']}: {entry['option']} změněno z '{entry['old_value']}' na '{entry['new_value']}'")
```

### 2. Detekce problémů

```python
def detect_frequent_reboots(device_id):
    """Detekuje časté rebooty, které mohou indikovat problém"""

    response = requests.get(
        f"{API_URL}/history/option/{device_id}/reboot-required",
        params={
            'from': (datetime.now() - timedelta(days=7)).isoformat() + 'Z',
            'to': datetime.now().isoformat() + 'Z'
        },
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Počet reboot cyklů
        reboot_count = 0
        for i in range(1, len(data['data'])):
            if data['data'][i]['value'] == 'false' and data['data'][i-1]['value'] == 'true':
                reboot_count += 1

        # Varování při více než 3 rebootech za týden
        if reboot_count > 3:
            return {
                'status': 'warning',
                'message': f'Detekováno {reboot_count} rebootů za posledních 7 dní',
                'reboot_count': reboot_count
            }

        return {
            'status': 'ok',
            'reboot_count': reboot_count
        }

    return None
```

### 3. Rollback konfigurace

```python
def get_previous_configuration_value(device_id, option_id):
    """Získá předchozí hodnotu konfigurace pro možný rollback"""

    response = requests.get(
        f"{API_URL}/history/option/{device_id}/{option_id}",
        params={
            'from': (datetime.now() - timedelta(days=30)).isoformat() + 'Z',
            'to': datetime.now().isoformat() + 'Z'
        },
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        if len(data['data']) >= 2:
            # Najdi předchozí odlišnou hodnotu
            current = data['data'][0]['value']

            for entry in data['data'][1:]:
                if entry['value'] != current:
                    return {
                        'previous_value': entry['value'],
                        'changed_at': data['data'][0]['time'],
                        'previous_at': entry['time']
                    }

    return None

# Použití
rollback_info = get_previous_configuration_value('5jwm-0a26-byid-8api', 'max-current')
if rollback_info:
    print(f"Předchozí hodnota: {rollback_info['previous_value']}")
    print(f"Změněno: {rollback_info['changed_at']}")
```

## Běžné konfigurace podle typu zařízení

### Nabíjecí stanice
- `max-current` - Maximální nabíjecí proud
- `charging-enabled` - Povolení/zakázání nabíjení
- `access-control` - Režim přístupu
- `reboot` - Vzdálený restart
- `reboot-required` - Indikace nutnosti restartu
- `ota-available` - Dostupnost firmware aktualizace

### DLM moduly (ARM Unit, AC Sensor)
- `dlm-enabled` - Aktivace DLM
- `group-assignment` - Přiřazení do skupiny
- `load-limit` - Limit zatížení
- `priority` - Priorita v rámci skupiny

### Společné systémové
- `change-owner` - Změna vlastníka
- `factory-reset` - Tovární nastavení
- `debug-mode` - Debug režim

## Best practices

1. **Časové rozsahy**: Používejte rozumné časové rozsahy (max 3-6 měsíců) pro lepší výkon

2. **Cachování**: Historie se nemění, můžete cachovat starší data

3. **Detekce změn**: Porovnávejte hodnoty mezi záznamy pro detekci skutečných změn

4. **Audit**: Ukládejte důležité změny do vlastního audit logu s kontextem

5. **Alerting**: Nastavte upozornění na kritické změny (change-owner, factory-reset)

## Chybové stavy

- **404 Not Found** - Option neexistuje nebo špatné ID
- **401 Unauthorized** - Chybná autentizace
- **403 Forbidden** - Nemáte oprávnění k této konfiguraci
- **500 Internal Server Error** - Chyba serveru

## Omezení

- Historie je dostupná maximálně 1 rok zpětně
- Některé options nemusí mít historii (nezachované hodnoty)
- Node-level options jsou dostupné pouze pro některé typy zařízení

## Shrnutí

Configuration History API poskytuje kompletní audit trail všech změn konfigurací. Je nezbytné pro:
- Troubleshooting problémů
- Compliance a audit
- Detekci neautorizovaných změn
- Rollback na předchozí konfigurace
- Analýzu vzorců chování zařízení