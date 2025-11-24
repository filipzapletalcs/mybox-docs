# ⚙️ Device Configuration

## Overview

The device configuration API allows you to read and manage settings for MyBox charging stations. Each device has a set of configurable parameters (options) that control its behavior, performance, and features. This API provides access to the current values of these parameters and their change history.

### Main Features
- Get all device configuration parameters
- Read a specific parameter by ID
- Configuration change history
- Configuration at the node level (for multi-node devices)

### Configuration Parameter Categories
- **Performance and Charging** - maximum power, current limiting, phases
- **Network Settings** - IP configuration, OCPP parameters, communication protocols
- **Security** - authentication, authorization, encryption
- **User Interface** - LED indication, sound signals, display
- **Energy Management** - load balancing, tariffs, scheduling
- **Diagnostics** - logs, debug modes, reporting

### Use Cases
- **Remote management** - remote management and device configuration
- **Performance optimization** - dynamic parameter adjustment according to needs
- **Troubleshooting** - diagnostics of problems through configuration settings
- **Compliance** - ensuring compliance with standards and regulations
- **Fleet management** - bulk configuration management of multiple devices

---

## 📋 All Device Configurations

### Endpoint
```
GET /admin-panel/v1/external/live/device/{deviceId}/option
```

### Parameters

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | Device ID (16 hexadecimal characters) |

#### Query Parameters
| Parameter | Type | Required | Description |
|----------|-----|---------|-------|
| `category` | string | ❌ | Filter by category |
| `include_readonly` | boolean | ❌ | Include read-only parameters (default: true) |
| `include_hidden` | boolean | ❌ | Include hidden parameters (default: false) |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "device_name": "Charging Station - Main Building",
    "timestamp": "2024-03-25T14:30:00.123Z",
    "options": [
      {
        "id": "max_charging_power",
        "name": "Maximum Charging Power",
        "description": "Maximum allowed power for charging (W)",
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
          "change_reason": "Limitation due to grid capacity",
          "firmware_min_version": "2.0.0"
        }
      },
      {
        "id": "available_phases",
        "name": "Available Phases",
        "description": "Number of available phases for charging",
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
        "description": "OCPP server URL for communication",
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
        "name": "Authentication Methods",
        "description": "Allowed user authentication methods",
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
        "description": "Enable dynamic load management",
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
        "name": "Load Balancing Mode",
        "description": "Load management algorithm",
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
        "name": "Maximum Grid Power",
        "description": "Total maximum power consumption for all connectors",
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
        "name": "LED Brightness",
        "description": "LED indicator brightness level (0-100%)",
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
        "name": "Sound Signals",
        "description": "Enable sound signals for events",
        "category": "ui",
        "value": true,
        "type": "boolean",
        "default_value": true,
        "readonly": false
      },
      {
        "id": "tariff_schedule",
        "name": "Tariff Schedule",
        "description": "Time-based tariff schedule",
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
        "name": "Firmware Version",
        "description": "Current device firmware version",
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
        "name": "Serial Number",
        "description": "Manufacturing serial number of the device",
        "category": "system",
        "value": "MB2023-AB-1234567",
        "type": "string",
        "readonly": true
      },
      {
        "id": "network_config",
        "name": "Network Configuration",
        "description": "Network connection settings",
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
        "name": "Maintenance Mode",
        "description": "Activate maintenance mode (disables charging)",
        "category": "maintenance",
        "value": false,
        "type": "boolean",
        "readonly": false,
        "metadata": {
          "warning": "Activation will stop all ongoing charging sessions"
        }
      }
    ],
    "categories": {
      "charging": {
        "name": "Charging",
        "description": "Parameters related to charging process",
        "count": 3
      },
      "electrical": {
        "name": "Electrical Parameters",
        "description": "Electrical configuration and limitations",
        "count": 2
      },
      "network": {
        "name": "Network and Communication",
        "description": "Network settings and communication protocols",
        "count": 2
      },
      "security": {
        "name": "Security",
        "description": "Authentication and security settings",
        "count": 1
      },
      "energy_management": {
        "name": "Energy Management",
        "description": "Load balancing and consumption optimization",
        "count": 3
      },
      "ui": {
        "name": "User Interface",
        "description": "Display, LED and sound settings",
        "count": 2
      },
      "billing": {
        "name": "Billing",
        "description": "Tariff and pricing settings",
        "count": 1
      },
      "system": {
        "name": "System",
        "description": "System information and settings",
        "count": 2
      },
      "maintenance": {
        "name": "Maintenance",
        "description": "Service and maintenance functions",
        "count": 1
      }
    }
  }
}
```

### Example Call

#### cURL
```bash
# Get all configurations
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/live/device/000C1234567890AB/option" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"

