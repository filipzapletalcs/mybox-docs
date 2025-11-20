# 🔌 DLM řešení - AC Sensor vs ARM Unit

## Přehled DLM produktů MyBox

MyBox nabízí dva typy DLM (Dynamic Load Management) řešení pro různé velikosti instalací:

### 🏠 MyBox AC Sensor
- **Kapacita:** Až 8 nabíjecích bodů
- **Použití:** Menší instalace (bytové domy, malé firmy)
- **Cena:** Ekonomické řešení
- **Komunikace:** Lokální MQTT broker
- **Měření:** 3-fázové měření proudu

### 🏢 MyBox ARM Unit
- **Kapacita:** Až 200 nabíjecích bodů
- **Použití:** Velké instalace (parkoviště, logistická centra)
- **Cena:** Enterprise řešení
- **Komunikace:** Distribuovaný MQTT s hierarchií
- **Měření:** Komplexní energetický management

---

## 📊 Technické porovnání

| Funkce | AC Sensor | ARM Unit |
|--------|-----------|----------|
| **Max. nabíjecích bodů** | 8 | 200 |
| **Max. proud** | 100A | 5000A |
| **Počet nodů** | 12 | 7 |
| **Telemetrie** | ✅ (3 fáze) | ❌ |
| **Senzory** | ~50 | ~100+ |
| **Skupiny** | ❌ | ✅ (neomezené) |
| **Zdroje energie** | 1 | Více zdrojů |
| **MQTT broker** | Interní | Externí/interní |
| **Reporting node** | ❌ | ✅ |
| **Prioritizace** | Základní | Pokročilá |
| **Scheduling** | ❌ | ✅ |
| **Failover** | Lokální | Distribuovaný |

---

## 🔍 AC Sensor - Detailní popis

### Struktura nodů AC Sensoru

```
AC Sensor (s6lc-9mr0-80h7-ilyz)
├── ac-measurement      # Měření proudů na 3 fázích
├── dlm                 # DLM logika
├── local-mqtt          # Lokální MQTT broker
├── modbus              # Modbus komunikace
├── autoconf            # Automatická konfigurace
├── main-config         # Hlavní konfigurace
├── solar-mgmt          # Management solární energie
├── status-control      # Kontrola stavu
├── wifi                # WiFi konfigurace
├── ntp                 # Časová synchronizace
├── mqtt-broker         # MQTT broker status
└── other               # Ostatní funkce
```

### Klíčové senzory AC Sensoru

#### Node: `ac-measurement`
```json
{
  "ac-current-1": "1.21",      // Proud fáze L1 [A]
  "ac-current-2": "2.58",      // Proud fáze L2 [A]
  "ac-current-3": "3.63",      // Proud fáze L3 [A]
  "ac-phase-connection": "L1", // Připojená fáze
  "ac-phase-disable": "false", // Deaktivace fáze
  "ac-voltage-1": "230.5",     // Napětí L1 [V]
  "ac-voltage-2": "231.2",     // Napětí L2 [V]
  "ac-voltage-3": "229.8"      // Napětí L3 [V]
}
```

#### Node: `dlm` (v AC Sensoru)
```json
{
  "dlm-max-amp": "20.00",           // Max. proud pro DLM [A]
  "dlm-min-charge-time": "30000",   // Min. doba nabíjení [ms]
  "dlm-nodes-connections": "2",      // Počet připojených stanic
  "dlm-offset-amp": "2.00",         // Offset proudu [A]
  "dlm-on-error": "CHARGE_AT_MIN",  // Chování při chybě
  "free-amps-pool": "14.36",        // Volný proud [A]
  "dlm-report-node-1": {            // Stanice 1 (Leva)
    "node_state": "NODE_IS_LOST",
    "cp_state": "N",
    "balanced": "0.00",
    "calc_mode": "PASSIVE",
    "ev_meter": ["0.00", "0.00", "0.00"],
    "device_id": "qfeb-od13-ul2c-sgrl",
    "node_id": "ac-module"
  },
  "dlm-report-node-2": {            // Stanice 2 (Prava)
    "node_state": "NODE_IS_LOST",
    "cp_state": "N",
    "balanced": "0.00",
    "calc_mode": "PASSIVE",
    "ev_meter": ["0.00", "0.00", "0.00"],
    "device_id": "ndcc-awwu-d2x3-dx07",
    "node_id": "ac-module"
  }
}
```

