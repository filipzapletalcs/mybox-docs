# Advanced Historical Data API

## Přehled

Advanced Historical Data API poskytuje přístup k detailní historii senzorů, telemetrie a diagnostických dat zařízení MyBox. Tato data jsou klíčová pro pokročilou analytiku, prediktivní údržbu a optimalizaci provozu nabíjecích stanic.

## Klíčové koncepty

### Typy historických dat

1. **Sensor History** - Časové řady hodnot ze senzorů (proudy, napětí, teploty)
2. **Torch Data** - Kompletní diagnostický dump všech hodnot zařízení
3. **Telemetry History** - Historie telemetrických hodnot (signal, firmware, IP adresy)

### Datové charakteristiky

- **Vysoká frekvence**: Některé senzory ukládají data každé 2-4 sekundy
- **Dlouhodobá retence**: Data dostupná až 1 rok zpětně
- **Velké objemy**: Torch data mohou obsahovat stovky tisíc záznamů

## Endpointy

### 1. Historie senzorů

```
GET /external/history/sensor/{deviceId}/{nodeId}/{sensorId}
```

Získá historii konkrétního senzoru v časovém rozsahu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu (např. `ac-measurement`, `control`)
- `sensorId` - ID senzoru (např. `ac-current-1`, `temperature`)
- `from` - Začátek období (ISO 8601)
- `to` - Konec období (ISO 8601)

#### Příklad požadavku
```bash
GET /external/history/sensor/device-xxx/ac-measurement/ac-current-1?from=2025-09-23T00:00:00Z&to=2025-09-24T12:00:00Z
```

#### Příklad odpovědi

```json
{
  "status": 1,
  "data": [
    {
      "time": "2025-09-24T12:32:01.07Z",
      "value": "0.00"
    },
    {
      "time": "2025-09-24T12:31:58.96Z",
      "value": "1.50"
    },
    {
      "time": "2025-09-24T12:31:52.622Z",
      "value": "4.87"
    },
    {
      "time": "2025-09-24T12:31:48.39Z",
      "value": "4.86"
    }
  ],
  "meta": {
    "totalCount": 100
  }
}
```

### 2. Torch Data

```
GET /external/history/torch/{deviceId}
```

Získá kompletní diagnostický dump všech hodnot zařízení. **POZOR**: Může vrátit velmi velké množství dat (stovky MB).

#### Parametry
- `deviceId` - ID zařízení
- `from` - Začátek období
- `to` - Konec období

#### Příklad požadavku
```bash
GET /external/history/torch/device-xxx?from=2025-09-20T00:00:00Z&to=2025-09-24T23:59:59Z
```

#### Příklad odpovědi

```json
{
  "status": 1,
  "data": [
    {
      "title": "ac-measurement/ac-current-3",
      "time": "2025-09-24T12:36:14.35Z",
      "value": "2.46"
    },
    {
      "title": "control/state",
      "time": "2025-09-24T12:36:14.35Z",
      "value": "charging"
    },
    {
      "title": "meter/total-energy",
      "time": "2025-09-24T12:36:14.35Z",
      "value": "15234.56"
    }
    // ... potenciálně stovky tisíc dalších záznamů
  ],
  "meta": {
    "totalCount": 602969
  }
}
```

### 3. Historie telemetrie zařízení

```
GET /external/history/telemetry/{deviceId}/{telemetryId}
```

Získá historii telemetrické hodnoty zařízení.

#### Parametry
- `deviceId` - ID zařízení
- `telemetryId` - ID telemetrie (např. `signal`, `fw`, `ipw`)
- `from` - Začátek období
- `to` - Konec období

#### Příklad odpovědi

```json
{
  "status": 1,
  "data": [
    {
      "time": "2025-09-14T17:15:57.686Z",
      "value": "100"
    },
    {
      "time": "2025-08-25T08:18:08.246Z",
      "value": "100"
    }
  ],
  "meta": {
    "totalCount": 5
  }
}
```

### 4. Historie telemetrie nodu

```
GET /external/history/telemetry/{deviceId}/{nodeId}/{telemetryId}
```

Získá historii telemetrie konkrétního nodu.

#### Parametry
- `deviceId` - ID zařízení
- `nodeId` - ID nodu
- `telemetryId` - ID telemetrie nodu
- `from` - Začátek období
- `to` - Konec období

## Příklady použití

### Python - Analýza spotřeby energie

