# ⚙️ Konfigurace zařízení

## Přehled

API pro konfiguraci zařízení umožňuje číst a spravovat nastavení nabíjecích stanic MyBox. Každé zařízení má sadu konfigurovatelných parametrů (options), které řídí jeho chování, výkon a funkce. Toto API poskytuje přístup k aktuálním hodnotám těchto parametrů a jejich historii změn.

### Hlavní funkce
- Získání všech konfiguračních parametrů zařízení
- Čtení konkrétního parametru podle ID
- Historie změn konfigurace
- Konfigurace na úrovni jednotlivých nodů (pro multi-node zařízení)

### Kategorie konfiguračních parametrů
- **Výkon a nabíjení** - maximální výkon, proudové omezení, fáze
- **Síťová nastavení** - IP konfigurace, OCPP parametry, komunikační protokoly
- **Bezpečnost** - autentizace, autorizace, šifrování
- **Uživatelské rozhraní** - LED indikace, zvukové signály, displej
- **Energetický management** - load balancing, tarify, scheduling
- **Diagnostika** - logy, debug módy, reporting

### Use cases
- **Remote management** - vzdálená správa a konfigurace zařízení
- **Optimalizace výkonu** - dynamické přizpůsobení parametrů podle potřeb
- **Troubleshooting** - diagnostika problémů přes konfigurační nastavení
- **Compliance** - zajištění souladu s normami a předpisy
- **Fleet management** - hromadná správa konfigurace více zařízení

---

## 📋 Všechny konfigurace zařízení