### Příklad: Čtení AC Sensor dat

```python
import requests
from requests.auth import HTTPBasicAuth
import json

class ACSensorMonitor:
    def __init__(self, api_key, api_secret):
        self.auth = HTTPBasicAuth(api_key, api_secret)
        self.base_url = "https://cloud.mybox.pro/admin-panel/v1/external"

    def get_ac_measurements(self, sensor_id):
        """Získá měření proudů z AC Sensoru"""

        # Získat snapshot
        url = f"{self.base_url}/history/snapshot/{sensor_id}"
        response = requests.get(url, auth=self.auth, params={
            'from': '2025-09-24T00:00:00Z',
            'to': '2025-09-24T23:59:59Z'
        })

        if response.status_code == 200:
            data = response.json()['data'][0]

            # Najít ac-measurement node
            ac_node = next((n for n in data['nodes'] if n['id'] == 'ac-measurement'), None)

            if ac_node:
                measurements = {
                    'L1': float(ac_node['sensors'].get('ac-current-1', {}).get('value', 0)),
                    'L2': float(ac_node['sensors'].get('ac-current-2', {}).get('value', 0)),
                    'L3': float(ac_node['sensors'].get('ac-current-3', {}).get('value', 0))
                }

                measurements['total'] = sum(measurements.values())
                measurements['average'] = measurements['total'] / 3

                return measurements

        return None

    def get_connected_stations(self, sensor_id):
        """Získá informace o připojených stanicích"""

        url = f"{self.base_url}/history/snapshot/{sensor_id}"
        response = requests.get(url, auth=self.auth, params={
            'from': '2025-09-24T00:00:00Z',
            'to': '2025-09-24T23:59:59Z'
        })

        if response.status_code == 200:
            data = response.json()['data'][0]

            # Najít DLM node
            dlm_node = next((n for n in data['nodes'] if n['id'] == 'dlm'), None)

            if dlm_node:
                stations = []

                # Parsovat report pro každou stanici
                for i in range(1, 9):  # Max 8 stanic
                    report_key = f'dlm-report-node-{i}'
                    if report_key in dlm_node['sensors']:
                        report = json.loads(dlm_node['sensors'][report_key]['value'])
                        stations.append({
                            'index': i,
                            'device_id': report['device_id'],
                            'state': report['node_state'],
                            'cp_state': report['cp_state'],
                            'balanced_current': float(report['balanced']),
                            'mode': report['calc_mode'],
                            'meter': report['ev_meter']
                        })

                return stations

        return []

    def calculate_load_distribution(self, sensor_id):
        """Vypočítá distribuci zátěže"""

        measurements = self.get_ac_measurements(sensor_id)
        stations = self.get_connected_stations(sensor_id)

        if measurements and stations:
            # Získat DLM parametry
            url = f"{self.base_url}/history/snapshot/{sensor_id}"
            response = requests.get(url, auth=self.auth, params={
                'from': '2025-09-24T00:00:00Z',
                'to': '2025-09-24T23:59:59Z'
            })

            data = response.json()['data'][0]
            dlm_node = next((n for n in data['nodes'] if n['id'] == 'dlm'), None)

            max_amp = float(dlm_node['sensors']['dlm-max-amp']['value'])
            free_amps = float(dlm_node['sensors']['free-amps-pool']['value'])

            distribution = {
                'max_capacity': max_amp,
                'current_load': measurements['total'],
                'free_capacity': free_amps,
                'utilization': (measurements['total'] / max_amp * 100) if max_amp > 0 else 0,
                'stations_active': len([s for s in stations if s['state'] != 'NODE_IS_LOST']),
                'stations_total': len(stations),
                'phase_balance': {
                    'L1': measurements['L1'],
                    'L2': measurements['L2'],
                    'L3': measurements['L3'],
                    'imbalance': max(measurements.values()) - min(measurements.values())
                }
            }

            return distribution

        return None

# Použití
monitor = ACSensorMonitor('YOUR_API_KEY', 'YOUR_API_SECRET')

# AC Sensor ID
sensor_id = 's6lc-9mr0-80h7-ilyz'

# Získat měření
measurements = monitor.get_ac_measurements(sensor_id)
print(f"📊 Měření proudů:")
print(f"  L1: {measurements['L1']:.2f} A")
print(f"  L2: {measurements['L2']:.2f} A")
print(f"  L3: {measurements['L3']:.2f} A")
print(f"  Celkem: {measurements['total']:.2f} A")

# Získat stanice
stations = monitor.get_connected_stations(sensor_id)
print(f"\n🚗 Připojené stanice: {len(stations)}")
for station in stations:
    print(f"  #{station['index']}: {station['device_id']} - {station['state']}")

# Distribuce zátěže
distribution = monitor.calculate_load_distribution(sensor_id)
print(f"\n⚡ Distribuce zátěže:")
print(f"  Kapacita: {distribution['max_capacity']} A")
print(f"  Využití: {distribution['utilization']:.1f}%")
print(f"  Volno: {distribution['free_capacity']:.2f} A")
print(f"  Nevyváženost fází: {distribution['phase_balance']['imbalance']:.2f} A")
```