```python
import requests
from requests.auth import HTTPBasicAuth
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Konfigurace
API_URL = "https://cloud.mybox.pro/admin-panel/v1/external"
API_KEY = "váš_api_klíč"
API_SECRET = "váš_api_secret"

class EnergyAnalyzer:
    def __init__(self, device_id):
        self.device_id = device_id
        self.auth = HTTPBasicAuth(API_KEY, API_SECRET)

    def get_current_history(self, phase, days_back=7):
        """Získá historii proudu pro konkrétní fázi"""

        to_date = datetime.now()
        from_date = to_date - timedelta(days=days_back)

        response = requests.get(
            f"{API_URL}/history/sensor/{self.device_id}/ac-measurement/ac-current-{phase}",
            params={
                'from': from_date.isoformat() + 'Z',
                'to': to_date.isoformat() + 'Z'
            },
            auth=self.auth
        )

        if response.status_code == 200:
            data = response.json()

            # Převod na DataFrame
            df = pd.DataFrame(data['data'])
            df['time'] = pd.to_datetime(df['time'])
            df['value'] = df['value'].astype(float)
            df.set_index('time', inplace=True)

            return df

        return None

    def analyze_load_pattern(self):
        """Analyzuje vzorce zatížení napříč všemi fázemi"""

        results = {}

        for phase in [1, 2, 3]:
            df = self.get_current_history(phase, days_back=30)

            if df is not None and not df.empty:
                # Základní statistiky
                results[f'L{phase}'] = {
                    'mean': df['value'].mean(),
                    'max': df['value'].max(),
                    'min': df['value'].min(),
                    'std': df['value'].std(),
                    'percentile_95': df['value'].quantile(0.95)
                }

                # Detekce špiček
                threshold = df['value'].mean() + 2 * df['value'].std()
                peaks = df[df['value'] > threshold]
                results[f'L{phase}']['peak_count'] = len(peaks)

                # Průměr podle hodin
                hourly_avg = df.resample('1H').mean()
                results[f'L{phase}']['hourly_pattern'] = hourly_avg.to_dict()['value']

        return results

    def calculate_energy_consumption(self, voltage=230):
        """Vypočítá spotřebu energie na základě proudu"""

        total_energy = 0

        for phase in [1, 2, 3]:
            df = self.get_current_history(phase, days_back=1)

            if df is not None and not df.empty:
                # Resample na minuty pro přesnější výpočet
                df_resampled = df.resample('1T').mean()

                # Výpočet energie (kWh) = V * I * t / 1000
                # t = 1/60 hodiny pro každou minutu
                phase_energy = (voltage * df_resampled['value'].sum() * (1/60)) / 1000
                total_energy += phase_energy

        return total_energy

    def detect_anomalies(self):
        """Detekuje anomálie v proudových hodnotách"""

        anomalies = []

        for phase in [1, 2, 3]:
            df = self.get_current_history(phase, days_back=7)

            if df is not None and not df.empty:
                # Použití IQR metody pro detekci outliers
                Q1 = df['value'].quantile(0.25)
                Q3 = df['value'].quantile(0.75)
                IQR = Q3 - Q1

                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR

                # Najdi anomálie
                outliers = df[(df['value'] < lower_bound) | (df['value'] > upper_bound)]

                for idx, row in outliers.iterrows():
                    anomalies.append({
                        'phase': f'L{phase}',
                        'time': idx,
                        'value': row['value'],
                        'type': 'high' if row['value'] > upper_bound else 'low'
                    })

        return anomalies

# Použití
analyzer = EnergyAnalyzer('device-xxx')

# Analýza vzorců zatížení
patterns = analyzer.analyze_load_pattern()
print("Vzorce zatížení:")
for phase, stats in patterns.items():
    print(f"\n{phase}:")
    print(f"  Průměr: {stats['mean']:.2f} A")
    print(f"  Maximum: {stats['max']:.2f} A")
    print(f"  95. percentil: {stats['percentile_95']:.2f} A")
    print(f"  Počet špiček: {stats['peak_count']}")

# Výpočet spotřeby
consumption = analyzer.calculate_energy_consumption()
print(f"\nSpotřeba za posledních 24 hodin: {consumption:.2f} kWh")

# Detekce anomálií
anomalies = analyzer.detect_anomalies()
if anomalies:
    print(f"\nDetekováno {len(anomalies)} anomálií")
```

### JavaScript - Real-time monitoring s historickým kontextem

