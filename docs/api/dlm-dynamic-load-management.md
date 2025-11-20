# ⚡ DLM - Dynamic Load Management

## Přehled

DLM (Dynamic Load Management) je pokročilý systém pro řízení a optimalizaci distribuce elektrické energie mezi více nabíjecími stanicemi. Systém dynamicky přerozděluje dostupný výkon podle aktuální poptávky, priorit a omezení elektrické sítě.

### Hlavní funkce
- **Dynamické řízení výkonu** - automatické přerozdělování energie mezi stanicemi
- **Skupinové řízení** - organizace stanic do logických skupin
- **Monitoring v reálném čase** - sledování stavu všech připojených zařízení
- **Ochrana sítě** - prevence přetížení elektrické infrastruktury
- **Prioritizace** - nastavení priorit pro různé stanice nebo skupiny
- **Reportování** - detailní statistiky využití a distribuce energie

### Architektura DLM
```
┌─────────────────┐
│   Hlavní jistič  │ (např. 1000A)
└────────┬────────┘
         │
    ┌────▼────┐
    │   DLM   │ (řídící modul)
    └────┬────┘
         │
    ┌────┴─────────┬──────────┐
    │              │          │
┌───▼───┐    ┌───▼───┐  ┌───▼───┐
│Group 1│    │Group 2│  │Source │
│ 160A  │    │ 240A  │  │Monitor│
└───┬───┘    └───┬───┘  └───────┘
    │            │
 ┌──┴──┐     ┌──┴──┐
 │AC/DC│     │AC/DC│
 └─────┘     └─────┘
```

### Use cases
- **Parkoviště a garáže** - řízení desítek až stovek nabíjecích míst
- **Firemní fleety** - optimalizace nabíjení vozového parku
- **Bytové domy** - spravedlivé rozdělení energie mezi rezidenty
- **Logistická centra** - prioritní nabíjení podle harmonogramu
- **Veřejné nabíjecí huby** - maximalizace využití dostupné kapacity

---

## 🔌 Struktura DLM systému

### Komponenty DLM

#### 1. Hlavní DLM modul
Centrální řídící jednotka, která:
- Sbírá data ze všech připojených zařízení
- Vypočítává optimální distribuci výkonu
- Komunikuje s nabíjecími stanicemi přes MQTT
- Monitoruje celkovou spotřebu

#### 2. Skupiny (Groups)
Logické seskupení nabíjecích stanic:
- `group-1`, `group-2` - fyzické skupiny stanic
- Každá skupina má vlastní výkonový limit
- Možnost různých priorit

#### 3. Zdroje (Sources)
Monitorování dostupných zdrojů energie:
- Hlavní přípojka
- Solární panely
- Bateriové úložiště
- Záložní generátory

#### 4. Reporty
Komplexní statistiky a analýzy:
- Využití po skupinách
- Energetické toky
- Historie událostí
- Predikce spotřeby

---

## 📊 API Endpointy pro DLM

### Základní informace o DLM

#### Endpoint
```
GET /admin-panel/v1/external/device/{dlmId}
```

#### Response
```json
{
  "status": 1,
  "data": {
    "id": 1234567890,
    "identifier": "mq40-5mt0-428z-zlcd",
    "title": "PPL DLM Teplice",
    "product": {
      "title": "DLM",
      "version": "2.0",
      "mcu": "ESP32"
    },
    "status": "paired",
    "state": "ready",
    "firmware_version": "2.1.0",
    "created": "2024-01-15T10:00:00Z"
  }
}
```

---

## 🔍 Live monitoring DLM

### Snapshot aktuálního stavu

#### Endpoint
```
GET /admin-panel/v1/external/history/snapshot/{dlmId}
```

