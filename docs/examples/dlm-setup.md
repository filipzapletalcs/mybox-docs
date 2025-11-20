---
id: dlm-setup
title: ⚡ Nastavení Dynamic Load Management (DLM)
sidebar_position: 2
---

# Dynamic Load Management - Kompletní průvodce

## 🎯 Co je DLM a proč ho potřebujete?

Dynamic Load Management (DLM) je inteligentní systém, který automaticky řídí rozložení elektrického výkonu mezi nabíjecími stanicemi tak, aby nedošlo k přetížení hlavního jističe. Je to klíčová funkce pro:

- **Firemní parkoviště** - více nabíjecích stanic na jedné přípojce
- **Bytové domy** - sdílení kapacity mezi obyvateli
- **Domácnosti** - ochrana před vypadnutím jističe při současném nabíjení a dalších spotřebičích

## 📊 Jak DLM funguje?

DLM kontinuálně monitoruje aktuální spotřebu na hlavním přívodu a dynamicky upravuje nabíjecí výkon jednotlivých stanic tak, aby:
1. Nedošlo k překročení maximální kapacity jističe
2. Byla maximálně využita dostupná kapacita
3. Bylo zajištěno spravedlivé rozdělení výkonu mezi stanice

## 🔧 Implementace DLM s MyBox API

### Krok 1: Získání informací o zařízení

```python
import requests
import json
from datetime import datetime

# API credentials
API_KEY = "YOUR_API_KEY"
API_SECRET = "YOUR_API_SECRET"
BASE_URL = "https://cloud.mybox.pro/admin-panel/v1"

# Autentizace
auth = (API_KEY, API_SECRET)

# Získání seznamu zařízení
def get_devices():
    response = requests.get(
        f"{BASE_URL}/external/device",
        auth=auth
    )
    return response.json()

# Získání aktuální DLM konfigurace
def get_dlm_config(device_id):
    response = requests.get(
        f"{BASE_URL}/external/live/device/{device_id}",
        auth=auth
    )

    data = response.json()

    # Extrakce DLM nastavení
    for owner_data in data.get('data', []):
        device = owner_data.get('device', {})
        nodes = device.get('nodes', [])

        for node in nodes:
            if node.get('id') == 'dlm':
                return {
                    'node': node,
                    'sensors': {s['id']: s for s in node.get('sensors', [])}
                }

    return None

# Příklad použití
devices = get_devices()
if devices['status'] == 1:
    for device in devices['data']:
        print(f"Zařízení: {device['identifier']} - {device['title']}")
        dlm_config = get_dlm_config(device['identifier'])
        if dlm_config:
            sensors = dlm_config['sensors']
            print(f"  DLM Enabled: {sensors.get('dlm-enabled', {}).get('value')}")
            print(f"  Max Mains Current: {sensors.get('max-mains-curr', {}).get('value')} A")
            print(f"  DLM Type: {sensors.get('dlm-type', {}).get('value')}")
```

### Krok 2: Konfigurace DLM parametrů

```python
def configure_dlm(device_id, max_current, offset_current=2):
    """
    Konfigurace DLM parametrů

    Args:
        device_id: ID zařízení
        max_current: Maximální proud hlavního jističe (A)
        offset_current: Bezpečnostní rezerva (A)
    """

    # Endpoint pro nastavení DLM
    config_url = f"{BASE_URL}/external/device/{device_id}/configure"

    # Konfigurace DLM
    dlm_config = {
        "dlm": {
            "enabled": True,
            "type": "DLM_EXTERNAL",  # nebo "DLM_INTERNAL" pro interní měření
            "max_mains_current": max_current,
            "offset_current": offset_current,
            "calc_mode": "ACTIVE",  # Aktivní výpočet
            "on_error": "CHARGE_AT_MIN",  # Při chybě nabíjet minimálním proudem
            "balancing_mode": "FAIR"  # Spravedlivé rozdělení
        }
    }

    response = requests.post(
        config_url,
        auth=auth,
        json=dlm_config
    )

    return response.json()

# Nastavení DLM pro 25A jistič s 2A rezervou
result = configure_dlm("qfeb-od13-ul2c-sgrl", max_current=25, offset_current=2)
print(f"DLM konfigurace: {'Úspěšná' if result.get('status') == 1 else 'Neúspěšná'}")
```