```javascript
const axios = require('axios');
const moment = require('moment');

class HistoricalMonitor {
    constructor(deviceId, apiKey, apiSecret) {
        this.deviceId = deviceId;
        this.apiUrl = 'https://cloud.mybox.pro/admin-panel/v1/external';
        this.auth = {
            username: apiKey,
            password: apiSecret
        };
    }

    async getSensorHistory(nodeId, sensorId, hoursBack = 24) {
        try {
            const from = moment().subtract(hoursBack, 'hours').toISOString();
            const to = moment().toISOString();

            const response = await axios.get(
                `${this.apiUrl}/history/sensor/${this.deviceId}/${nodeId}/${sensorId}`,
                {
                    params: { from, to },
                    auth: this.auth
                }
            );

            if (response.data.status === 1) {
                return response.data.data;
            }
        } catch (error) {
            console.error(`Error fetching sensor history: ${error.message}`);
        }

        return [];
    }

    async analyzePhaseBalance() {
        const phases = ['1', '2', '3'];
        const currentData = {};

        // Získej data pro všechny fáze
        for (const phase of phases) {
            const history = await this.getSensorHistory('ac-measurement', `ac-current-${phase}`, 1);

            if (history.length > 0) {
                const values = history.map(h => parseFloat(h.value));
                currentData[`L${phase}`] = {
                    current: values[0],
                    average: values.reduce((a, b) => a + b, 0) / values.length,
                    max: Math.max(...values),
                    min: Math.min(...values)
                };
            }
        }

        // Vypočítej nevyváženost
        const currents = Object.values(currentData).map(d => d.current);
        const maxCurrent = Math.max(...currents);
        const minCurrent = Math.min(...currents);
        const imbalance = maxCurrent - minCurrent;
        const imbalancePercent = (imbalance / maxCurrent) * 100;

        return {
            phases: currentData,
            imbalance: imbalance.toFixed(2),
            imbalancePercent: imbalancePercent.toFixed(1),
            balanced: imbalancePercent < 15 // Práh 15%
        };
    }

    async getChargingSession(hoursBack = 24) {
        // Získej historii stavů
        const history = await this.getSensorHistory('control', 'state', hoursBack);

        const sessions = [];
        let currentSession = null;

        for (let i = 0; i < history.length; i++) {
            const entry = history[i];

            if (entry.value === 'charging' && !currentSession) {
                // Začátek nabíjení
                currentSession = {
                    start: entry.time,
                    end: null
                };
            } else if (entry.value !== 'charging' && currentSession) {
                // Konec nabíjení
                currentSession.end = entry.time;
                sessions.push(currentSession);
                currentSession = null;
            }
        }

        // Pokud stále nabíjí
        if (currentSession) {
            currentSession.end = new Date().toISOString();
            currentSession.ongoing = true;
            sessions.push(currentSession);
        }

        // Vypočítej délky sessions
        return sessions.map(session => ({
            ...session,
            duration: moment(session.end).diff(moment(session.start), 'minutes'),
            durationHours: (moment(session.end).diff(moment(session.start), 'minutes') / 60).toFixed(2)
        }));
    }

    async generateDailyReport() {
        const balance = await this.analyzePhaseBalance();
        const sessions = await this.getChargingSession(24);

        const report = {
            timestamp: new Date().toISOString(),
            deviceId: this.deviceId,
            phaseBalance: balance,
            chargingSessions: {
                count: sessions.length,
                totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
                sessions: sessions
            }
        };

        return report;
    }
}

// Použití
async function runMonitoring() {
    const monitor = new HistoricalMonitor(
        'device-xxx',
        'api_key',
        'api_secret'
    );

    // Generuj denní report
    const report = await monitor.generateDailyReport();

    console.log('=== Denní report ===');
    console.log(`Zařízení: ${report.deviceId}`);
    console.log(`\nVyvážení fází:`);
    console.log(`  Nevyváženost: ${report.phaseBalance.imbalance} A (${report.phaseBalance.imbalancePercent}%)`);
    console.log(`  Status: ${report.phaseBalance.balanced ? 'OK' : 'VAROVÁNÍ'}`);

    console.log(`\nNabíjecí sessions:`);
    console.log(`  Počet: ${report.chargingSessions.count}`);
    console.log(`  Celková doba: ${(report.chargingSessions.totalMinutes / 60).toFixed(2)} hodin`);
}

runMonitoring();
```

### cURL - Získání torch dat

```bash
# POZOR: Torch data mohou být velmi velká (desítky MB)
# Doporučujeme použít krátký časový rozsah

curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/history/torch/device-xxx?from=2025-09-24T11:00:00Z&to=2025-09-24T12:00:00Z" \
  -u "api_key:api_secret" \
  -H "Accept: application/json" \
  -o torch_data.json

# Pro zpracování velkých dat použijte jq s filtrem
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/history/torch/device-xxx?from=2025-09-24T11:00:00Z&to=2025-09-24T12:00:00Z" \
  -u "api_key:api_secret" \
  -H "Accept: application/json" | \
  jq '.data[] | select(.title | contains("current"))'
```