---

## 🏢 ARM Unit - Detailní popis

### Struktura nodů ARM Unit

```
ARM Unit (mq40-5mt0-428z-zlcd)
├── dlm              # Hlavní DLM řízení (26 senzorů)
├── dlm-config       # Konfigurace DLM (11 senzorů)
├── dlm-sys          # Systémové info (6 senzorů)
├── group-1          # Skupina 1 (4 senzory)
├── group-2          # Skupina 2 (4 senzory)
├── reports          # Reporty a statistiky (34 senzorů!)
└── source-1         # Monitoring zdrojů (5 senzorů)
```

### Klíčové rozdíly ARM Unit

#### Škálovatelnost
- **Skupiny:** Neomezený počet skupin s vlastními limity
- **Hierarchie:** Podpora multi-level DLM (DLM nad DLM)
- **Zdroje:** Monitoring více zdrojů energie současně

#### Pokročilé funkce
```json
{
  "alive-cars": "31",                    // Počet aktivních vozidel
  "charging-sessions-active": "15",       // Aktivní nabíjecí relace
  "broker-clients": "17",                // MQTT klienti
  "available-by-groups": [               // Distribuce po skupinách
    {"name": "global", "available": 300, "max": 300},
    {"name": "right", "available": 160, "max": 160},
    {"name": "left", "available": 240, "max": 240}
  ],
  "available-by-sources": [              // Dostupné zdroje
    {"name": "ACA", "available": 256, "max": 1000}
  ]
}
```

---

## 🔄 Migrace z AC Sensor na ARM Unit

### Kdy upgradovat?

| Indikátor | AC Sensor OK | Potřeba ARM Unit |
|-----------|--------------|-------------------|
| Počet stanic | < 8 | > 8 |
| Proud | < 100A | > 100A |
| Skupiny | 1 skupina | Více skupin |
| Prioritizace | Základní | Komplexní |
| Reporting | Základní | Detailní |
| Integrace | Lokální | Enterprise |

### Migrace dat

```python
def migrate_ac_to_arm(ac_sensor_id, arm_unit_id):
    """Migrace konfigurace z AC Sensor na ARM Unit"""

    # 1. Načíst konfiguraci AC Sensoru
    ac_config = get_ac_sensor_config(ac_sensor_id)

    # 2. Mapovat na ARM strukturu
    arm_config = {
        'groups': [{
            'name': 'migrated',
            'max_current': ac_config['dlm-max-amp'],
            'stations': ac_config['connected_stations']
        }],
        'sources': [{
            'name': 'main',
            'max_current': ac_config['main_breaker']
        }],
        'balancing_mode': 'fair',
        'emergency_reserve': ac_config['dlm-offset-amp']
    }

    # 3. Aplikovat na ARM Unit
    apply_arm_config(arm_unit_id, arm_config)

    return arm_config
```