### Endpoint
```
GET /admin-panel/v1/external/live/device/{deviceId}/option
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | ID zařízení (16 znaků hexadecimální) |

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `category` | string | ❌ | Filtrování podle kategorie |
| `include_readonly` | boolean | ❌ | Zahrnout read-only parametry (výchozí: true) |
| `include_hidden` | boolean | ❌ | Zahrnout skryté parametry (výchozí: false) |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "device_name": "Nabíjecí stanice - Hlavní budova",
    "timestamp": "2024-03-25T14:30:00.123Z",
    "options": [
      {
        "id": "max_charging_power",
        "name": "Maximální nabíjecí výkon",
        "description": "Maximální povolený výkon pro nabíjení (W)",
        "category": "charging",
        "value": 11000,
        "unit": "W",
        "type": "integer",
        "min_value": 3700,
        "max_value": 22000,
        "step": 100,
        "default_value": 22000,
        "readonly": false,
        "requires_restart": false,
        "affects_billing": true,
        "validation": {
          "pattern": null,
          "allowed_values": null,
          "dependencies": ["available_phases", "grid_connection_type"]
        },
        "metadata": {
          "last_changed": "2024-03-24T18:00:00Z",
          "changed_by": "admin@example.com",
          "change_reason": "Omezení kvůli síťové kapacitě",
          "firmware_min_version": "2.0.0"
        }
      },
      {
        "id": "available_phases",
        "name": "Dostupné fáze",
        "description": "Počet dostupných fází pro nabíjení",
        "category": "electrical",
        "value": 3,
        "unit": null,
        "type": "integer",
        "min_value": 1,
        "max_value": 3,
        "default_value": 3,
        "readonly": false,
        "requires_restart": true,
        "validation": {
          "allowed_values": [1, 3]
        }
      },
      {
        "id": "ocpp_url",
        "name": "OCPP Server URL",
        "description": "URL adresa OCPP serveru pro komunikaci",
        "category": "network",
        "value": "wss://ocpp.mybox.eco/ws/000C1234567890AB",
        "unit": null,
        "type": "string",
        "readonly": false,
        "requires_restart": true,
        "validation": {
          "pattern": "^(ws|wss)://.*$",
          "max_length": 255
        },
        "metadata": {
          "connection_status": "connected",
          "last_connection": "2024-03-25T14:29:55Z",
          "protocol_version": "OCPP 1.6J"
        }
      },
      {
        "id": "authentication_methods",
        "name": "Metody autentizace",
        "description": "Povolené metody autentizace uživatelů",
        "category": "security",
        "value": ["rfid", "app", "pin"],
        "type": "array",
        "item_type": "string",
        "readonly": false,
        "validation": {
          "allowed_values": ["rfid", "app", "pin", "plug_and_charge", "credit_card"],
          "min_items": 1,
          "max_items": 5
        }
      },
      {
        "id": "load_balancing_enabled",
        "name": "Load Balancing",
        "description": "Povolit dynamické řízení zátěže",
        "category": "energy_management",
        "value": true,
        "type": "boolean",
        "default_value": false,
        "readonly": false,
        "validation": {
          "dependencies": ["load_balancing_mode", "max_grid_power"]
        }
      },
      {
        "id": "load_balancing_mode",
        "name": "Režim Load Balancing",
        "description": "Algoritmus pro řízení zátěže",
        "category": "energy_management",
        "value": "fair_share",
        "type": "enum",
        "readonly": false,
        "validation": {
          "allowed_values": ["fair_share", "first_come_first_serve", "priority", "scheduled"],
          "dependencies": ["load_balancing_enabled"]
        },
        "metadata": {
          "active_when": "load_balancing_enabled=true"
        }
      },
      {
        "id": "max_grid_power",
        "name": "Maximální příkon ze sítě",
        "description": "Celkový maximální příkon pro všechny konektory",
        "category": "energy_management",
        "value": 32000,
        "unit": "W",
        "type": "integer",
        "min_value": 3700,
        "max_value": 100000,
        "readonly": false,
        "affects_billing": false,
        "validation": {
          "dependencies": ["load_balancing_enabled"]
        }
      },
      {
        "id": "led_brightness",
        "name": "Jas LED indikace",
        "description": "Úroveň jasu LED indikátorů (0-100%)",
        "category": "ui",
        "value": 75,
        "unit": "%",
        "type": "integer",
        "min_value": 0,
        "max_value": 100,
        "step": 5,
        "default_value": 100,
        "readonly": false,
        "requires_restart": false
      },
      {
        "id": "sound_enabled",
        "name": "Zvuková signalizace",
        "description": "Povolit zvukové signály při událostech",
        "category": "ui",
        "value": true,
        "type": "boolean",
        "default_value": true,
        "readonly": false
      },
      {
        "id": "tariff_schedule",
        "name": "Tarifní plán",
        "description": "Časový rozvrh tarifů",
        "category": "billing",
        "value": {
          "weekday": {
            "peak": {
              "from": "06:00",
              "to": "22:00",
              "price_per_kwh": 8.50
            },
            "off_peak": {
              "from": "22:00",
              "to": "06:00",
              "price_per_kwh": 6.00
            }
          },
          "weekend": {
            "all_day": {
              "price_per_kwh": 7.00
            }
          }
        },
        "type": "object",
        "readonly": false,
        "affects_billing": true,
        "validation": {
          "schema": "tariff_schedule_v1"
        }
      },
      {
        "id": "firmware_version",
        "name": "Verze firmware",
        "description": "Aktuální verze firmware zařízení",
        "category": "system",
        "value": "2.3.4",
        "type": "string",
        "readonly": true,
        "metadata": {
          "build_date": "2024-03-15T10:00:00Z",
          "update_available": false,
          "latest_version": "2.3.4"
        }
      },
      {
        "id": "serial_number",
        "name": "Sériové číslo",
        "description": "Výrobní sériové číslo zařízení",
        "category": "system",
        "value": "MB2023-AB-1234567",
        "type": "string",
        "readonly": true
      },
      {
        "id": "network_config",
        "name": "Síťová konfigurace",
        "description": "Nastavení síťového připojení",
        "category": "network",
        "value": {
          "dhcp_enabled": true,
          "ip_address": "192.168.1.100",
          "subnet_mask": "255.255.255.0",
          "gateway": "192.168.1.1",
          "dns_primary": "8.8.8.8",
          "dns_secondary": "8.8.4.4"
        },
        "type": "object",
        "readonly": false,
        "requires_restart": true
      },
      {
        "id": "maintenance_mode",
        "name": "Režim údržby",
        "description": "Aktivovat režim údržby (zakáže nabíjení)",
        "category": "maintenance",
        "value": false,
        "type": "boolean",
        "readonly": false,
        "metadata": {
          "warning": "Aktivace zastaví všechna probíhající nabíjení"
        }
      }
    ],
    "categories": {
      "charging": {
        "name": "Nabíjení",
        "description": "Parametry související s procesem nabíjení",
        "count": 3
      },
      "electrical": {
        "name": "Elektrické parametry",
        "description": "Elektrická konfigurace a omezení",
        "count": 2
      },
      "network": {
        "name": "Síť a komunikace",
        "description": "Síťová nastavení a komunikační protokoly",
        "count": 2
      },
      "security": {
        "name": "Bezpečnost",
        "description": "Autentizace a bezpečnostní nastavení",
        "count": 1
      },
      "energy_management": {
        "name": "Řízení energie",
        "description": "Load balancing a optimalizace spotřeby",
        "count": 3
      },
      "ui": {
        "name": "Uživatelské rozhraní",
        "description": "Nastavení displeje, LED a zvuků",
        "count": 2
      },
      "billing": {
        "name": "Fakturace",
        "description": "Tarify a cenová nastavení",
        "count": 1
      },
      "system": {
        "name": "Systém",
        "description": "Systémové informace a nastavení",
        "count": 2
      },
      "maintenance": {
        "name": "Údržba",
        "description": "Servisní a údržbové funkce",
        "count": 1
      }
    }
  }
}
```