#### Response struktura
```json
{
  "status": 1,
  "data": [
    {
      "id": "mq40-5mt0-428z-zlcd",
      "name": "PPL DLM Teplice",
      "state": "ready",
      "nodes": [
        {
          "id": "dlm",
          "sensors": {
            "alive-cars": {
              "value": "31",
              "description": "Počet aktivních vozidel"
            },
            "available-by-groups": {
              "value": "[{\"name\":\"global\",\"available\":300,\"max\":300},{\"name\":\"right\",\"available\":160,\"max\":160},{\"name\":\"left\",\"available\":240,\"max\":240}]",
              "description": "Dostupný výkon po skupinách"
            },
            "available-by-sources": {
              "value": "[{\"name\":\"ACA\",\"available\":256,\"max\":1000}]",
              "description": "Dostupný výkon ze zdrojů"
            },
            "broker-clients": {
              "value": "17",
              "description": "Počet připojených MQTT klientů"
            },
            "broker-state": {
              "value": "init",
              "description": "Stav MQTT brokeru"
            },
            "charging-sessions-active": {
              "value": "15",
              "description": "Aktivní nabíjecí relace"
            },
            "energy-consumed-today": {
              "value": "1234.56",
              "unit": "kWh",
              "description": "Spotřeba dnes"
            },
            "load-percentage": {
              "value": "65",
              "unit": "%",
              "description": "Využití kapacity"
            }
          }
        },
        {
          "id": "dlm-config",
          "sensors": {
            "max-power-limit": {
              "value": "1000",
              "unit": "A",
              "description": "Maximální proudový limit"
            },
            "balancing-mode": {
              "value": "fair",
              "description": "Režim balancování (fair/priority/scheduled)"
            },
            "emergency-reserve": {
              "value": "50",
              "unit": "A",
              "description": "Nouzová rezerva"
            }
          }
        },
        {
          "id": "group-1",
          "sensors": {
            "allocated-power": {
              "value": "120",
              "unit": "A"
            },
            "active-stations": {
              "value": "8"
            },
            "queued-stations": {
              "value": "2"
            },
            "priority": {
              "value": "normal"
            }
          }
        },
        {
          "id": "reports",
          "sensors": {
            "daily-energy": {
              "value": "5678.90",
              "unit": "kWh"
            },
            "monthly-energy": {
              "value": "145678.90",
              "unit": "kWh"
            },
            "peak-power-today": {
              "value": "950",
              "unit": "A"
            },
            "average-session-duration": {
              "value": "45",
              "unit": "min"
            },
            "utilization-rate": {
              "value": "78",
              "unit": "%"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📈 Klíčové metriky DLM

### Hlavní senzory pro monitoring

| Senzor ID | Popis | Jednotka | Význam |
|-----------|-------|----------|--------|
| `alive-cars` | Počet aktivních vozidel | počet | Kolik vozidel je aktuálně připojeno |
| `charging-sessions-active` | Aktivní nabíjecí relace | počet | Kolik vozidel aktuálně nabíjí |
| `available-by-groups` | Dostupný výkon po skupinách | JSON | Rozdělení výkonu mezi skupiny |
| `available-by-sources` | Dostupný výkon ze zdrojů | JSON | Dostupná energie ze všech zdrojů |
| `load-percentage` | Využití kapacity | % | Celkové využití dostupného výkonu |
| `broker-clients` | MQTT klienti | počet | Počet připojených stanic |
| `energy-consumed-today` | Denní spotřeba | kWh | Celková energie za dnešek |

---

## 💻 Příklady použití

### Python - Monitoring DLM systému
```python
import requests
from requests.auth import HTTPBasicAuth
import json
from datetime import datetime, timedelta

