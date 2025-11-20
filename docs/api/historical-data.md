# 📈 Historická data

## Přehled

API pro historická data poskytuje přístup k uloženým datům z nabíjecích stanic za zvolené časové období. Tato data jsou klíčová pro analýzy, reporting, diagnostiku a optimalizaci provozu nabíjecích stanic.

### Hlavní funkce
- Snapshot historie - kompletní stav zařízení v čase
- Historie telemetrických dat - průběhy měřených hodnot
- Historie senzorových dat - detailní data ze senzorů
- Historie konfiguračních změn - změny nastavení
- Torch data - speciální formát pro vysokofrekvenční data

### Typy historických dat

1. **Snapshots** - kompletní stav zařízení v daný okamžik
2. **Telemetry** - časové řady telemetrických hodnot (napětí, proud, výkon)
3. **Sensor data** - detailní data ze specifických senzorů
4. **Options** - historie změn konfigurace
5. **Torch** - optimalizovaný formát pro velké objemy dat

### Use cases
- **Analýza spotřeby** - vytváření reportů o spotřebě energie
- **Diagnostika problémů** - analýza historických dat při řešení problémů
- **Optimalizace** - identifikace vzorců využití pro optimalizaci
- **Compliance** - evidence pro regulační požadavky
- **Fakturace** - podklady pro vyúčtování

---

## 📸 Snapshot historie