# Filter by category
curl -X GET "https://api.mybox.eco/admin-panel/v1/external/live/device/000C1234567890AB/option?category=charging" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests
import json

def get_device_configuration(device_id, category=None):
    """Get device configuration"""
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

# Get complete configuration
device_id = "000C1234567890AB"
config = get_device_configuration(device_id)

# List important parameters
print(f"Configuration for device {device_id}:")
print("=" * 50)

for option in config['data']['options']:
    if not option.get('readonly', False):
        value_str = str(option['value'])
        if option.get('unit'):
            value_str += f" {option['unit']}"

        print(f"{option['name']}:")
        print(f"  ID: {option['id']}")
        print(f"  Value: {value_str}")
        print(f"  Category: {option['category']}")

        if option.get('affects_billing'):
            print("  ⚠️ Affects billing")
        if option.get('requires_restart'):
            print("  ⚠️ Requires restart")
        print()

# Configuration analysis
def analyze_configuration(config):
    """Analyze configuration and recommend optimizations"""
    recommendations = []
    options = config['data']['options']

    # Find specific parameters
    max_power = next((o for o in options if o['id'] == 'max_charging_power'), None)
    load_balancing = next((o for o in options if o['id'] == 'load_balancing_enabled'), None)

    if max_power and max_power['value'] < max_power['max_value']:
        recommendations.append({
            'parameter': 'max_charging_power',
            'current': max_power['value'],
            'recommended': max_power['max_value'],
            'reason': 'Utilize full device potential'
        })

    if load_balancing and not load_balancing['value']:
        recommendations.append({
            'parameter': 'load_balancing_enabled',
            'current': False,
            'recommended': True,
            'reason': 'Optimize energy distribution between connectors'
        })

    return recommendations