### Příklad volání

#### cURL
```bash
# Získání všech konfigurací
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/live/device/000C1234567890AB/option" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"

# Filtrování podle kategorie
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/live/device/000C1234567890AB/option?category=charging" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests
import json

def get_device_configuration(device_id, category=None):
    """Získá konfiguraci zařízení"""
    url = f"https://api.mybox.eco/admin-panel/v1/external/live/device/{device_id}/option"

    params = {}
    if category:
        params['category'] = category

    headers = {
        "Authorization": "Bearer YOUR_API_TOKEN",
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Získání kompletní konfigurace
device_id = "000C1234567890AB"
config = get_device_configuration(device_id)

# Vypsat důležité parametry
print(f"Konfigurace zařízení {device_id}:")
print("=" * 50)

for option in config['data']['options']:
    if not option.get('readonly', False):
        value_str = str(option['value'])
        if option.get('unit'):
            value_str += f" {option['unit']}"

        print(f"{option['name']}:")
        print(f"  ID: {option['id']}")
        print(f"  Hodnota: {value_str}")
        print(f"  Kategorie: {option['category']}")

        if option.get('affects_billing'):
            print("  ⚠️ Ovlivňuje fakturaci")
        if option.get('requires_restart'):
            print("  ⚠️ Vyžaduje restart")
        print()

# Analýza konfigurace
def analyze_configuration(config):
    """Analyzuje konfiguraci a doporučí optimalizace"""
    recommendations = []
    options = config['data']['options']

    # Najít konkrétní parametry
    max_power = next((o for o in options if o['id'] == 'max_charging_power'), None)
    load_balancing = next((o for o in options if o['id'] == 'load_balancing_enabled'), None)

    if max_power and max_power['value'] < max_power['max_value']:
        recommendations.append({
            'parameter': 'max_charging_power',
            'current': max_power['value'],
            'recommended': max_power['max_value'],
            'reason': 'Využijte plný potenciál zařízení'
        })

    if load_balancing and not load_balancing['value']:
        recommendations.append({
            'parameter': 'load_balancing_enabled',
            'current': False,
            'recommended': True,
            'reason': 'Optimalizujte distribuci energie mezi konektory'
        })

    return recommendations

recommendations = analyze_configuration(config)
if recommendations:
    print("\n🔧 Doporučené optimalizace:")
    for rec in recommendations:
        print(f"  - {rec['parameter']}: {rec['reason']}")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

class DeviceConfigurator {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.mybox.eco/admin-panel/v1/external';
  }

  async getConfiguration(deviceId, options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.includeHidden) params.append('include_hidden', 'true');

    const url = `${this.baseUrl}/live/device/${deviceId}/option${params.toString() ? '?' + params : ''}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Accept': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching configuration:', error.message);
      throw error;
    }
  }

  async getConfigurationByCategory(deviceId) {
    const config = await this.getConfiguration(deviceId);
    const byCategory = {};

    config.options.forEach(option => {
      if (!byCategory[option.category]) {
        byCategory[option.category] = [];
      }
      byCategory[option.category].push(option);
    });

    return byCategory;
  }

  validateConfiguration(config) {
    const issues = [];

    config.options.forEach(option => {
      // Kontrola hodnot mimo rozsah
      if (option.min_value !== undefined && option.value < option.min_value) {
        issues.push({
          severity: 'error',
          parameter: option.id,
          message: `Hodnota ${option.value} je pod minimem ${option.min_value}`
        });
      }

      if (option.max_value !== undefined && option.value > option.max_value) {
        issues.push({
          severity: 'error',
          parameter: option.id,
          message: `Hodnota ${option.value} je nad maximem ${option.max_value}`
        });
      }

      // Kontrola závislostí
      if (option.validation && option.validation.dependencies) {
        option.validation.dependencies.forEach(depId => {
          const dependency = config.options.find(o => o.id === depId);
          if (!dependency) {
            issues.push({
              severity: 'warning',
              parameter: option.id,
              message: `Chybí závislý parametr ${depId}`
            });
          }
        });
      }
    });

    return issues;
  }

  async compareWithDefaults(deviceId) {
    const config = await this.getConfiguration(deviceId);
    const differences = [];

    config.options.forEach(option => {
      if (option.default_value !== undefined && option.value !== option.default_value) {
        differences.push({
          parameter: option.id,
          name: option.name,
          current: option.value,
          default: option.default_value,
          unit: option.unit
        });
      }
    });

    return differences;
  }
}