## Praktické případy použití

### 1. Prediktivní údržba

```python
def predict_maintenance_needs(device_id):
    """Predikuje potřebu údržby na základě historických dat"""

    analyzer = EnergyAnalyzer(device_id)

    # Získej historii za 90 dní
    maintenance_indicators = {
        'high_current_events': 0,
        'imbalance_events': 0,
        'anomaly_count': 0,
        'efficiency_drop': False
    }

    # Analyzuj trendy
    for phase in [1, 2, 3]:
        df = analyzer.get_current_history(phase, days_back=90)

        if df is not None:
            # Detekce vysokých proudů
            high_current_threshold = 32  # A
            high_events = df[df['value'] > high_current_threshold]
            maintenance_indicators['high_current_events'] += len(high_events)

            # Trend analýza - zhoršuje se účinnost?
            weekly_avg = df.resample('1W').mean()
            if len(weekly_avg) >= 4:
                # Porovnej první a poslední týden
                first_week_avg = weekly_avg.iloc[0]['value']
                last_week_avg = weekly_avg.iloc[-1]['value']

                if last_week_avg > first_week_avg * 1.2:  # 20% nárůst
                    maintenance_indicators['efficiency_drop'] = True

    # Vyhodnoť riziko
    risk_score = 0
    if maintenance_indicators['high_current_events'] > 100:
        risk_score += 3
    if maintenance_indicators['efficiency_drop']:
        risk_score += 2
    if maintenance_indicators['anomaly_count'] > 50:
        risk_score += 2

    maintenance_needed = risk_score >= 5

    return {
        'maintenance_needed': maintenance_needed,
        'risk_score': risk_score,
        'indicators': maintenance_indicators,
        'recommendation': 'Doporučujeme provést údržbu do 30 dnů' if maintenance_needed else 'Stav v pořádku'
    }
```

### 2. Optimalizace tarifů

```python
def optimize_charging_schedule(device_id):
    """Optimalizuje nabíjecí rozvrh podle tarifů"""

    # Tarify (příklad)
    tariffs = {
        'low': {'hours': range(22, 6), 'price': 2.5},  # 22:00 - 06:00
        'high': {'hours': range(17, 21), 'price': 5.0}, # 17:00 - 21:00
        'normal': {'price': 3.5}  # Ostatní hodiny
    }

    analyzer = EnergyAnalyzer(device_id)

    # Získej historii nabíjení
    charging_patterns = {}

    for phase in [1, 2, 3]:
        df = analyzer.get_current_history(phase, days_back=30)

        if df is not None:
            # Agreguj podle hodin
            df['hour'] = df.index.hour
            hourly = df.groupby('hour')['value'].agg(['mean', 'count'])

            for hour, data in hourly.iterrows():
                if hour not in charging_patterns:
                    charging_patterns[hour] = {'total_current': 0, 'sessions': 0}

                charging_patterns[hour]['total_current'] += data['mean']
                charging_patterns[hour]['sessions'] += data['count']

    # Vypočítej náklady
    current_cost = 0
    optimal_cost = 0

    for hour, data in charging_patterns.items():
        energy = data['total_current'] * 230 / 1000  # kWh

        # Současné náklady
        if hour in tariffs['low']['hours']:
            current_cost += energy * tariffs['low']['price']
        elif hour in tariffs['high']['hours']:
            current_cost += energy * tariffs['high']['price']
        else:
            current_cost += energy * tariffs['normal']['price']

        # Optimální náklady (vše v low tarifu)
        optimal_cost += energy * tariffs['low']['price']

    savings_potential = current_cost - optimal_cost
    savings_percent = (savings_potential / current_cost) * 100

    return {
        'current_monthly_cost': current_cost,
        'optimal_monthly_cost': optimal_cost,
        'savings_potential': savings_potential,
        'savings_percent': savings_percent,
        'recommendation': f'Přesunutím nabíjení do nočních hodin můžete ušetřit {savings_percent:.1f}%'
    }
```

### 3. Detekce poruch