recommendations = analyze_configuration(config)
if recommendations:
    print("\n🔧 Recommended optimizations:")
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
      // Check values out of range
      if (option.min_value !== undefined && option.value < option.min_value) {
        issues.push({
          severity: 'error',
          parameter: option.id,
          message: `Value ${option.value} is below minimum ${option.min_value}`
        });
      }

      if (option.max_value !== undefined && option.value > option.max_value) {
        issues.push({
          severity: 'error',
          parameter: option.id,
          message: `Value ${option.value} is above maximum ${option.max_value}`
        });
      }

      // Check dependencies
      if (option.validation && option.validation.dependencies) {
        option.validation.dependencies.forEach(depId => {
          const dependency = config.options.find(o => o.id === depId);
          if (!dependency) {
            issues.push({
              severity: 'warning',
              parameter: option.id,
              message: `Missing dependent parameter ${depId}`
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

// Usage
const configurator = new DeviceConfigurator('YOUR_API_TOKEN');

async function manageDeviceConfig() {
  const deviceId = '000C1234567890AB';

  // Get configuration by categories
  const byCategory = await configurator.getConfigurationByCategory(deviceId);

  console.log('📊 Configuration by category:');
  Object.entries(byCategory).forEach(([category, options]) => {
    console.log(`\n${category}:`);
    options.forEach(opt => {
      const value = typeof opt.value === 'object'
        ? JSON.stringify(opt.value)
        : opt.value;
      console.log(`  - ${opt.name}: ${value}${opt.unit ? ' ' + opt.unit : ''}`);
    });
  });

  // Validate configuration
  const config = await configurator.getConfiguration(deviceId);
  const issues = configurator.validateConfiguration(config);

  if (issues.length > 0) {
    console.log('\n⚠️ Found configuration issues:');
    issues.forEach(issue => {
      console.log(`  [${issue.severity.toUpperCase()}] ${issue.parameter}: ${issue.message}`);
    });
  }

  // Compare with default values
  const differences = await configurator.compareWithDefaults(deviceId);
  if (differences.length > 0) {
    console.log('\n🔄 Differences from default values:');
    differences.forEach(diff => {
      console.log(`  - ${diff.name}:`);
      console.log(`    Current: ${diff.current}${diff.unit ? ' ' + diff.unit : ''}`);
      console.log(`    Default: ${diff.default}${diff.unit ? ' ' + diff.unit : ''}`);
    });
  }
}

manageDeviceConfig();
```

---

## 🔍 Specific Configuration

### Endpoint
```
GET /admin-panel/v1/external/live/device/{deviceId}/option/{optionId}
```

### Parameters

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | Device ID |
| `optionId` | string | ✅ | Configuration parameter ID |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "option": {
      "id": "max_charging_power",
      "name": "Maximum Charging Power",
      "description": "Maximum allowed power for charging (W)",
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
        "change_reason": "Limitation due to grid capacity",
        "firmware_min_version": "2.0.0",
        "history_available": true
      },
      "related_options": [
        {
          "id": "available_phases",
          "name": "Available Phases",
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

## 📊 Configuration History

### Endpoint
```
GET /admin-panel/v1/external/history/option/{deviceId}/{optionId}
```

### Parameters

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|-----|---------|-------|
| `deviceId` | string | ✅ | Device ID |
| `optionId` | string | ✅ | Configuration parameter ID |

#### Query Parameters
| Parameter | Type | Required | Description |
|----------|-----|---------|-------|
| `from` | string | ❌ | Start date |
| `to` | string | ❌ | End date |
| `limit` | number | ❌ | Number of records |

### Response
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "option_id": "max_charging_power",
    "option_name": "Maximum Charging Power",
    "history": [
      {
        "timestamp": "2024-03-24T18:00:00Z",
        "old_value": 22000,
        "new_value": 11000,
        "changed_by": "admin@example.com",
        "change_reason": "Limitation due to grid capacity",
        "change_method": "api",
        "ip_address": "192.168.1.50",
        "session_id": "sess_abc123"
      },
      {
        "timestamp": "2024-03-20T10:00:00Z",
        "old_value": 11000,
        "new_value": 22000,
        "changed_by": "technician@example.com",
        "change_reason": "Capacity increase after switchboard upgrade",
        "change_method": "local_ui"
      },
      {
        "timestamp": "2024-02-15T14:30:00Z",
        "old_value": 22000,
        "new_value": 11000,
        "changed_by": "system",
        "change_reason": "Automatic limitation - overheating",
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

## 🔧 Node-level Configuration

### Endpoint for All Node Configurations
```
GET /admin-panel/v1/external/live/device/{deviceId}/{nodeId}/option
```

### Endpoint for Specific Node Configuration
```
GET /admin-panel/v1/external/live/device/{deviceId}/{nodeId}/option/{optionId}
```

### Example Response for Node Configuration
```json
{
  "status": 1,
  "data": {
    "device_id": "000C1234567890AB",
    "node_id": "connector_1",
    "node_name": "Connector 1",
    "options": [
      {
        "id": "connector_enabled",
        "name": "Connector Enabled",
        "value": true,
        "type": "boolean"
      },
      {
        "id": "max_current",
        "name": "Maximum Current",
        "value": 32,
        "unit": "A",
        "type": "integer",
        "min_value": 6,
        "max_value": 32
      },
      {
        "id": "cable_lock_mode",
        "name": "Cable Lock Mode",
        "value": "auto",
        "type": "enum",
        "allowed_values": ["auto", "always", "never"]
      }
    ]
  }
}
```

---

## 📊 Advanced Usage

### Backup and Restore Configuration
```python
import json
from datetime import datetime

class ConfigurationManager:
    def __init__(self, api_token):
        self.api_token = api_token
        self.headers = {"Authorization": f"Bearer {api_token}"}

    def backup_configuration(self, device_id):
        """Create backup of complete configuration"""
        response = requests.get(
            f"https://api.mybox.eco/admin-panel/v1/external/live/device/{device_id}/option",
            headers=self.headers
        )

        config = response.json()['data']

        # Add metadata
        backup = {
            'device_id': device_id,
            'backup_date': datetime.now().isoformat(),
            'backup_version': '1.0',
            'configuration': config['options']
        }

        # Save to file
        filename = f"backup_{device_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(backup, f, indent=2)

        print(f"Backup saved: {filename}")
        return filename

    def compare_configurations(self, device_id_1, device_id_2):
        """Compare configurations of two devices"""
        config1 = self._get_config(device_id_1)
        config2 = self._get_config(device_id_2)

        differences = []

        # Create maps for easy comparison
        config1_map = {opt['id']: opt for opt in config1['options']}
        config2_map = {opt['id']: opt for opt in config2['options']}

        # Find differences
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
        """Apply configuration template to multiple devices"""
        results = []

        for device_id in device_ids:
            try:
                # Here would be API call to change configuration
                # For demonstration only simulation
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

### Monitoring Configuration Changes
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

### Configuration Optimization Based on Usage
```python
def optimize_configuration(device_id, usage_data):
    """Suggest optimal configuration based on usage"""

    recommendations = []

    # Usage analysis
    avg_power = usage_data['average_power']
    peak_power = usage_data['peak_power']
    avg_session_duration = usage_data['avg_session_duration_hours']
    concurrent_sessions = usage_data['avg_concurrent_sessions']

    # Recommendation for max_charging_power
    if peak_power < 11000 and avg_power < 7000:
        recommendations.append({
            'parameter': 'max_charging_power',
            'current_value': 22000,
            'recommended_value': 11000,
            'reason': 'Usage doesn\'t exceed 11kW, you can save on circuit breaker',
            'savings_estimate': 'Up to 30% on monthly power fees'
        })

    # Recommendation for load_balancing
    if concurrent_sessions > 1.5:
        recommendations.append({
            'parameter': 'load_balancing_enabled',
            'recommended_value': True,
            'reason': 'Frequent concurrent charging - load balancing optimizes distribution',
            'benefit': 'More balanced grid load'
        })

    # Recommendation for tariffs
    if avg_session_duration > 4:
        recommendations.append({
            'parameter': 'tariff_schedule',
            'recommendation': 'Implement night tariff',
            'reason': 'Long charging sessions - use cheaper night electricity',
            'savings_estimate': 'Up to 40% costs with night charging'
        })

    return recommendations

# Example usage
usage_data = {
    'average_power': 6500,
    'peak_power': 9800,
    'avg_session_duration_hours': 5.2,
    'avg_concurrent_sessions': 2.1
}

recommendations = optimize_configuration('000C1234567890AB', usage_data)

print("🔧 Recommended configuration optimizations:")
for rec in recommendations:
    print(f"\n{rec['parameter']}:")
    print(f"  Reason: {rec['reason']}")
    if 'savings_estimate' in rec:
        print(f"  Savings: {rec['savings_estimate']}")
```

---

## ⚠️ Error States

### Possible Error Responses

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

1. **Validate Before Changing**
   - Always check ranges and dependencies
   - Verify if change requires restart

2. **Configuration Backup**
   - Create backup before major changes
   - Maintain change history

3. **Gradual Changes**
   - Don't change multiple critical parameters at once
   - Test changes on one device before bulk application

4. **Monitoring**
   - Monitor impact of changes on performance
   - Set alerts for critical parameters

5. **Documentation**
   - Always state reason for change
   - Document dependencies between parameters

---

## 📚 Additional Resources

- [Device Events](/api/device-events) - Change and event history
- [Live Data](/api/live-data) - Current device status
- [Device Management](/api/devices) - Device information
- [FAQ - Frequently Asked Questions](/faq#konfigurace) - Answers to common questions