class DLMMonitor:
    def __init__(self, api_key, api_secret):
        self.auth = HTTPBasicAuth(api_key, api_secret)
        self.base_url = "https://cloud.mybox.pro/admin-panel/v1/external"

    def get_dlm_status(self, dlm_id):
        """Získá aktuální stav DLM systému"""

        # Získat snapshot
        url = f"{self.base_url}/history/snapshot/{dlm_id}"
        params = {
            'from': (datetime.now() - timedelta(minutes=5)).isoformat() + 'Z',
            'to': datetime.now().isoformat() + 'Z'
        }

        response = requests.get(url, params=params, auth=self.auth)

        if response.status_code == 200:
            data = response.json()['data'][0]

            # Zpracovat data ze senzorů
            dlm_node = next((n for n in data['nodes'] if n['id'] == 'dlm'), None)

            if dlm_node:
                status = self.parse_dlm_sensors(dlm_node['sensors'])
                return status

        return None

    def parse_dlm_sensors(self, sensors):
        """Parsuje senzory DLM do přehledné struktury"""

        status = {
            'timestamp': datetime.now().isoformat(),
            'active_vehicles': 0,
            'charging_sessions': 0,
            'groups': [],
            'sources': [],
            'load_percentage': 0,
            'mqtt_clients': 0,
            'broker_state': 'unknown'
        }

        for sensor_id, sensor_data in sensors.items():
            if sensor_id == 'alive-cars':
                status['active_vehicles'] = int(sensor_data.get('value', 0))
            elif sensor_id == 'charging-sessions-active':
                status['charging_sessions'] = int(sensor_data.get('value', 0))
            elif sensor_id == 'available-by-groups':
                try:
                    status['groups'] = json.loads(sensor_data.get('value', '[]'))
                except:
                    pass
            elif sensor_id == 'available-by-sources':
                try:
                    status['sources'] = json.loads(sensor_data.get('value', '[]'))
                except:
                    pass
            elif sensor_id == 'load-percentage':
                status['load_percentage'] = float(sensor_data.get('value', 0))
            elif sensor_id == 'broker-clients':
                status['mqtt_clients'] = int(sensor_data.get('value', 0))
            elif sensor_id == 'broker-state':
                status['broker_state'] = sensor_data.get('value', 'unknown')

        return status

    def monitor_load_distribution(self, dlm_id):
        """Monitoruje distribuci zátěže v reálném čase"""

        status = self.get_dlm_status(dlm_id)

        if status:
            print(f"🔌 DLM Status - {status['timestamp']}")
            print("=" * 60)

            print(f"Aktivní vozidla: {status['active_vehicles']}")
            print(f"Nabíjecí relace: {status['charging_sessions']}")
            print(f"Využití kapacity: {status['load_percentage']}%")
            print(f"MQTT klienti: {status['mqtt_clients']}")
            print(f"Stav brokeru: {status['broker_state']}")

            print("\n📊 Distribuce výkonu po skupinách:")
            for group in status['groups']:
                utilization = (group['available'] / group['max'] * 100) if group['max'] > 0 else 0
                print(f"  {group['name']}: {group['available']}A / {group['max']}A ({utilization:.1f}%)")

            print("\n⚡ Dostupné zdroje:")
            for source in status['sources']:
                utilization = (source['available'] / source['max'] * 100) if source['max'] > 0 else 0
                print(f"  {source['name']}: {source['available']}A / {source['max']}A ({utilization:.1f}%)")

            # Varování při vysokém využití
            if status['load_percentage'] > 90:
                print("\n⚠️ VAROVÁNÍ: Vysoké využití kapacity!")
            elif status['load_percentage'] > 80:
                print("\n⚡ UPOZORNĚNÍ: Blížíte se limitu kapacity")

        return status

    def get_group_statistics(self, dlm_id, group_id):
        """Získá statistiky konkrétní skupiny"""

        url = f"{self.base_url}/history/snapshot/{dlm_id}"
        params = {
            'from': (datetime.now() - timedelta(hours=24)).isoformat() + 'Z',
            'to': datetime.now().isoformat() + 'Z'
        }

        response = requests.get(url, params=params, auth=self.auth)

        if response.status_code == 200:
            snapshots = response.json()['data']

            group_stats = {
                'group_id': group_id,
                'samples': [],
                'max_power': 0,
                'avg_power': 0,
                'total_sessions': 0
            }

            for snapshot in snapshots:
                group_node = next((n for n in snapshot['nodes'] if n['id'] == group_id), None)
                if group_node and 'sensors' in group_node:
                    power = float(group_node['sensors'].get('allocated-power', {}).get('value', 0))
                    sessions = int(group_node['sensors'].get('active-stations', {}).get('value', 0))

                    group_stats['samples'].append({
                        'timestamp': snapshot.get('timestamp'),
                        'power': power,
                        'sessions': sessions
                    })

                    group_stats['max_power'] = max(group_stats['max_power'], power)
                    group_stats['total_sessions'] += sessions

            if group_stats['samples']:
                group_stats['avg_power'] = sum(s['power'] for s in group_stats['samples']) / len(group_stats['samples'])

            return group_stats

        return None

# Použití
monitor = DLMMonitor('YOUR_API_KEY', 'YOUR_API_SECRET')

# Monitoring DLM systému
dlm_status = monitor.monitor_load_distribution('mq40-5mt0-428z-zlcd')