### Krok 3: Externí DLM s AC Sensorem

Pro přesné měření spotřeby na hlavním přívodu použijte MyBox AC Sensor:

```python
def setup_external_dlm(charging_station_id, ac_sensor_id):
    """
    Nastavení externího DLM s AC Sensorem
    """

    # Získání informací o AC Sensoru
    sensor_response = requests.get(
        f"{BASE_URL}/external/device/{ac_sensor_id}",
        auth=auth
    )
    sensor_data = sensor_response.json()

    # Konfigurace komunikace mezi zařízeními
    dlm_settings = {
        "external_dlm": {
            "enabled": True,
            "sensor_device": ac_sensor_id,
            "communication": {
                "protocol": "MQTT",
                "uri": f"mqtt://mybox{ac_sensor_id[:8]}.local:1883",
                "login": "admin",
                "pass": "admin"
            },
            "group": "default"
        }
    }

    # Aplikace nastavení
    response = requests.post(
        f"{BASE_URL}/external/device/{charging_station_id}/configure",
        auth=auth,
        json=dlm_settings
    )

    return response.json()
```

### Krok 4: Monitoring DLM v reálném čase

```python
import time

def monitor_dlm(device_id, duration_seconds=60):
    """
    Monitoring DLM v reálném čase
    """

    start_time = time.time()

    while time.time() - start_time < duration_seconds:
        # Získání aktuálních dat
        response = requests.get(
            f"{BASE_URL}/external/live/device/{device_id}",
            auth=auth
        )

        data = response.json()

        # Extrakce DLM hodnot
        for owner_data in data.get('data', []):
            device = owner_data.get('device', {})
            nodes = device.get('nodes', [])

            for node in nodes:
                if node.get('id') == 'dlm':
                    sensors = {s['id']: s['value'] for s in node.get('sensors', [])}

                    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] DLM Status:")
                    print(f"  Status: {sensors.get('dlm-status', 'N/A')}")
                    print(f"  L1 Current: {sensors.get('dlm-current-l1', '0')} A")
                    print(f"  L2 Current: {sensors.get('dlm-current-l2', '0')} A")
                    print(f"  L3 Current: {sensors.get('dlm-current-l3', '0')} A")
                    print(f"  DLM Result: {sensors.get('dlm-result', '0')} A")
                    print(f"  Max Available: {sensors.get('int-dlm-curr-max', '0')} A")

        time.sleep(5)  # Aktualizace každých 5 sekund

# Spuštění monitoringu na 60 sekund
monitor_dlm("qfeb-od13-ul2c-sgrl", duration_seconds=60)
```

## 🎛️ Pokročilé DLM strategie

### 1. Prioritní nabíjení

```python
def set_charging_priority(devices_config):
    """
    Nastavení priorit pro nabíjecí stanice

    devices_config: Seznam dict s device_id a priority (1-10)
    """

    for config in devices_config:
        device_id = config['device_id']
        priority = config['priority']

        priority_config = {
            "dlm": {
                "priority_level": priority,
                "min_current": 6 if priority > 7 else 8,  # VIP dostanou min 8A
                "fair_share_weight": priority / 10  # Váha pro rozdělení
            }
        }

        response = requests.post(
            f"{BASE_URL}/external/device/{device_id}/configure",
            auth=auth,
            json=priority_config
        )

        print(f"Zařízení {device_id}: Priorita {priority} nastavena")

# Příklad nastavení priorit
devices_priority = [
    {"device_id": "qfeb-od13-ul2c-sgrl", "priority": 10},  # VIP
    {"device_id": "ndcc-awwu-d2x3-dx07", "priority": 5},   # Standard
]

set_charging_priority(devices_priority)
```

