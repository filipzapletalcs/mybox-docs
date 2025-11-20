# Node-level Monitoring API

## Přehled

Node-level monitoring API umožňuje detailní sledování jednotlivých komponent (nodů) v zařízeních MyBox. Toto API je kritické především pro DLM (Dynamic Load Management) systémy, kde potřebujete monitorovat jednotlivé nabíjecí stanice, měřiče a senzory.

## Klíčové koncepty

### Co je Node?
Node představuje logickou komponentu uvnitř zařízení. Například:
- **V ARM Unit**: `groups`, `reports`, `sources`, `dlm-management`, `config`
- **V AC Sensor**: `ac-measurement`, `solar-mgmt`, `ac-module-1`, `ac-module-2` atd.
- **V nabíjecích stanicích**: `1`, `2` (pro jednotlivé nabíjecí body)

### Hierarchie dat
```
Device (zařízení)
├── Node (komponenta)
│   ├── Sensors (senzory - aktuální hodnoty)
│   ├── Telemetry (telemetrie - časové řady)
│   └── Options (konfigurace)
```

## Endpointy

### 1. Stav konkrétního nodu

```
GET /external/live/device/{deviceId}/{nodeId}
```

Získá aktuální stav konkrétního nodu včetně všech senzorů, telemetrií a konfigurací.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu (např. `reports`, `ac-measurement`)

#### Příklad odpovědi - ARM Unit node "reports"

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "node": {
      "id": "reports",
      "name": "reports",
      "state": "ready",
      "sensors": [
        {
          "id": "ac-module-1",
          "name": "ac-module-1",
          "value": "{\"node_state\":\"NODE_IS_CONNECTED\",\"cp_state\":\"A\",\"balanced\":0,\"calc_mode\":\"ACTIVE\",\"ev_meter\":[0,0,0],\"group\":\"left\",\"device_id\":\"pplteplice42\",\"node_id\":\"1\"}",
          "dataType": "string",
          "settable": "false",
          "unit": "#"
        }
        // ... další senzory
      ]
    }
  }],
  "status": 1
}
```

#### Příklad odpovědi - AC Sensor node "ac-measurement"

```json
{
  "data": [{
    "owner": "b70f314...",
    "node": {
      "id": "ac-measurement",
      "name": "ac-measurement",
      "state": "ready",
      "sensors": [
        {
          "id": "ac-current-1",
          "name": "ac-current-1",
          "value": "0.00",
          "dataType": "float",
          "settable": "false",
          "unit": "#"
        },
        {
          "id": "ac-current-2",
          "name": "ac-current-2",
          "value": "1.30",
          "dataType": "float",
          "settable": "false",
          "unit": "#"
        },
        {
          "id": "ac-current-3",
          "name": "ac-current-3",
          "value": "2.53",
          "dataType": "float",
          "settable": "false",
          "unit": "#"
        },
        {
          "id": "ac-phase-connection",
          "name": "ac-phase-connection",
          "value": "L1",
          "dataType": "enum",
          "settable": "true",
          "format": "L1,L2,L3"
        }
      ]
    }
  }],
  "status": 1
}
```

### 2. Stav konkrétního senzoru

```
GET /external/live/device/{deviceId}/{nodeId}/{sensorId}
```

Získá aktuální hodnotu konkrétního senzoru v rámci nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu
- `sensorId` - ID senzoru (např. `ac-current-1`, `ac-module-1`)

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "ef96f29...",
    "sensor": {
      "id": "ac-current-1",
      "name": "ac-current-1",
      "value": "0.00",
      "dataType": "float",
      "settable": "false",
      "retained": "true",
      "unit": "#",
      "format": ""
    }
  }],
  "status": 1
}
```

### 3. Telemetrie nodu

```
GET /external/live/device/{deviceId}/{nodeId}/telemetry
```

Získá všechny telemetrické hodnoty konkrétního nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "node": {
      "telemetry": []  // Většina nodů nemá telemetrii
    }
  }],
  "status": 1
}
```

### 4. Konkrétní telemetrie nodu

```
GET /external/live/device/{deviceId}/{nodeId}/telemetry/{telemetryId}
```

Získá konkrétní telemetrickou hodnotu nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu
- `telemetryId` - ID telemetrie

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "ef96f29...",
    "value": "100"  // Hodnota konkrétní telemetrie
  }],
  "status": 1
}
```

### 5. Konfigurace nodu

```
GET /external/live/device/{deviceId}/{nodeId}/option
```