// Použití
const configurator = new DeviceConfigurator('YOUR_API_TOKEN');

async function manageDeviceConfig() {
  const deviceId = '000C1234567890AB';

  // Získat konfiguraci podle kategorií
  const byCategory = await configurator.getConfigurationByCategory(deviceId);

  console.log('📊 Konfigurace podle kategorií:');
  Object.entries(byCategory).forEach(([category, options]) => {
    console.log(`\n${category}:`);
    options.forEach(opt => {
      const value = typeof opt.value === 'object'
        ? JSON.stringify(opt.value)
        : opt.value;
      console.log(`  - ${opt.name}: ${value}${opt.unit ? ' ' + opt.unit : ''}`);
    });
  });

  // Validace konfigurace
  const config = await configurator.getConfiguration(deviceId);
  const issues = configurator.validateConfiguration(config);

  if (issues.length > 0) {
    console.log('\n⚠️ Nalezené problémy v konfiguraci:');
    issues.forEach(issue => {
      console.log(`  [${issue.severity.toUpperCase()}] ${issue.parameter}: ${issue.message}`);
    });
  }

  // Porovnání s výchozími hodnotami
  const differences = await configurator.compareWithDefaults(deviceId);
  if (differences.length > 0) {
    console.log('\n🔄 Rozdíly oproti výchozím hodnotám:');
    differences.forEach(diff => {
      console.log(`  - ${diff.name}:`);
      console.log(`    Aktuální: ${diff.current}${diff.unit ? ' ' + diff.unit : ''}`);
      console.log(`    Výchozí: ${diff.default}${diff.unit ? ' ' + diff.unit : ''}`);
    });
  }
}