# Statistiky skupiny
group_stats = monitor.get_group_statistics('mq40-5mt0-428z-zlcd', 'group-1')
if group_stats:
    print(f"\n📈 Statistiky skupiny {group_stats['group_id']} za 24h:")
    print(f"  Maximální výkon: {group_stats['max_power']}A")
    print(f"  Průměrný výkon: {group_stats['avg_power']:.1f}A")
    print(f"  Celkem relací: {group_stats['total_sessions']}")
```

### JavaScript/Node.js - DLM Dashboard
```javascript
const axios = require('axios');

class DLMDashboard {
  constructor(apiKey, apiSecret) {
    this.auth = {
      username: apiKey,
      password: apiSecret
    };
    this.baseUrl = 'https://cloud.mybox.pro/admin-panel/v1/external';
  }

  async getDLMSnapshot(dlmId) {
    const now = new Date();
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

    try {
      const response = await axios.get(
        `${this.baseUrl}/history/snapshot/${dlmId}`,
        {
          params: {
            from: fiveMinutesAgo.toISOString(),
            to: now.toISOString()
          },
          auth: this.auth
        }
      );

      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching DLM snapshot:', error.message);
      return null;
    }
  }

  parseGroups(groupsJson) {
    try {
      return JSON.parse(groupsJson);
    } catch {
      return [];
    }
  }

  async createLoadBalancingReport(dlmId) {
    const snapshot = await this.getDLMSnapshot(dlmId);

    if (!snapshot) return null;

    const dlmNode = snapshot.nodes.find(n => n.id === 'dlm');
    const configNode = snapshot.nodes.find(n => n.id === 'dlm-config');
    const reportsNode = snapshot.nodes.find(n => n.id === 'reports');

    const report = {
      timestamp: new Date().toISOString(),
      system: {
        name: snapshot.name,
        state: snapshot.state,
        firmware: snapshot.firmwareVersion
      },
      load: {
        activeVehicles: 0,
        chargingSessions: 0,
        mqttClients: 0,
        loadPercentage: 0
      },
      groups: [],
      energy: {
        daily: 0,
        monthly: 0,
        peakPowerToday: 0
      },
      config: {
        maxPowerLimit: 0,
        balancingMode: 'unknown',
        emergencyReserve: 0
      }
    };

    // Parse DLM sensors
    if (dlmNode && dlmNode.sensors) {
      Object.entries(dlmNode.sensors).forEach(([id, sensor]) => {
        switch(id) {
          case 'alive-cars':
            report.load.activeVehicles = parseInt(sensor.value) || 0;
            break;
          case 'charging-sessions-active':
            report.load.chargingSessions = parseInt(sensor.value) || 0;
            break;
          case 'broker-clients':
            report.load.mqttClients = parseInt(sensor.value) || 0;
            break;
          case 'load-percentage':
            report.load.loadPercentage = parseFloat(sensor.value) || 0;
            break;
          case 'available-by-groups':
            report.groups = this.parseGroups(sensor.value);
            break;
        }
      });
    }

    // Parse config
    if (configNode && configNode.sensors) {
      Object.entries(configNode.sensors).forEach(([id, sensor]) => {
        switch(id) {
          case 'max-power-limit':
            report.config.maxPowerLimit = parseInt(sensor.value) || 0;
            break;
          case 'balancing-mode':
            report.config.balancingMode = sensor.value;
            break;
          case 'emergency-reserve':
            report.config.emergencyReserve = parseInt(sensor.value) || 0;
            break;
        }
      });
    }

    // Parse reports
    if (reportsNode && reportsNode.sensors) {
      Object.entries(reportsNode.sensors).forEach(([id, sensor]) => {
        switch(id) {
          case 'daily-energy':
            report.energy.daily = parseFloat(sensor.value) || 0;
            break;
          case 'monthly-energy':
            report.energy.monthly = parseFloat(sensor.value) || 0;
            break;
          case 'peak-power-today':
            report.energy.peakPowerToday = parseInt(sensor.value) || 0;
            break;
        }
      });
    }

    return report;
  }

