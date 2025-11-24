# Node-level Monitoring API

## Overview

The Node-level monitoring API enables detailed tracking of individual components (nodes) in MyBox devices. This API is critical primarily for DLM (Dynamic Load Management) systems, where you need to monitor individual charging stations, meters, and sensors.

## Key Concepts

### What is a Node?
A node represents a logical component within a device. For example:
- **In ARM Unit**: `groups`, `reports`, `sources`, `dlm-management`, `config`
- **In AC Sensor**: `ac-measurement`, `solar-mgmt`, `ac-module-1`, `ac-module-2`, etc.
- **In charging stations**: `1`, `2` (for individual charging points)

### Data Hierarchy
```
Device
├── Node (component)
│   ├── Sensors (current values)
│   ├── Telemetry (time series)
│   └── Options (configuration)
```

## Endpoints

### 1. Specific Node Status

```
GET /external/live/device/{deviceId}/{nodeId}
```

Retrieves the current state of a specific node including all sensors, telemetry, and configurations.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID (e.g., `reports`, `ac-measurement`)

#### Example Response - ARM Unit node "reports"

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
        // ... more sensors
      ]
    }
  }],
  "status": 1
}
```

#### Example Response - AC Sensor node "ac-measurement"

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

### 2. Specific Sensor Status

```
GET /external/live/device/{deviceId}/{nodeId}/{sensorId}
```

Retrieves the current value of a specific sensor within a node.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID
- `sensorId` - Sensor ID (e.g., `ac-current-1`, `ac-module-1`)

#### Example Response

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

### 3. Node Telemetry

```
GET /external/live/device/{deviceId}/{nodeId}/telemetry
```

Retrieves all telemetry values for a specific node.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID

#### Example Response

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "node": {
      "telemetry": []  // Most nodes don't have telemetry
    }
  }],
  "status": 1
}
```

### 4. Specific Node Telemetry

```
GET /external/live/device/{deviceId}/{nodeId}/telemetry/{telemetryId}
```

Retrieves a specific telemetry value from a node.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID
- `telemetryId` - Telemetry ID

#### Example Response

```json
{
  "data": [{
    "owner": "ef96f29...",
    "value": "100"  // Specific telemetry value
  }],
  "status": 1
}
```

### 5. Node Configuration

```
GET /external/live/device/{deviceId}/{nodeId}/option
```

Retrieves all configuration parameters for a node.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID

#### Example Response

```json
{
  "data": [{
    "owner": "c8c4a02e...",
    "node": {
      "options": []  // Most nodes don't have configurable options
    }
  }],
  "status": 1
}
```

### 6. Specific Node Configuration

```
GET /external/live/device/{deviceId}/{nodeId}/option/{optionId}
```

Retrieves a specific configuration parameter from a node.

#### Parameters
- `deviceId` - Device ID
- `nodeId` - Node ID
- `optionId` - Configuration parameter ID

#### Example Response

```json
{
  "data": [{
    "owner": "ef96f29...",
    "value": "false"  // Specific configuration value
  }],
  "status": 1
}
```

**Note**: Many nodes don't have configurable parameters or return `null` values.

## Usage Examples

### Python - Monitoring ARM Unit

```python
import requests
from requests.auth import HTTPBasicAuth
import json

# Configuration
API_URL = "https://cloud.mybox.pro/admin-panel/v1/external"
API_KEY = "your_api_key"
API_SECRET = "your_api_secret"
DEVICE_ID = "mq40-5mt0-428z-zlcd"  # ARM Unit

def get_arm_unit_stations_status():
    """Get status of all connected stations from ARM Unit"""

    # Get reports from all stations
    response = requests.get(
        f"{API_URL}/live/device/{DEVICE_ID}/reports",
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Process reports from individual stations
        if data['data'] and data['data'][0]['node'].get('sensors'):
            stations = []
            for sensor in data['data'][0]['node']['sensors']:
                if sensor['id'].startswith('ac-module-') and sensor['value']:
                    # Parse JSON value
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

# Usage
stations = get_arm_unit_stations_status()
if stations:
    print(f"Found {len(stations)} stations:")
    for station in stations:
        print(f"  {station['module_id']}: {station['device_id']} - {station['state']}")
```

### JavaScript - Monitoring AC Sensor