manageDeviceConfig();
```

---

## 🔍 Konkrétní konfigurace

### Endpoint
```
GET /admin-panel/v1/external/live/device/{deviceId}/option/{optionId}
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
  "data": {
    "device_id": "000C1234567890AB",
    "option": {
      "id": "max_charging_power",
      "name": "Maximální nabíjecí výkon",
      "description": "Maximální povolený výkon pro nabíjení (W)",
      "category": "charging",
      "value": 11000,
      "unit": "W",
      "type": "integer",
      "min_value": 3700,
      "max_value": 22000,
      "step": 100,
      "default_value": 22000,
      "readonly": false,
      "requires_restart": false,
      "affects_billing": true,
      "validation": {
        "pattern": null,
        "allowed_values": null,
        "dependencies": ["available_phases", "grid_connection_type"]
      },
      "metadata": {
        "last_changed": "2024-03-24T18:00:00Z",
        "changed_by": "admin@example.com",
        "change_reason": "Omezení kvůli síťové kapacitě",
        "firmware_min_version": "2.0.0",
        "history_available": true
      },
      "related_options": [
        {
          "id": "available_phases",
          "name": "Dostupné fáze",
          "relationship": "dependency"
        },
        {
          "id": "load_balancing_enabled",
          "name": "Load Balancing",
          "relationship": "affects"
        }
      ]
    },
    "timestamp": "2024-03-25T14:35:00.123Z"
  }
}
```

---

## 📊 Historie konfigurace

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

#### Query parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `from` | string | ❌ | Počáteční datum |
| `to` | string | ❌ | Koncové datum |
| `limit` | number | ❌ | Počet záznamů |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "option_id": "max_charging_power",
    "option_name": "Maximální nabíjecí výkon",
    "history": [
      {
        "timestamp": "2024-03-24T18:00:00Z",
        "old_value": 22000,
        "new_value": 11000,
        "changed_by": "admin@example.com",
        "change_reason": "Omezení kvůli síťové kapacitě",
        "change_method": "api",
        "ip_address": "192.168.1.50",
        "session_id": "sess_abc123"
      },
      {
        "timestamp": "2024-03-20T10:00:00Z",
        "old_value": 11000,
        "new_value": 22000,
        "changed_by": "technician@example.com",
        "change_reason": "Zvýšení kapacity po upgrade rozvaděče",
        "change_method": "local_ui"
      },
      {
        "timestamp": "2024-02-15T14:30:00Z",
        "old_value": 22000,
        "new_value": 11000,
        "changed_by": "system",
        "change_reason": "Automatické omezení - přehřátí",
        "change_method": "automatic"
      }
    ],
    "statistics": {
      "total_changes": 15,
      "changes_last_30_days": 3,
      "most_common_value": 22000,
      "average_value": 18500
    }
  }
}
```

---

## 🔧 Konfigurace na úrovni nodu

### Endpoint pro všechny konfigurace nodu
```
GET /admin-panel/v1/external/live/device/{deviceId}/{nodeId}/option
```

### Endpoint pro konkrétní konfiguraci nodu
```
GET /admin-panel/v1/external/live/device/{deviceId}/{nodeId}/option/{optionId}
```

### Příklad response pro node konfigurace
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "node_id": "connector_1",
    "node_name": "Konektor 1",
    "options": [
      {
        "id": "connector_enabled",
        "name": "Konektor povolen",
        "value": true,
        "type": "boolean"
      },
      {
        "id": "max_current",
        "name": "Maximální proud",
        "value": 32,
        "unit": "A",
        "type": "integer",
        "min_value": 6,
        "max_value": 32
      },
      {
        "id": "cable_lock_mode",
        "name": "Režim zámku kabelu",
        "value": "auto",
        "type": "enum",
        "allowed_values": ["auto", "always", "never"]
      }
    ]
  }
}
```

---

## 📊 Pokročilé použití

### Backup a restore konfigurace
```python
import json
from datetime import datetime