  async monitorLoadBalance(dlmId, intervalMs = 60000) {
    console.log('🚀 Starting DLM monitoring...');

    const updateDashboard = async () => {
      const report = await this.createLoadBalancingReport(dlmId);

      if (report) {
        console.clear();
        console.log('═══════════════════════════════════════════════════════');
        console.log(`  DLM DASHBOARD - ${report.system.name}`);
        console.log('═══════════════════════════════════════════════════════');
        console.log(`  Last Update: ${new Date().toLocaleTimeString()}`);
        console.log(`  System State: ${report.system.state}`);
        console.log('');
        console.log('  📊 CURRENT LOAD');
        console.log(`  ├─ Active Vehicles: ${report.load.activeVehicles}`);
        console.log(`  ├─ Charging Sessions: ${report.load.chargingSessions}`);
        console.log(`  ├─ Load: ${report.load.loadPercentage}%`);
        console.log(`  └─ MQTT Clients: ${report.load.mqttClients}`);
        console.log('');
        console.log('  ⚡ POWER DISTRIBUTION');

        report.groups.forEach(group => {
          const usage = group.max > 0 ? (group.available / group.max * 100).toFixed(1) : 0;
          const bar = this.createProgressBar(usage, 20);
          console.log(`  ├─ ${group.name.padEnd(10)} ${bar} ${group.available}/${group.max}A (${usage}%)`);
        });

        console.log('');
        console.log('  📈 ENERGY STATISTICS');
        console.log(`  ├─ Today: ${report.energy.daily.toFixed(1)} kWh`);
        console.log(`  ├─ This Month: ${report.energy.monthly.toFixed(1)} kWh`);
        console.log(`  └─ Peak Today: ${report.energy.peakPowerToday}A`);
        console.log('');
        console.log('  ⚙️ CONFIGURATION');
        console.log(`  ├─ Max Limit: ${report.config.maxPowerLimit}A`);
        console.log(`  ├─ Mode: ${report.config.balancingMode}`);
        console.log(`  └─ Reserve: ${report.config.emergencyReserve}A`);
        console.log('═══════════════════════════════════════════════════════');

        // Warnings
        if (report.load.loadPercentage > 90) {
          console.log('');
          console.log('  ⚠️  WARNING: System load above 90%!');
        }
      }
    };

    // Initial update
    await updateDashboard();

    // Set interval for updates
    setInterval(updateDashboard, intervalMs);
  }

  createProgressBar(percentage, width) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;

    let bar = '[';
    bar += '█'.repeat(filled);
    bar += '░'.repeat(empty);
    bar += ']';

    return bar;
  }
}

// Použití
const dashboard = new DLMDashboard('YOUR_API_KEY', 'YOUR_API_SECRET');

// Spustit live monitoring (aktualizace každou minutu)
dashboard.monitorLoadBalance('mq40-5mt0-428z-zlcd', 60000);
```

### Alerting a notifikace
```python
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

class DLMAlertSystem:
    def __init__(self, monitor, email_config):
        self.monitor = monitor
        self.email_config = email_config
        self.alert_thresholds = {
            'load_percentage': 85,
            'group_imbalance': 30,  # % rozdíl mezi skupinami
            'offline_stations': 5
        }

    def check_alerts(self, dlm_id):
        """Kontroluje překročení prahových hodnot"""

        status = self.monitor.get_dlm_status(dlm_id)
        alerts = []

        if status:
            # Kontrola celkového zatížení
            if status['load_percentage'] > self.alert_thresholds['load_percentage']:
                alerts.append({
                    'type': 'HIGH_LOAD',
                    'severity': 'warning' if status['load_percentage'] < 95 else 'critical',
                    'message': f"Vysoké zatížení systému: {status['load_percentage']}%",
                    'value': status['load_percentage']
                })

            # Kontrola nevyváženosti skupin
            if status['groups']:
                utilizations = [g['available'] / g['max'] * 100 for g in status['groups'] if g['max'] > 0]
                if utilizations:
                    imbalance = max(utilizations) - min(utilizations)
                    if imbalance > self.alert_thresholds['group_imbalance']:
                        alerts.append({
                            'type': 'GROUP_IMBALANCE',
                            'severity': 'warning',
                            'message': f"Nevyvážené zatížení skupin: rozdíl {imbalance:.1f}%",
                            'value': imbalance
                        })

            # Kontrola offline stanic
            offline_count = status['active_vehicles'] - status['charging_sessions']
            if offline_count > self.alert_thresholds['offline_stations']:
                alerts.append({
                    'type': 'STATIONS_OFFLINE',
                    'severity': 'info',
                    'message': f"Počet offline stanic: {offline_count}",
                    'value': offline_count
                })

        return alerts

    def send_alert_email(self, alerts, dlm_name):
        """Odešle e-mail s upozorněním"""

        if not alerts:
            return

        subject = f"DLM Alert - {dlm_name}"

        body = f"DLM Monitoring Alert\n"
        body += f"System: {dlm_name}\n"
        body += f"Time: {datetime.now().isoformat()}\n"
        body += f"\nDetected Issues:\n"
        body += "=" * 50 + "\n"

        for alert in alerts:
            severity_icon = {'critical': '🔴', 'warning': '🟡', 'info': '🔵'}.get(alert['severity'], '⚪')
            body += f"{severity_icon} [{alert['severity'].upper()}] {alert['message']}\n"

        # Send email logic here
        print(f"Alert email would be sent:\n{body}")

