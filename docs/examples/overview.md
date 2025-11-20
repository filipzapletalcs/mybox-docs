---
id: examples-overview
title: 💻 Příklady kódu
sidebar_position: 1
---

# Příklady kódu pro MyBox API

Praktické příklady integrace MyBox API v různých programovacích jazycích.

## 🚀 Rychlý přehled

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Získání seznamu zařízení

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/device" \
  -u "API_KEY:API_SECRET" \
  -H "Accept: application/json"
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
from requests.auth import HTTPBasicAuth

# Nastavení credentials
API_KEY = "váš_api_key"
API_SECRET = "váš_api_secret"
BASE_URL = "https://cloud.mybox.pro/admin-panel/v1"

# Získání seznamu zařízení
response = requests.get(
    f"{BASE_URL}/external/device",
    auth=HTTPBasicAuth(API_KEY, API_SECRET),
    headers={"Accept": "application/json"}
)

if response.status_code == 200:
    devices = response.json()
    for device in devices.get('data', []):
        print(f"Zařízení: {device['title']} ({device['identifier']})")
else:
    print(f"Chyba: {response.status_code}")
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
// Nastavení
const API_KEY = 'váš_api_key';
const API_SECRET = 'váš_api_secret';
const BASE_URL = 'https://cloud.mybox.pro/admin-panel/v1';

// Funkce pro API volání
async function getDevices() {
  const auth = btoa(`${API_KEY}:${API_SECRET}`);
  
  try {
    const response = await fetch(`${BASE_URL}/external/device`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Zařízení:', data.data);
      return data.data;
    } else {
      console.error('Chyba:', response.status);
    }
  } catch (error) {
    console.error('Chyba připojení:', error);
  }
}

// Použití
getDevices();
```

  </TabItem>
</Tabs>

## 📊 Live data - aktuální stav nabíjení

<Tabs>
  <TabItem value="python" label="Python">

```python
def get_live_data(device_id):
    """Získá aktuální data ze zařízení"""
    
    url = f"{BASE_URL}/external/live/device/{device_id}"
    response = requests.get(
        url,
        auth=HTTPBasicAuth(API_KEY, API_SECRET),
        headers={"Accept": "application/json"}
    )
    
    if response.status_code == 200:
        data = response.json()['data']
        
        # Výpis klíčových informací
        print(f"Stav: {data.get('state', 'neznámý')}")
        
        # Telemetrie
        if 'telemetries' in data:
            for telemetry in data['telemetries']:
                if telemetry['id'] == 'charging_state':
                    print(f"Nabíjení: {telemetry['value']}")
                elif telemetry['id'] == 'power':
                    print(f"Výkon: {telemetry['value']} W")
                elif telemetry['id'] == 'session_energy':
                    print(f"Nabito: {telemetry['value']} kWh")
        
        return data
    else:
        print(f"Chyba při získávání dat: {response.status_code}")
        return None

# Použití
device_id = "abc1-def2-ghi3-jkl4"
live_data = get_live_data(device_id)
```

  </TabItem>
  <TabItem value="javascript" label="Node.js">

```javascript
const axios = require('axios');