class ConfigurationManager:
    def __init__(self, api_token):
        self.api_token = api_token
        self.headers = {"Authorization": f"Bearer {api_token}"}

    def backup_configuration(self, device_id):
        """Vytvoří zálohu kompletní konfigurace"""
        response = requests.get(
            f"https://api.mybox.eco/admin-panel/v1/external/live/device/{device_id}/option",
            headers=self.headers
        )

        config = response.json()['data']

        # Přidat metadata
        backup = {
            'device_id': device_id,
            'backup_date': datetime.now().isoformat(),
            'backup_version': '1.0',
            'configuration': config['options']
        }

        # Uložit do souboru
        filename = f"backup_{device_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(backup, f, indent=2)

        print(f"Záloha uložena: {filename}")
        return filename

    def compare_configurations(self, device_id_1, device_id_2):
        """Porovná konfigurace dvou zařízení"""
        config1 = self._get_config(device_id_1)
        config2 = self._get_config(device_id_2)

        differences = []

        # Vytvořit mapy pro snadné porovnání
        config1_map = {opt['id']: opt for opt in config1['options']}
        config2_map = {opt['id']: opt for opt in config2['options']}

        # Najít rozdíly
        all_option_ids = set(config1_map.keys()) | set(config2_map.keys())

        for option_id in all_option_ids:
            opt1 = config1_map.get(option_id)
            opt2 = config2_map.get(option_id)

            if not opt1:
                differences.append({
                    'option_id': option_id,
                    'difference': 'missing_in_device1',
                    'device2_value': opt2['value']
                })
            elif not opt2:
                differences.append({
                    'option_id': option_id,
                    'difference': 'missing_in_device2',
                    'device1_value': opt1['value']
                })
            elif opt1['value'] != opt2['value']:
                differences.append({
                    'option_id': option_id,
                    'option_name': opt1['name'],
                    'device1_value': opt1['value'],
                    'device2_value': opt2['value'],
                    'unit': opt1.get('unit', '')
                })

        return differences

    def apply_configuration_template(self, device_ids, template):
        """Aplikuje šablonu konfigurace na více zařízení"""
        results = []

        for device_id in device_ids:
            try:
                # Zde by bylo volání API pro změnu konfigurace
                # Pro demonstraci pouze simulace
                result = {
                    'device_id': device_id,
                    'status': 'success',
                    'applied_changes': len(template)
                }
                results.append(result)
            except Exception as e:
                results.append({
                    'device_id': device_id,
                    'status': 'error',
                    'error': str(e)
                })

        return results
```

### Monitoring změn konfigurace
```javascript
class ConfigurationMonitor {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.lastKnownConfigs = new Map();
  }

  async startMonitoring(deviceIds, interval = 60000) {
    console.log(`Starting configuration monitoring for ${deviceIds.length} devices`);

    // Initial load
    for (const deviceId of deviceIds) {
      const config = await this.getConfiguration(deviceId);
      this.lastKnownConfigs.set(deviceId, this.hashConfiguration(config));
    }

    // Periodic check
    setInterval(async () => {
      for (const deviceId of deviceIds) {
        await this.checkForChanges(deviceId);
      }
    }, interval);
  }

  async checkForChanges(deviceId) {
    const currentConfig = await this.getConfiguration(deviceId);
    const currentHash = this.hashConfiguration(currentConfig);
    const lastHash = this.lastKnownConfigs.get(deviceId);

    if (currentHash !== lastHash) {
      console.log(`⚠️ Configuration change detected for device ${deviceId}`);
      const changes = await this.identifyChanges(deviceId, currentConfig);
      this.handleConfigurationChange(deviceId, changes);
      this.lastKnownConfigs.set(deviceId, currentHash);
    }
  }

  hashConfiguration(config) {
    // Simple hash for demonstration
    const configString = JSON.stringify(
      config.options.map(o => ({ id: o.id, value: o.value })).sort((a, b) => a.id.localeCompare(b.id))
    );
    return require('crypto').createHash('md5').update(configString).digest('hex');
  }

  async identifyChanges(deviceId, newConfig) {
    // Get history to identify what changed
    const changes = [];
    // Implementation would compare with previous config
    return changes;
  }

  handleConfigurationChange(deviceId, changes) {
    // Send notification, log, etc.
    console.log(`Device ${deviceId} configuration changed:`, changes);

    // Send alert if critical parameter changed
    const criticalParams = ['max_charging_power', 'authentication_methods', 'maintenance_mode'];
    const criticalChange = changes.some(c => criticalParams.includes(c.parameter));

    if (criticalChange) {
      this.sendCriticalAlert(deviceId, changes);
    }
  }

  sendCriticalAlert(deviceId, changes) {
    console.error(`🚨 CRITICAL: Configuration changed for ${deviceId}:`, changes);
    // Send email, SMS, webhook, etc.
  }
}
```

### Optimalizace konfigurace podle využití
```python
def optimize_configuration(device_id, usage_data):
    """Navrhne optimální konfiguraci podle využití"""

    recommendations = []

    # Analýza využití
    avg_power = usage_data['average_power']
    peak_power = usage_data['peak_power']
    avg_session_duration = usage_data['avg_session_duration_hours']
    concurrent_sessions = usage_data['avg_concurrent_sessions']

    # Doporučení pro max_charging_power
    if peak_power < 11000 and avg_power < 7000:
        recommendations.append({
            'parameter': 'max_charging_power',
            'current_value': 22000,
            'recommended_value': 11000,
            'reason': 'Využití nepřesahuje 11kW, můžete ušetřit na jističi',
            'savings_estimate': 'Až 30% na měsíčních poplatcích za příkon'
        })

    # Doporučení pro load_balancing
    if concurrent_sessions > 1.5:
        recommendations.append({
            'parameter': 'load_balancing_enabled',
            'recommended_value': True,
            'reason': 'Časté souběžné nabíjení - load balancing optimalizuje distribuci',
            'benefit': 'Rovnoměrnější zatížení sítě'
        })

    # Doporučení pro tarify
    if avg_session_duration > 4:
        recommendations.append({
            'parameter': 'tariff_schedule',
            'recommendation': 'Implementovat noční tarif',
            'reason': 'Dlouhé nabíjecí relace - využijte levnější noční proud',
            'savings_estimate': 'Až 40% nákladů při nočním nabíjení'
        })

    return recommendations