# Použití
monitor = DLMMonitor('YOUR_API_KEY', 'YOUR_API_SECRET')
alert_system = DLMAlertSystem(monitor, {'smtp_server': 'smtp.example.com'})

# Kontrola alertů
alerts = alert_system.check_alerts('mq40-5mt0-428z-zlcd')
if alerts:
    alert_system.send_alert_email(alerts, 'PPL DLM Teplice')
```

---

## 🔧 Konfigurace DLM

### Klíčové parametry

| Parametr | Popis | Výchozí hodnota | Rozsah |
|----------|-------|-----------------|---------|
| `max-power-limit` | Celkový limit proudu | 1000A | 100-5000A |
| `balancing-mode` | Režim balancování | `fair` | `fair`, `priority`, `scheduled` |
| `emergency-reserve` | Nouzová rezerva | 50A | 0-500A |
| `group-priority` | Priority skupin | `normal` | `low`, `normal`, `high` |
| `min-charging-current` | Minimální nabíjecí proud | 6A | 6-32A |
| `rebalance-interval` | Interval přepočtu | 5s | 1-60s |
| `mqtt-qos` | MQTT Quality of Service | 1 | 0, 1, 2 |

### Režimy balancování

#### Fair (spravedlivý)
- Rovnoměrné rozdělení dostupného výkonu
- Všechny stanice dostanou stejný podíl
- Vhodné pro rezidentní aplikace

#### Priority (prioritní)
- Rozdělení podle nastavených priorit
- VIP stanice dostanou výkon přednostně
- Vhodné pro firemní fleety

#### Scheduled (plánovaný)
- Rozdělení podle časového plánu
- Různé priority v různých časech
- Vhodné pro logistická centra

---

## ⚠️ Chybové stavy

### Možné chybové odpovědi

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "DLM device not found"
}
```

#### 503 Service Unavailable
```json
{
  "status": 0,
  "error": "Service Unavailable",
  "message": "DLM broker offline"
}
```

### Diagnostika problémů

| Problém | Možná příčina | Řešení |
|---------|---------------|---------|
| Broker offline | Výpadek MQTT | Restart DLM modulu |
| Nevyvážené skupiny | Špatná konfigurace | Upravit group priorities |
| Vysoké zatížení | Překročen limit | Zvýšit max-power-limit nebo omezit stanice |
| Stanice se nepřipojí | MQTT problém | Zkontrolovat síťové nastavení |

---

## 💡 Best Practices

### 1. Optimální konfigurace
- Nastavte emergency-reserve na 5-10% celkové kapacity
- Používejte rebalance-interval 5-10s pro stabilitu
- Minimální nabíjecí proud 6A pro AC, 10A pro DC

### 2. Monitoring
- Sledujte load-percentage, při >85% zvažte optimalizaci
- Kontrolujte group imbalance, rozdíl >30% indikuje problém
- Monitorujte broker-clients vs. očekávaný počet stanic

### 3. Škálování
- Jeden DLM zvládne až 200 nabíjecích bodů
- Pro větší instalace použijte hierarchii DLM modulů
- Oddělte AC a DC stanice do různých skupin

### 4. Bezpečnost
- Vždy nastavte emergency-reserve
- Implementujte failover na lokální řízení při výpadku DLM
- Pravidelně zálohujte konfiguraci

---

## 📚 Další zdroje

- [Node-level Monitoring](/api/node-level-monitoring) - Monitoring jednotlivých nodů
- [Historická data](/api/historical-data) - Analýza historických dat
- [Device Configuration](/api/device-configuration) - Konfigurace zařízení
- [FAQ - DLM](/faq#dlm) - Časté dotazy o DLM