### Endpoint
```
GET /admin-panel/v1/external/history/snapshot/{deviceId}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | ID zařízení |

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `from` | string | ✅ | Počáteční datum (ISO 8601) |
| `to` | string | ✅ | Koncové datum (ISO 8601) |
| `limit` | number | ❌ | Max počet záznamů (výchozí: 1000) |
| `interval` | string | ❌ | Interval vzorkování (`1h`, `6h`, `1d`) |

### Response
```json
{
  "status": 1,
  "data": [
    {
      "id": "qfeb-od13-ul2c-sgrl",
      "name": "Leva",
      "state": "ready",
      "firmwareVersion": "7",
      "firmwareName": "1.6.1-7",
      "owner": {
        "id": 1756452672746106,
        "email": "filipzapletalcs@gmail.com",
        "name": "Filip Zapletal"
      },
      "telemetry": {
        "active_energy": {
          "value": 1234.56,
          "unit": "kWh",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "active_power": {
          "value": 11.04,
          "unit": "kW",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "voltage_l1": {
          "value": 230.5,
          "unit": "V",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "voltage_l2": {
          "value": 231.2,
          "unit": "V",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "voltage_l3": {
          "value": 229.8,
          "unit": "V",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "current_l1": {
          "value": 16.0,
          "unit": "A",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "current_l2": {
          "value": 16.0,
          "unit": "A",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "current_l3": {
          "value": 16.0,
          "unit": "A",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "temperature_internal": {
          "value": 42.5,
          "unit": "°C",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "wifi_rssi": {
          "value": -65,
          "unit": "dBm",
          "timestamp": "2025-09-22T10:00:00Z"
        }
      },
      "sensors": {
        "charging_status": {
          "value": "charging",
          "type": "enum",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "connector_status": {
          "value": "occupied",
          "type": "string",
          "timestamp": "2025-09-22T10:00:00Z"
        },
        "error_state": {
          "value": 0,
          "type": "integer",
          "timestamp": "2025-09-22T10:00:00Z"
        }
      },
      "options": {
        "max_charging_power": {
          "value": 11000,
          "unit": "W"
        },
        "charging_mode": {
          "value": "solar_surplus"
        },
        "load_balancing_enabled": {
          "value": true
        }
      },
      "nodes": []
    }
  ],
  "meta": {
    "from": "2025-09-20T00:00:00Z",
    "to": "2025-09-24T12:00:00Z",
    "total_records": 2,
    "interval": "auto"
  }
}
```

### Příklad volání

#### cURL
```bash
# Získat snapshoty za posledních 24 hodin
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/history/snapshot/qfeb-od13-ul2c-sgrl?from=2025-09-23T00:00:00Z&to=2025-09-24T00:00:00Z" \
  -u "YOUR_API_KEY:YOUR_API_SECRET" \
  -H "Accept: application/json"
```

#### Python
```python
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime, timedelta
import pandas as pd

def get_device_snapshots(device_id, days_back=7):
    """Získá historické snapshoty zařízení"""

    # Časový rozsah
    date_to = datetime.now()
    date_from = date_to - timedelta(days=days_back)

    url = f"https://cloud.mybox.pro/admin-panel/v1/external/history/snapshot/{device_id}"
    params = {
        'from': date_from.isoformat() + 'Z',
        'to': date_to.isoformat() + 'Z'
    }

    response = requests.get(
        url,
        params=params,
        auth=HTTPBasicAuth('YOUR_API_KEY', 'YOUR_API_SECRET')
    )

    if response.status_code == 200:
        data = response.json()['data']

        # Zpracovat telemetrii
        telemetry_data = []
        for snapshot in data:
            if 'telemetry' in snapshot:
                record = {
                    'timestamp': snapshot['telemetry'].get('active_power', {}).get('timestamp'),
                    'power_kw': snapshot['telemetry'].get('active_power', {}).get('value', 0),
                    'energy_kwh': snapshot['telemetry'].get('active_energy', {}).get('value', 0),
                    'voltage_l1': snapshot['telemetry'].get('voltage_l1', {}).get('value', 0),
                    'current_l1': snapshot['telemetry'].get('current_l1', {}).get('value', 0),
                    'temperature': snapshot['telemetry'].get('temperature_internal', {}).get('value', 0)
                }
                telemetry_data.append(record)

        # Vytvořit DataFrame
        df = pd.DataFrame(telemetry_data)
        if not df.empty:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df.set_index('timestamp', inplace=True)

            # Základní statistiky
            print(f"📊 Statistiky za posledních {days_back} dní:")
            print(f"Průměrný výkon: {df['power_kw'].mean():.2f} kW")
            print(f"Maximální výkon: {df['power_kw'].max():.2f} kW")
            print(f"Celková energie: {df['energy_kwh'].max() - df['energy_kwh'].min():.2f} kWh")

        return df
    else:
        print(f"Chyba: {response.status_code}")
        return None

# Použití
df = get_device_snapshots('qfeb-od13-ul2c-sgrl', days_back=30)
```

---

## 📊 Historie telemetrie

### Endpoint
```
GET /admin-panel/v1/external/history/telemetry/{deviceId}/{telemetryId}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | ID zařízení |
| `telemetryId` | string | ✅ | ID telemetrie (např. `active_power`, `voltage_l1`) |

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `from` | string | ✅ | Počáteční datum |
| `to` | string | ✅ | Koncové datum |
| `aggregation` | string | ❌ | Typ agregace (`none`, `avg`, `max`, `min`, `sum`) |
| `interval` | string | ❌ | Interval agregace (`1m`, `5m`, `1h`, `1d`) |
| `limit` | number | ❌ | Max počet záznamů |

### Response
```json
{
  "status": 1,
  "data": [
    {
      "timestamp": "2025-09-24T10:00:00Z",
      "value": 11.04,
      "unit": "kW",
      "quality": "good",
      "aggregation": null
    },
    {
      "timestamp": "2025-09-24T10:05:00Z",
      "value": 10.95,
      "unit": "kW",
      "quality": "good",
      "aggregation": null
    },
    {
      "timestamp": "2025-09-24T10:10:00Z",
      "value": 11.02,
      "unit": "kW",
      "quality": "good",
      "aggregation": null
    }
  ],
  "meta": {
    "device_id": "qfeb-od13-ul2c-sgrl",
    "telemetry_id": "active_power",
    "from": "2025-09-24T10:00:00Z",
    "to": "2025-09-24T11:00:00Z",
    "total_records": 12,
    "aggregation": "none",
    "interval": "5m"
  }
}
```

### Dostupné telemetrie

| Telemetry ID | Popis | Jednotka |
|--------------|-------|----------|
| `active_power` | Aktivní výkon | kW |
| `active_energy` | Aktivní energie | kWh |
| `reactive_power` | Jalový výkon | kVAr |
| `apparent_power` | Zdánlivý výkon | kVA |
| `voltage_l1`, `voltage_l2`, `voltage_l3` | Napětí fází | V |
| `current_l1`, `current_l2`, `current_l3` | Proud fází | A |
| `frequency` | Frekvence sítě | Hz |
| `power_factor` | Účiník | - |
| `temperature_internal` | Vnitřní teplota | °C |
| `wifi_rssi` | Síla WiFi signálu | dBm |

### Příklad volání s agregací

#### JavaScript/Node.js
```javascript
const axios = require('axios');

class TelemetryAnalyzer {
  constructor(apiKey, apiSecret) {
    this.auth = {
      username: apiKey,
      password: apiSecret
    };
  }

  async getPowerProfile(deviceId, date) {
    // Získat hodinové průměry za den
    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    const response = await axios.get(
      `https://cloud.mybox.pro/admin-panel/v1/external/history/telemetry/${deviceId}/active_power`,
      {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
          aggregation: 'avg',
          interval: '1h'
        },
        auth: this.auth
      }
    );

    const data = response.data.data;

    // Analýza profilu
    const profile = {
      date: date.toISOString().split('T')[0],
      hourly_avg: {},
      peak_hour: null,
      peak_value: 0,
      valley_hour: null,
      valley_value: Infinity,
      daily_avg: 0
    };

    let sum = 0;
    data.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      const value = entry.value;

      profile.hourly_avg[hour] = value;
      sum += value;

      if (value > profile.peak_value) {
        profile.peak_value = value;
        profile.peak_hour = hour;
      }

      if (value < profile.valley_value) {
        profile.valley_value = value;
        profile.valley_hour = hour;
      }
    });

    profile.daily_avg = sum / data.length;

    return profile;
  }

  async getEnergyConsumption(deviceId, startDate, endDate) {
    const response = await axios.get(
      `https://cloud.mybox.pro/admin-panel/v1/external/history/telemetry/${deviceId}/active_energy`,
      {
        params: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          aggregation: 'max',
          interval: '1d'
        },
        auth: this.auth
      }
    );

    const data = response.data.data;

    // Vypočítat denní spotřebu
    const dailyConsumption = [];
    for (let i = 1; i < data.length; i++) {
      dailyConsumption.push({
        date: data[i].timestamp.split('T')[0],
        consumption: data[i].value - data[i-1].value,
        unit: 'kWh'
      });
    }

    return dailyConsumption;
  }
}

// Použití
const analyzer = new TelemetryAnalyzer('YOUR_API_KEY', 'YOUR_API_SECRET');

// Získat výkonový profil
analyzer.getPowerProfile('qfeb-od13-ul2c-sgrl', new Date('2025-09-23'))
  .then(profile => {
    console.log('📊 Výkonový profil:');
    console.log(`Průměrný výkon: ${profile.daily_avg.toFixed(2)} kW`);
    console.log(`Špička: ${profile.peak_value.toFixed(2)} kW v ${profile.peak_hour}:00`);
    console.log(`Minimum: ${profile.valley_value.toFixed(2)} kW v ${profile.valley_hour}:00`);
  });
```

---

## 🔍 Historie senzorových dat

### Endpoint
```
GET /admin-panel/v1/external/history/sensor/{deviceId}/{nodeId}/{sensorId}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | ID zařízení |
| `nodeId` | string | ✅ | ID nodu (použijte `main` pro hlavní node) |
| `sensorId` | string | ✅ | ID senzoru |

### Response
```json
{
  "status": 1,
  "data": [
    {
      "timestamp": "2025-09-24T10:00:00Z",
      "value": "charging",
      "type": "enum",
      "metadata": {
        "session_id": "sess_20250924_100000",
        "connector_id": 1
      }
    },
    {
      "timestamp": "2025-09-24T10:30:00Z",
      "value": "completed",
      "type": "enum",
      "metadata": {
        "session_id": "sess_20250924_100000",
        "duration_min": 30,
        "energy_kwh": 5.5
      }
    }
  ]
}
```

---

## ⚙️ Historie konfigurace

### Endpoint
```
GET /admin-panel/v1/external/history/option/{deviceId}/{optionId}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | ID zařízení |
| `optionId` | string | ✅ | ID konfiguračního parametru |

### Response
```json
{
  "status": 1,
  "data": [
    {
      "timestamp": "2025-09-20T14:30:00Z",
      "old_value": 22000,
      "new_value": 11000,
      "unit": "W",
      "changed_by": "admin@example.com",
      "change_reason": "Omezení výkonu kvůli síťové kapacitě",
      "change_method": "api"
    },
    {
      "timestamp": "2025-09-15T10:00:00Z",
      "old_value": 11000,
      "new_value": 22000,
      "unit": "W",
      "changed_by": "system",
      "change_reason": "Obnovení plného výkonu",
      "change_method": "automatic"
    }
  ]
}
```

---

## 🔥 Torch data (vysokofrekvenční data)

### Endpoint
```
GET /admin-panel/v1/external/history/torch/{deviceId}
```

### Popis
Torch data jsou optimalizovaný formát pro přenos velkých objemů vysokofrekvenčních dat (např. vzorkování každou sekundu). Data jsou komprimována a strukturována pro efektivní přenos.

### Parametry

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `from` | string | ✅ | Počáteční datum |
| `to` | string | ✅ | Koncové datum |
| `channels` | string | ❌ | Seznam kanálů oddělený čárkami |
| `format` | string | ❌ | Formát dat (`json`, `csv`, `binary`) |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "qfeb-od13-ul2c-sgrl",
    "channels": {
      "voltage_l1": {
        "unit": "V",
        "sampling_rate": "1Hz",
        "compression": "delta",
        "data": [230.5, 0.1, -0.2, 0.1, 0.0, -0.1, 0.2]
      },
      "current_l1": {
        "unit": "A",
        "sampling_rate": "1Hz",
        "compression": "delta",
        "data": [16.0, 0.0, 0.1, 0.0, -0.1, 0.0, 0.1]
      }
    },
    "timestamps": {
      "start": "2025-09-24T10:00:00Z",
      "end": "2025-09-24T10:00:06Z",
      "interval_ms": 1000
    },
    "metadata": {
      "compression_ratio": 0.65,
      "original_size_bytes": 4096,
      "compressed_size_bytes": 2662
    }
  }
}
```

---

## 📊 Pokročilé použití

### Analýza nabíjecích relací
```python
import requests
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

class ChargingSessionAnalyzer:
    def __init__(self, api_key, api_secret):
        self.auth = (api_key, api_secret)
        self.base_url = "https://cloud.mybox.pro/admin-panel/v1/external"

    def analyze_charging_patterns(self, device_id, days=30):
        """Analyzuje vzory nabíjení za období"""

        # Získat data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Získat telemetrii výkonu
        power_data = self.get_telemetry_history(
            device_id, 'active_power',
            start_date, end_date,
            interval='5m'
        )

        df = pd.DataFrame(power_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)

        # Detekce nabíjecích relací (výkon > 1 kW)
        df['is_charging'] = df['value'] > 1.0

        # Najít začátky a konce relací
        sessions = []
        session_start = None

        for idx, row in df.iterrows():
            if row['is_charging'] and session_start is None:
                session_start = idx
            elif not row['is_charging'] and session_start is not None:
                sessions.append({
                    'start': session_start,
                    'end': idx,
                    'duration_hours': (idx - session_start).total_seconds() / 3600,
                    'avg_power_kw': df.loc[session_start:idx, 'value'].mean(),
                    'max_power_kw': df.loc[session_start:idx, 'value'].max(),
                    'energy_kwh': df.loc[session_start:idx, 'value'].sum() * (5/60)  # 5min intervals
                })
                session_start = None

        # Statistiky
        if sessions:
            sessions_df = pd.DataFrame(sessions)

            print(f"📊 Analýza nabíjecích relací za {days} dní:")
            print(f"Počet relací: {len(sessions)}")
            print(f"Průměrná délka: {sessions_df['duration_hours'].mean():.1f} hodin")
            print(f"Průměrná energie: {sessions_df['energy_kwh'].mean():.1f} kWh")
            print(f"Celková energie: {sessions_df['energy_kwh'].sum():.1f} kWh")

            # Vzory podle dne v týdnu
            sessions_df['weekday'] = sessions_df['start'].dt.day_name()
            weekday_stats = sessions_df.groupby('weekday').agg({
                'energy_kwh': 'sum',
                'duration_hours': 'mean'
            })

            print("\n📅 Vzory podle dne v týdnu:")
            print(weekday_stats)

            # Vzory podle hodiny
            sessions_df['start_hour'] = sessions_df['start'].dt.hour
            hourly_stats = sessions_df.groupby('start_hour').size()

            print("\n🕐 Nejčastější hodiny začátku nabíjení:")
            print(hourly_stats.sort_values(ascending=False).head(5))

            return sessions_df
        else:
            print("Žádné nabíjecí relace nenalezeny")
            return pd.DataFrame()

    def get_telemetry_history(self, device_id, telemetry_id, start_date, end_date, interval='5m'):
        """Získá historii telemetrie"""

        url = f"{self.base_url}/history/telemetry/{device_id}/{telemetry_id}"
        params = {
            'from': start_date.isoformat() + 'Z',
            'to': end_date.isoformat() + 'Z',
            'interval': interval
        }

        response = requests.get(url, params=params, auth=self.auth)

        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Chyba: {response.status_code}")
            return []

    def create_consumption_report(self, device_id, month, year):
        """Vytvoří měsíční report spotřeby"""

        # Určit rozsah dat
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(seconds=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(seconds=1)

        # Získat denní maxima energie
        energy_data = self.get_telemetry_history(
            device_id, 'active_energy',
            start_date, end_date,
            interval='1d'
        )

        if energy_data:
            df = pd.DataFrame(energy_data)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['date'] = df['timestamp'].dt.date

            # Vypočítat denní spotřebu
            df['daily_consumption'] = df['value'].diff()
            df = df[df['daily_consumption'] >= 0]  # Odstranit záporné hodnoty (resety)

            # Report
            report = {
                'device_id': device_id,
                'period': f"{year}-{month:02d}",
                'total_consumption_kwh': df['daily_consumption'].sum(),
                'avg_daily_consumption_kwh': df['daily_consumption'].mean(),
                'max_daily_consumption_kwh': df['daily_consumption'].max(),
                'min_daily_consumption_kwh': df['daily_consumption'].min(),
                'days_with_consumption': (df['daily_consumption'] > 0.1).sum(),
                'daily_data': df[['date', 'daily_consumption']].to_dict('records')
            }

            return report
        else:
            return None

# Použití
analyzer = ChargingSessionAnalyzer('YOUR_API_KEY', 'YOUR_API_SECRET')

# Analyzovat nabíjecí vzory
sessions = analyzer.analyze_charging_patterns('qfeb-od13-ul2c-sgrl', days=30)

# Vytvořit měsíční report
report = analyzer.create_consumption_report('qfeb-od13-ul2c-sgrl', 9, 2025)
if report:
    print(f"\n📋 Měsíční report {report['period']}:")
    print(f"Celková spotřeba: {report['total_consumption_kwh']:.1f} kWh")
    print(f"Průměrná denní spotřeba: {report['avg_daily_consumption_kwh']:.1f} kWh")
```

### Export dat pro externí analýzu
```javascript
class DataExporter {
  constructor(apiKey, apiSecret) {
    this.auth = { username: apiKey, password: apiSecret };
  }

  async exportToCSV(deviceId, telemetryIds, startDate, endDate, filename) {
    const data = {};

    // Získat data pro každou telemetrii
    for (const telemetryId of telemetryIds) {
      const response = await axios.get(
        `https://cloud.mybox.pro/admin-panel/v1/external/history/telemetry/${deviceId}/${telemetryId}`,
        {
          params: {
            from: startDate.toISOString(),
            to: endDate.toISOString(),
            interval: '5m'
          },
          auth: this.auth
        }
      );

      data[telemetryId] = response.data.data;
    }

    // Převést na CSV
    const csvRows = ['timestamp,' + telemetryIds.join(',')];

    // Najít všechny časové značky
    const timestamps = new Set();
    Object.values(data).forEach(telemetryData => {
      telemetryData.forEach(entry => timestamps.add(entry.timestamp));
    });

    // Seřadit časové značky
    const sortedTimestamps = Array.from(timestamps).sort();

    // Vytvořit řádky CSV
    sortedTimestamps.forEach(timestamp => {
      const row = [timestamp];

      telemetryIds.forEach(telemetryId => {
        const entry = data[telemetryId].find(e => e.timestamp === timestamp);
        row.push(entry ? entry.value : '');
      });

      csvRows.push(row.join(','));
    });

    // Uložit do souboru
    const fs = require('fs');
    fs.writeFileSync(filename, csvRows.join('\n'));

    console.log(`✅ Data exportována do ${filename}`);
    console.log(`   Počet řádků: ${csvRows.length - 1}`);
    console.log(`   Období: ${startDate.toISOString()} - ${endDate.toISOString()}`);
  }
}