# Příklad použití
usage_data = {
    'average_power': 6500,
    'peak_power': 9800,
    'avg_session_duration_hours': 5.2,
    'avg_concurrent_sessions': 2.1
}

recommendations = optimize_configuration('000C1234567890AB', usage_data)

print("🔧 Doporučené optimalizace konfigurace:")
for rec in recommendations:
    print(f"\n{rec['parameter']}:")
    print(f"  Důvod: {rec['reason']}")
    if 'savings_estimate' in rec:
        print(f"  Úspora: {rec['savings_estimate']}")
```

---

## ⚠️ Chybové stavy

### Možné chybové odpovědi

#### 400 Bad Request
```json
{
  "status": 0,
  "error": "Bad Request",
  "message": "Invalid option ID format"
}
```

#### 403 Forbidden
```json
{
  "status": 0,
  "error": "Forbidden",
  "message": "Read-only parameter cannot be modified"
}
```

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "Option not found"
}
```

#### 422 Unprocessable Entity
```json
{
  "status": 0,
  "error": "Validation Error",
  "message": "Value 50000 exceeds maximum allowed value 22000"
}
```

---

## 💡 Best Practices

1. **Validace před změnou**
   - Vždy zkontrolujte rozsahy a závislosti
   - Ověřte, zda změna nevyžaduje restart

2. **Zálohování konfigurace**
   - Před velkými změnami vytvořte zálohu
   - Uchovávejte historii změn

3. **Postupné změny**
   - Neměňte více kritických parametrů najednou
   - Testujte změny na jednom zařízení před hromadnou aplikací

4. **Monitoring**
   - Sledujte vliv změn na výkon
   - Nastavte alerty pro kritické parametry

5. **Dokumentace**
   - Vždy uveďte důvod změny
   - Dokumentujte závislosti mezi parametry

---

## 📚 Další zdroje

- [Události zařízení](/api/device-events) - Historie změn a událostí
- [Live Data](/api/live-data) - Aktuální stav zařízení
- [Správa zařízení](/api/devices) - Informace o zařízeních
- [FAQ - Časté dotazy](/faq#konfigurace) - Odpovědi na časté dotazy