```javascript
const axios = require('axios');

const API_URL = 'https://cloud.mybox.pro/admin-panel/v1/external';
const API_KEY = 'your_api_key';
const API_SECRET = 'your_api_secret';
const DEVICE_ID = 's6lc-9mr0-80h7-ilyz'; // AC Sensor

async function getACMeasurements() {
    try {
        // Get AC measurements
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
            // Find node with data
            const nodeData = response.data.data.find(d =>
                d.node && d.node.sensors
            );

            if (nodeData) {
                const measurements = {};

                // Process sensors
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
        console.error('Error:', error.message);
    }

    return null;
}

// Usage
getACMeasurements().then(measurements => {
    if (measurements) {
        console.log('AC Measurements:');
        console.log(`  L1: ${measurements['ac-current-1']} A`);
        console.log(`  L2: ${measurements['ac-current-2']} A`);
        console.log(`  L3: ${measurements['ac-current-3']} A`);
        console.log(`  Phase: ${measurements.phase}`);
        console.log(`  System: ${measurements.system}`);
    }
});
```

### cURL - Get Specific Sensor

```bash
# Get specific current value from AC Sensor
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/live/device/s6lc-9mr0-80h7-ilyz/ac-measurement/ac-current-1" \
  -u "your_api_key:your_api_secret" \
  -H "Accept: application/json"
```

## Practical Use Cases

### 1. Phase Load Monitoring in AC Sensor

AC Sensor measures current on individual phases, which is critical for load balancing:

```python
def check_phase_imbalance(device_id):
    """Check phase imbalance"""

    response = requests.get(
        f"{API_URL}/live/device/{device_id}/ac-measurement",
        auth=HTTPBasicAuth(API_KEY, API_SECRET)
    )

    if response.status_code == 200:
        data = response.json()

        # Find node with data
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
                        'balanced': imbalance < 5.0  # 5A threshold
                    }

    return None
```

### 2. Monitoring Charging Station Status in ARM Unit

```python
def get_charging_stations_overview(device_id):
    """Get overview of all charging stations connected to ARM Unit"""

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

        # Process sensors
        if data['data'] and data['data'][0]['node'].get('sensors'):
            for sensor in data['data'][0]['node']['sensors']:
                if sensor['id'].startswith('ac-module-') and sensor['value']:
                    try:
                        station = json.loads(sensor['value'])
                        stats['total'] += 1

                        # Count states
                        if station['node_state'] == 'NODE_IS_CONNECTED':
                            stats['connected'] += 1

                            # CP states according to IEC 61851
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

## Node Types by Device

### ARM Unit Nodes
- **groups** - Station group management
- **reports** - Reports from all connected stations (up to 200)
- **sources** - Data sources
- **dlm-management** - DLM control
- **config** - Configuration

### AC Sensor Nodes
- **ac-measurement** - Phase current measurements
- **solar-mgmt** - Solar energy management
- **ac-module-1** to **ac-module-8** - Individual modules (max 8 stations)
- **dlm-management** - DLM control
- **config** - Configuration

### Charging Station Nodes
- **1**, **2** - Individual charging points
- **control** - Station control
- **meter** - Energy meter

## Best Practices

1. **Data caching**: Node data doesn't change frequently, consider caching for 30-60 seconds

2. **Batch requests**: Instead of calling individual sensors, load the entire node at once

3. **JSON value parsing**: Many sensors return JSON strings - always use try/catch

4. **Monitor only active nodes**: Ignore empty modules (value "")

5. **Use groups**: In ARM Unit, utilize groups (left/right/default) for organization

## Error States

- **404 Not Found** - Node doesn't exist or incorrect ID
- **401 Unauthorized** - Authentication failed
- **403 Forbidden** - You don't have permission for this node
- **500 Internal Server Error** - Server error, try again later

## Differences Between ARM Unit and AC Sensor

| Feature | ARM Unit | AC Sensor |
|---------|----------|-----------|
| Max stations | 200 | 8 |
| Node structure | reports with ac-module-X | Separate ac-module-X nodes |
| Current measurements | In individual stations | Centrally in ac-measurement |
| Solar management | No | Yes |
| Groups | left/right/default | No |

## Summary

The Node-level monitoring API provides granular access to data from individual components of DLM systems and charging stations. It is essential for:
- Real-time load monitoring
- Problem diagnostics
- Load balancing optimization
- Monitoring individual station status
- Implementing custom control algorithms