```python
def detect_failures(device_id):
    """Detekuje potenciální poruchy na základě vzorců v datech"""

    issues = []

    # Kontrola proudových senzorů
    for phase in [1, 2, 3]:
        response = requests.get(
            f"{API_URL}/history/sensor/{device_id}/ac-measurement/ac-current-{phase}",
            params={
                'from': (datetime.now() - timedelta(hours=24)).isoformat() + 'Z',
                'to': datetime.now().isoformat() + 'Z'
            },
            auth=HTTPBasicAuth(API_KEY, API_SECRET)
        )

        if response.status_code == 200:
            data = response.json()['data']

            if len(data) > 0:
                values = [float(d['value']) for d in data]

                # Detekce konstantních hodnot (zaseknutý senzor)
                if len(set(values)) == 1:
                    issues.append({
                        'type': 'stuck_sensor',
                        'severity': 'high',
                        'description': f'Senzor ac-current-{phase} vrací konstantní hodnotu',
                        'value': values[0]
                    })

                # Detekce negativních proudů
                negative_values = [v for v in values if v < -0.5]
                if len(negative_values) > len(values) * 0.1:  # Více než 10%
                    issues.append({
                        'type': 'reverse_current',
                        'severity': 'medium',
                        'description': f'Detekován zpětný proud na fázi L{phase}',
                        'occurrences': len(negative_values)
                    })

                # Detekce přetížení
                overload = [v for v in values if v > 32]
                if overload:
                    issues.append({
                        'type': 'overload',
                        'severity': 'high',
                        'description': f'Přetížení na fázi L{phase}',
                        'max_value': max(overload),
                        'occurrences': len(overload)
                    })

    return issues
```

## Best Practices

### 1. Optimalizace výkonu

```python
# Použijte batch požadavky pro více senzorů
async def get_all_phase_currents(device_id):
    tasks = []
    for phase in [1, 2, 3]:
        task = get_sensor_history_async(
            device_id,
            'ac-measurement',
            f'ac-current-{phase}'
        )
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return results
```

### 2. Cachování dat

```python
class HistoricalDataCache:
    def __init__(self, ttl_seconds=3600):
        self.cache = {}
        self.ttl = ttl_seconds

    def get_or_fetch(self, key, fetch_function):
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry['timestamp'] < self.ttl:
                return entry['data']

        # Fetch nová data
        data = fetch_function()
        self.cache[key] = {
            'data': data,
            'timestamp': time.time()
        }
        return data
```

### 3. Práce s velkými daty (Torch)

```python
def process_torch_data_in_chunks(device_id, chunk_hours=1):
    """Zpracovává torch data po částech"""

    results = []
    current_time = datetime.now()

    for i in range(24):  # Posledních 24 hodin
        from_time = current_time - timedelta(hours=i+1)
        to_time = current_time - timedelta(hours=i)

        # Získej chunk
        response = requests.get(
            f"{API_URL}/history/torch/{device_id}",
            params={
                'from': from_time.isoformat() + 'Z',
                'to': to_time.isoformat() + 'Z'
            },
            auth=HTTPBasicAuth(API_KEY, API_SECRET),
            stream=True  # Stream pro velká data
        )

        if response.status_code == 200:
            # Zpracuj chunk
            chunk_data = response.json()
            results.extend(chunk_data['data'])

    return results
```

## Limity a omezení

1. **Datové limity**
   - Max 100 000 záznamů na požadavek
   - Torch data mohou být omezena na 50 MB

2. **Časové limity**
   - Historie dostupná max 1 rok zpětně
   - Minimální granularita závisí na typu senzoru

3. **Rate limiting**
   - Max 100 požadavků za minutu
   - Pro torch data max 10 požadavků za minutu

## Chybové stavy

- **404 Not Found** - Senzor/telemetrie neexistuje
- **400 Bad Request** - Neplatný časový rozsah
- **413 Payload Too Large** - Příliš velký rozsah pro torch data
- **429 Too Many Requests** - Překročen rate limit
- **503 Service Unavailable** - Dočasná nedostupnost

## Doporučení pro vývojáře

1. **Vždy používejte časové filtry** - Nikdy nestahujte všechna data najednou

2. **Implementujte exponential backoff** pro opakované pokusy

3. **Pro real-time monitoring** kombinujte live data s historií

4. **Používejte kompresci** při stahování velkých objemů dat

5. **Implementujte progresivní načítání** pro UI vizualizace

## Shrnutí

Advanced Historical Data API poskytuje mocný nástroj pro:
- **Data Science**: Analýza trendů a vzorců
- **Prediktivní údržbu**: Včasná detekce problémů
- **Optimalizaci**: Snížení nákladů a zvýšení efektivity
- **Compliance**: Audit trail a reporting
- **Business Intelligence**: Data-driven rozhodování