Získá všechny konfigurační parametry nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "node": {
      "options": []  // Většina nodů nemá konfigurovatelné options
    }
  }],
  "status": 1
}
```

### 6. Konkrétní konfigurace nodu

```
GET /external/live/device/{deviceId}/{nodeId}/option/{optionId}
```

Získá konkrétní konfigurační parametr nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu
- `optionId` - ID konfiguračního parametru

#### Příklad odpovědi

```json
{
  "data": [{
    "owner": "ef96f29...",
    "value": "false"  // Hodnota konkrétní konfigurace
  }],
  "status": 1
}
```

**Poznámka**: Mnoho nodů nemá konfigurovatelné parametry nebo vrací `null` hodnoty.

## Příklady použití

### Python - Monitoring ARM Unit

```python
import requests
from requests.auth import HTTPBasicAuth
import json

# Konfigurace
API_URL = "https://cloud.mybox.pro/admin-panel/v1/external"
API_KEY = "váš_api_klíč"
API_SECRET = "váš_api_secret"
DEVICE_ID = "mq40-5mt0-428z-zlcd"  # ARM Unit

def get_arm_unit_stations_status():
    """Získá stav všech připojených stanic z ARM Unit"""

    # Získání reportů ze všech stanic
    response = requests.get(
        f"{API_URL}/live/device/{DEVICE_ID}/reports",
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Zpracování reportů jednotlivých stanic
        if data['data'] and data['data'][0]['node'].get('sensors'):
            stations = []
            for sensor in data['data'][0]['node']['sensors']:
                if sensor['id'].startswith('ac-module-') and sensor['value']:
                    # Parse JSON hodnoty
                    try:
                        station_data = json.loads(sensor['value'])
                        stations.append({
                            'module_id': sensor['id'],
                            'device_id': station_data.get('device_id'),
                            'state': station_data.get('node_state'),
                            'cp_state': station_data.get('cp_state'),
                            'group': station_data.get('group'),
                            'balanced': station_data.get('balanced'),
                            'calc_mode': station_data.get('calc_mode')
                        })
                    except json.JSONDecodeError:
                        continue

            return stations

    return None

# Použití
stations = get_arm_unit_stations_status()
if stations:
    print(f"Nalezeno {len(stations)} stanic:")
    for station in stations:
        print(f"  {station['module_id']}: {station['device_id']} - {station['state']}")
```

### JavaScript - Monitoring AC Sensor

```javascript
const axios = require('axios');

const API_URL = 'https://cloud.mybox.pro/admin-panel/v1/external';
const API_KEY = 'váš_api_klíč';
const API_SECRET = 'váš_api_secret';
const DEVICE_ID = 's6lc-9mr0-80h7-ilyz'; // AC Sensor

async function getACMeasurements() {
    try {
        // Získání AC měření
        const response = await axios.get(
            `${API_URL}/live/device/${DEVICE_ID}/ac-measurement`,
            {
                auth: {
                    username: API_KEY,
                    password: API_SECRET
                }
            }
        );

        if (response.data.status === 1) {
            // Najdi node s daty
            const nodeData = response.data.data.find(d =>
                d.node && d.node.sensors
            );

            if (nodeData) {
                const measurements = {};

                // Zpracuj senzory
                nodeData.node.sensors.forEach(sensor => {
                    if (sensor.id.startsWith('ac-current-')) {
                        measurements[sensor.id] = parseFloat(sensor.value);
                    } else if (sensor.id === 'ac-phase-connection') {
                        measurements.phase = sensor.value;
                    } else if (sensor.id === 'distribution-system') {
                        measurements.system = sensor.value;
                    }
                });

                return measurements;
            }
        }
    } catch (error) {
        console.error('Chyba:', error.message);
    }

    return null;
}

// Použití
getACMeasurements().then(measurements => {
    if (measurements) {
        console.log('AC Měření:');
        console.log(`  L1: ${measurements['ac-current-1']} A`);
        console.log(`  L2: ${measurements['ac-current-2']} A`);
        console.log(`  L3: ${measurements['ac-current-3']} A`);
        console.log(`  Fáze: ${measurements.phase}`);
        console.log(`  Systém: ${measurements.system}`);
    }
});
```

### cURL - Získání konkrétního senzoru

```bash
# Získání hodnoty konkrétního proudu z AC Sensor
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/live/device/s6lc-9mr0-80h7-ilyz/ac-measurement/ac-current-1" \
  -u "váš_api_klíč:váš_api_secret" \
  -H "Accept: application/json"
```

## Praktické případy použití

### 1. Monitoring zatížení fází v AC Sensor

AC Sensor měří proud na jednotlivých fázích, což je kritické pro load balancing:

```python
def check_phase_imbalance(device_id):
    """Kontrola nevyváženosti fází"""

    response = requests.get(
        f"{API_URL}/live/device/{device_id}/ac-measurement",
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Najdi node s daty
        for item in data['data']:
            if item.get('node', {}).get('sensors'):
                currents = {}

                for sensor in item['node']['sensors']:
                    if sensor['id'].startswith('ac-current-'):
                        phase = sensor['id'].replace('ac-current-', 'L')
                        currents[phase] = float(sensor['value'])

                if currents:
                    max_current = max(currents.values())
                    min_current = min(currents.values())
                    imbalance = max_current - min_current

                    return {
                        'currents': currents,
                        'imbalance': imbalance,
                        'balanced': imbalance < 5.0  # Práh 5A
                    }

    return None
```

### 2. Sledování stavu nabíjecích stanic v ARM Unit

```python
def get_charging_stations_overview(device_id):
    """Získá přehled všech nabíjecích stanic připojených k ARM Unit"""

    response = requests.get(
        f"{API_URL}/live/device/{device_id}/reports",
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        stats = {
            'total': 0,
            'connected': 0,
            'charging': 0,
            'available': 0,
            'error': 0,
            'stations': []
        }

        # Zpracuj senzory
        if data['data'] and data['data'][0]['node'].get('sensors'):
            for sensor in data['data'][0]['node']['sensors']:
                if sensor['id'].startswith('ac-module-') and sensor['value']:
                    try:
                        station = json.loads(sensor['value'])
                        stats['total'] += 1

                        # Počítej stavy
                        if station['node_state'] == 'NODE_IS_CONNECTED':
                            stats['connected'] += 1

                            # CP stavy podle IEC 61851
                            if station['cp_state'] == 'A':
                                stats['available'] += 1
                            elif station['cp_state'] in ['B', 'C', 'D']:
                                stats['charging'] += 1
                            elif station['cp_state'] in ['E', 'F']:
                                stats['error'] += 1

                        stats['stations'].append({
                            'id': sensor['id'],
                            'device': station.get('device_id'),
                            'state': station.get('cp_state'),
                            'group': station.get('group')
                        })

                    except json.JSONDecodeError:
                        continue

        return stats

    return None
```

## Typy nodů podle zařízení

### ARM Unit nody
- **groups** - Správa skupin stanic
- **reports** - Reporty ze všech připojených stanic (až 200)
- **sources** - Zdroje dat
- **dlm-management** - Řízení DLM
- **config** - Konfigurace

### AC Sensor nody
- **ac-measurement** - Měření proudů na fázích
- **solar-mgmt** - Správa solární energie
- **ac-module-1** až **ac-module-8** - Jednotlivé moduly (max 8 stanic)
- **dlm-management** - Řízení DLM
- **config** - Konfigurace

### Nabíjecí stanice nody
- **1**, **2** - Jednotlivé nabíjecí body
- **control** - Řízení stanice
- **meter** - Měřič energie

## Best practices

1. **Cachování dat**: Node data se nemění často, zvažte cachování na 30-60 sekund

2. **Batch požadavky**: Místo volání jednotlivých senzorů načtěte celý node najednou

3. **Parsování JSON hodnot**: Mnoho senzorů vrací JSON string - vždy používejte try/catch

4. **Monitoring pouze aktivních nodů**: Ignorujte prázdné moduly (hodnota "")

5. **Využití skupin**: V ARM Unit využívejte groupy (left/right/default) pro organizaci

## Chybové stavy

- **404 Not Found** - Node neexistuje nebo špatné ID
- **401 Unauthorized** - Chybná autentizace
- **403 Forbidden** - Nemáte oprávnění k tomuto nodu
- **500 Internal Server Error** - Chyba serveru, zkuste později

## Rozdíly mezi ARM Unit a AC Sensor

| Vlastnost | ARM Unit | AC Sensor |
|-----------|----------|-----------|
| Max stanic | 200 | 8 |
| Node struktura | reports s ac-module-X | Samostatné ac-module-X nody |
| Měření proudů | V jednotlivých stanicích | Centrálně v ac-measurement |
| Solar management | Ne | Ano |
| Skupiny | left/right/default | Ne |

## Shrnutí

Node-level monitoring API poskytuje granulární přístup k datům jednotlivých komponent DLM systémů a nabíjecích stanic. Je nezbytné pro:
- Real-time monitoring zatížení
- Diagnostiku problémů
- Optimalizaci load balancingu
- Sledování stavu jednotlivých stanic
- Implementaci vlastních řídicích algoritmů