### 2. Časové DLM profily

```python
def apply_time_based_dlm(device_id):
    """
    Aplikace různých DLM profilů podle denní doby
    """

    current_hour = datetime.now().hour

    # Definice profilů
    if 6 <= current_hour < 9:  # Ranní špička
        max_current = 16
        mode = "CONSERVATIVE"
    elif 17 <= current_hour < 21:  # Večerní špička
        max_current = 20
        mode = "BALANCED"
    else:  # Mimo špičku
        max_current = 32
        mode = "AGGRESSIVE"

    config = {
        "dlm": {
            "max_mains_current": max_current,
            "calc_mode": mode
        }
    }

    response = requests.post(
        f"{BASE_URL}/external/device/{device_id}/configure",
        auth=auth,
        json=config
    )

    print(f"Aplikován profil: {mode} s max {max_current}A")
    return response.json()
```

## 📈 Optimalizace DLM

### Automatická kalibrace

```python
def auto_calibrate_dlm(device_id, test_duration_minutes=30):
    """
    Automatická kalibrace DLM parametrů
    """

    print("Spouštím automatickou kalibraci DLM...")

    # Fáze 1: Měření základní spotřeby (bez nabíjení)
    baseline = measure_baseline_consumption(device_id)

    # Fáze 2: Test s různými nastaveními
    test_configs = [
        {"offset": 1, "mode": "ACTIVE"},
        {"offset": 2, "mode": "ACTIVE"},
        {"offset": 3, "mode": "CONSERVATIVE"}
    ]

    results = []

    for config in test_configs:
        # Aplikace testovací konfigurace
        response = configure_dlm(
            device_id,
            max_current=25,
            offset_current=config["offset"]
        )

        # Měření výkonu
        performance = measure_performance(device_id, duration_minutes=10)

        results.append({
            "config": config,
            "avg_power": performance["avg_power"],
            "max_peaks": performance["max_peaks"],
            "efficiency": performance["efficiency"]
        })

    # Výběr optimální konfigurace
    optimal = max(results, key=lambda x: x["efficiency"])

    print(f"Optimální konfigurace: Offset={optimal['config']['offset']}A")

    return optimal
```

## ⚠️ Řešení problémů

### Diagnostika DLM

```python
def diagnose_dlm(device_id):
    """
    Diagnostika DLM problémů
    """

    response = requests.get(
        f"{BASE_URL}/external/live/device/{device_id}",
        auth=auth
    )

    data = response.json()
    issues = []

    for owner_data in data.get('data', []):
        device = owner_data.get('device', {})
        nodes = device.get('nodes', [])

        for node in nodes:
            if node.get('id') == 'dlm':
                sensors = {s['id']: s['value'] for s in node.get('sensors', [])}

                # Kontrola stavů
                if sensors.get('dlm-status') != 'OK':
                    issues.append(f"DLM status není OK: {sensors.get('dlm-status')}")

                if sensors.get('dlm-enabled') != 'true':
                    issues.append("DLM není aktivní")

                if float(sensors.get('int-dlm-curr-max', 0)) == 0:
                    issues.append("Maximální proud je 0 - zkontrolujte nastavení")

    if issues:
        print("❌ Nalezeny problémy:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ DLM funguje správně")

    return issues

# Spuštění diagnostiky
diagnose_dlm("qfeb-od13-ul2c-sgrl")
```

## 🎯 Best Practices

1. **Vždy nastavte bezpečnostní rezervu** - minimálně 2A pod hodnotou jističe
2. **Používejte externí měření** (AC Sensor) pro přesné řízení
3. **Monitorujte pravidelně** - nastavte alerting při problémech
4. **Testujte konfigurace** - před nasazením do produkce
5. **Dokumentujte změny** - veďte log všech úprav DLM

## 📚 Související návody

- [Monitoring spotřeby energie](./energy-monitoring)
- [Integrace s domácí automatizací](./home-automation)
- [Správa více nabíjecích stanic](./fleet-management)