// Použití
const exporter = new DataExporter('YOUR_API_KEY', 'YOUR_API_SECRET');

const telemetryIds = [
  'active_power',
  'voltage_l1',
  'voltage_l2',
  'voltage_l3',
  'current_l1',
  'current_l2',
  'current_l3'
];

exporter.exportToCSV(
  'qfeb-od13-ul2c-sgrl',
  telemetryIds,
  new Date('2025-09-01'),
  new Date('2025-09-24'),
  'charging_data_september_2025.csv'
);
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

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "Telemetry data not found for specified period"
}
```

#### 413 Payload Too Large
```json
{
  "status": 0,
  "error": "Payload Too Large",
  "message": "Requested data range too large. Maximum 31 days."
}
```

---

## 💡 Best Practices

### 1. Optimalizace dotazů
- Používejte agregaci pro dlouhé časové období
- Omezte rozsah dat na potřebné minimum
- Využívejte interval sampling pro redukci dat

### 2. Cachování
- Cachujte historická data, která se nemění
- Pro real-time data používejte Live API

### 3. Práce s velkými objemy dat
- Rozdělte velké dotazy na menší části
- Používejte torch endpoint pro vysokofrekvenční data
- Implementujte stránkování

### 4. Časové zóny
- Vždy používejte UTC v API volání
- Konvertujte na lokální čas až při zobrazení

---

## 📚 Další zdroje

- [Live Data API](/api/live-data) - Aktuální data v reálném čase
- [Telemetrie](/api/telemetry) - Popis telemetrických dat
- [Snapshot API](/api/snapshot) - Kompletní stavy zařízení
- [FAQ - Časté dotazy](/faq#historicka-data) - Odpovědi na časté dotazy