---

## 💰 Ekonomické srovnání

### ROI kalkulace

| Parametr | AC Sensor | ARM Unit |
|----------|-----------|----------|
| **Pořizovací cena** | ~15 000 Kč | ~150 000 Kč |
| **Max. úspora/měsíc** | 5 000 Kč | 100 000 Kč |
| **ROI** | 3 měsíce | 1.5 měsíce |
| **Vhodné pro** | 2-8 stanic | 20-200 stanic |

### Výběr správného řešení

```javascript
function recommendDLMSolution(requirements) {
  const {
    numberOfStations,
    maxCurrent,
    needsGrouping,
    needsScheduling,
    needsPrioritization,
    budget
  } = requirements;

  if (numberOfStations <= 8 &&
      maxCurrent <= 100 &&
      !needsGrouping &&
      budget < 20000) {
    return {
      product: 'AC Sensor',
      reason: 'Ekonomické řešení pro malé instalace',
      estimatedCost: 15000
    };
  } else {
    return {
      product: 'ARM Unit',
      reason: 'Škálovatelné řešení pro velké instalace',
      estimatedCost: 150000 + (numberOfStations * 500)
    };
  }
}

// Příklad použití
const myRequirements = {
  numberOfStations: 6,
  maxCurrent: 63,
  needsGrouping: false,
  needsScheduling: false,
  needsPrioritization: false,
  budget: 20000
};

const recommendation = recommendDLMSolution(myRequirements);
console.log(`Doporučujeme: ${recommendation.product}`);
console.log(`Důvod: ${recommendation.reason}`);
console.log(`Odhadovaná cena: ${recommendation.estimatedCost} Kč`);
```

---

## 🔧 Konfigurace podle typu

### AC Sensor - Základní konfigurace
```json
{
  "dlm-max-amp": 63,           // Hlavní jistič
  "dlm-min-charge-time": 30000, // Min. doba nabíjení
  "dlm-offset-amp": 5,          // Bezpečnostní rezerva
  "dlm-on-error": "CHARGE_AT_MIN" // Při chybě nabíjet minimem
}
```

### ARM Unit - Pokročilá konfigurace
```json
{
  "max-power-limit": 1000,
  "balancing-mode": "priority",
  "emergency-reserve": 50,
  "groups": [
    {
      "id": "vip",
      "priority": "high",
      "max_current": 300
    },
    {
      "id": "standard",
      "priority": "normal",
      "max_current": 500
    },
    {
      "id": "public",
      "priority": "low",
      "max_current": 200
    }
  ],
  "scheduling": {
    "peak_hours": {
      "from": "07:00",
      "to": "19:00",
      "max_load": 80
    },
    "off_peak": {
      "from": "19:00",
      "to": "07:00",
      "max_load": 100
    }
  }
}
```

---

## 📚 Doporučení

### Pro malé instalace (AC Sensor)
1. **Bytové domy** - 2-8 parkovacích míst
2. **Malé firmy** - do 10 zaměstnanců s EV
3. **Rodinné domy** - 2-3 nabíjecí body
4. **Penziony** - základní nabíjení pro hosty

### Pro velké instalace (ARM Unit)
1. **Korporátní parkoviště** - 20+ nabíjecích míst
2. **Logistická centra** - fleet management
3. **Nákupní centra** - veřejné nabíjení
4. **Hotely a resorty** - komplexní řešení

---

## 🔗 Související dokumentace

- [DLM - Dynamic Load Management](/api/dlm-dynamic-load-management) - Hlavní DLM dokumentace
- [Node-level Monitoring](/api/node-level-monitoring) - Monitoring jednotlivých nodů
- [Device Configuration](/api/device-configuration) - Konfigurace zařízení
- [FAQ - DLM](/faq#dlm) - Časté dotazy