class MyBoxAPI {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = 'https://cloud.mybox.pro/admin-panel/v1';
  }

  async getLiveData(deviceId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/external/live/device/${deviceId}`,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret
          },
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const data = response.data.data;
      
      // Zpracování telemetrie
      const telemetry = {};
      if (data.telemetries) {
        data.telemetries.forEach(t => {
          telemetry[t.id] = {
            value: t.value,
            unit: t.unit,
            timestamp: t.timestamp
          };
        });
      }

      return {
        state: data.state,
        telemetry: telemetry,
        raw: data
      };
    } catch (error) {
      console.error('Chyba API:', error.message);
      throw error;
    }
  }
}

// Použití
const api = new MyBoxAPI('API_KEY', 'API_SECRET');
api.getLiveData('abc1-def2-ghi3-jkl4')
  .then(data => {
    console.log('Stav zařízení:', data.state);
    if (data.telemetry.power) {
      console.log('Aktuální výkon:', data.telemetry.power.value, 'W');
    }
  });
```

  </TabItem>
</Tabs>

## 📈 Historická data - telemetrie

<Tabs>
  <TabItem value="python" label="Python">

```python
from datetime import datetime, timedelta

def get_telemetry_history(device_id, telemetry_id, hours=24):
    """Získá historii telemetrie za posledních N hodin"""
    
    # Časové rozmezí
    date_to = datetime.now()
    date_from = date_to - timedelta(hours=hours)
    
    # Formátování dat pro API
    params = {
        'dateFrom': date_from.strftime('%Y-%m-%d %H:%M:%S'),
        'dateTo': date_to.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    url = f"{BASE_URL}/external/history/telemetry/{device_id}/{telemetry_id}"
    response = requests.get(
        url,
        auth=HTTPBasicAuth(API_KEY, API_SECRET),
        params=params,
        headers={"Accept": "application/json"}
    )
    
    if response.status_code == 200:
        data = response.json()['data']
        
        # Zpracování dat pro graf
        timestamps = []
        values = []
        
        for point in data:
            timestamps.append(point['timestamp'])
            values.append(point['value'])
        
        return timestamps, values
    else:
        print(f"Chyba: {response.status_code}")
        return [], []

# Příklad: Historie výkonu za 24 hodin
device_id = "abc1-def2-ghi3-jkl4"
timestamps, power_values = get_telemetry_history(device_id, "power", 24)

# Vykreslení grafu (vyžaduje matplotlib)
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 6))
plt.plot(timestamps, power_values)
plt.title('Historie výkonu nabíjení')
plt.xlabel('Čas')
plt.ylabel('Výkon (W)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

  </TabItem>
</Tabs>

## 🔋 Charging Reports - přehled nabíjecích relací

<Tabs>
  <TabItem value="python" label="Python">

```python
def get_charging_reports(device_id, date_from=None, date_to=None):
    """Získá přehled nabíjecích relací"""
    
    params = {}
    if date_from:
        params['dateFrom'] = date_from
    if date_to:
        params['dateTo'] = date_to
    
    url = f"{BASE_URL}/external/charging-reports/device/{device_id}"
    response = requests.get(
        url,
        auth=HTTPBasicAuth(API_KEY, API_SECRET),
        params=params,
        headers={"Accept": "application/json"}
    )
    
    if response.status_code == 200:
        reports = response.json()['data']
        
        total_energy = 0
        total_sessions = len(reports)
        
        for report in reports:
            energy = report.get('energy_consumed', 0)
            total_energy += energy
            
            print(f"Relace: {report['start_time']} - {report['end_time']}")
            print(f"  Spotřeba: {energy} kWh")
            print(f"  Cena: {report.get('total_cost', 0)} Kč")
            print()
        
        print(f"Celkem relací: {total_sessions}")
        print(f"Celková spotřeba: {total_energy:.2f} kWh")
        
        return reports
    else:
        print(f"Chyba: {response.status_code}")
        return []

# Použití - relace za poslední měsíc
from datetime import datetime, timedelta

date_to = datetime.now().strftime('%Y-%m-%d')
date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

reports = get_charging_reports("abc1-def2-ghi3-jkl4", date_from, date_to)
```

  </TabItem>
</Tabs>

## 🔍 Snapshot - kompletní stav všech senzorů

<Tabs>
  <TabItem value="javascript" label="JavaScript">

```javascript
async function getDeviceSnapshot(deviceId) {
  const url = `${BASE_URL}/external/history/snapshot/${deviceId}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const snapshot = data.data;
      
      // Zpracování nodes (modulů)
      console.log('=== SNAPSHOT ZAŘÍZENÍ ===');
      console.log(`Čas: ${snapshot.timestamp}`);
      console.log(`Stav: ${snapshot.state}`);
      
      // Procházení všech nodes
      if (snapshot.nodes) {
        snapshot.nodes.forEach(node => {
          console.log(`\nModul: ${node.name} (${node.id})`);
          
          // Senzory
          if (node.sensors) {
            node.sensors.forEach(sensor => {
              console.log(`  ${sensor.name}: ${sensor.value} ${sensor.unit}`);
            });
          }
          
          // Telemetrie
          if (node.telemetries) {
            node.telemetries.forEach(telemetry => {
              console.log(`  ${telemetry.name}: ${telemetry.value} ${telemetry.unit}`);
            });
          }
        });
      }
      
      return snapshot;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Chyba při získávání snapshot:', error);
    throw error;
  }
}

// Použití s periodickým obnovováním
setInterval(async () => {
  try {
    const snapshot = await getDeviceSnapshot('abc1-def2-ghi3-jkl4');
    // Zpracování dat, aktualizace UI, atd.
  } catch (error) {
    console.error('Chyba:', error);
  }
}, 30000); // Každých 30 sekund
```

  </TabItem>
</Tabs>

## 🛠️ Pomocné funkce

### Retry logic s exponential backoff

```javascript
async function apiCallWithRetry(fn, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Pokud je to rate limit, počkat
      if (error.response?.status === 429) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`Rate limit, čekám ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Jiná chyba - nepokračovat
      }
    }
  }
  
  throw lastError;
}
```

### Batch processing

```python
import asyncio
import aiohttp
from aiohttp import BasicAuth

async def fetch_device_data(session, device_id):
    """Asynchronně získá data zařízení"""
    url = f"{BASE_URL}/external/device/{device_id}"
    auth = BasicAuth(API_KEY, API_SECRET)
    
    async with session.get(url, auth=auth) as response:
        return await response.json()

async def batch_fetch_devices(device_ids):
    """Paralelně získá data více zařízení"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_device_data(session, did) for did in device_ids]
        results = await asyncio.gather(*tasks)
        return results

# Použití
device_ids = ["device1", "device2", "device3"]
results = asyncio.run(batch_fetch_devices(device_ids))
```

## 📚 Další příklady

### ⚡ Pokročilé funkce nabíjení
- **[Dynamic Load Management (DLM)](./dlm-setup)** - Inteligentní řízení zátěže pro více nabíjecích stanic
- **[Nabíjení podle spotových cen](./spot-price-charging)** - Optimalizace nákladů podle cen elektřiny
- **[Monitoring spotřeby energie](./energy-monitoring)** - Detailní analýza a monitoring

### 🏠 Integrace a automatizace *(připravuje se)*
- [Monitoring flotily vozidel](./fleet-monitoring)
- [Integrace s Home Assistant](./home-assistant)
- [Webhook listener](./webhooks)
- [Export dat do CSV](./data-export)

## 💡 Tipy pro vývoj

1. **Vždy používejte HTTPS**
2. **Implementujte proper error handling**
3. **Cachujte statická data**
4. **Respektujte rate limits**
5. **Logujte API volání pro debugging**