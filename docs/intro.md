---
id: intro
title: MyBox API Documentation
sidebar_position: 1
slug: /
---

# Vítejte v MyBox API

Moderní RESTful API pro správu a monitoring vašich nabíjecích stanic MyBox. Jednoduché, rychlé a spolehlivé.

---

## Začněte za 5 minut

```bash
# 1. Získejte seznam vašich zařízení
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/device" \
  -u "YOUR_API_KEY:YOUR_API_SECRET"

# 2. Načtěte aktuální data ze zařízení
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/live/device/{deviceId}" \
  -u "YOUR_API_KEY:YOUR_API_SECRET"
```

:::tip Potřebujete API klíče?
Přihlaste se do [MyBox Cloud](https://cloud.mybox.pro) nebo kontaktujte support@mybox.cz
:::

---

## Co můžete s API dělat

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem'}}>

<div style={{padding: '1.5rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>

### ⚡ Real-time monitoring

Sledujte aktuální stav nabíjení, spotřebu energie, teploty a diagnostiku v reálném čase.

</div>

<div style={{padding: '1.5rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>

### 🔋 Řízení nabíjení

Spouštějte, zastavujte a konfigurujte nabíjení. Nastavte maximální proud a implementujte load balancing.

</div>

<div style={{padding: '1.5rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>

### 📊 Reporty a analýzy

Získejte historii nabíjecích relací, spotřebu energie a exportujte data pro fakturaci.

</div>

<div style={{padding: '1.5rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>

### 🔧 Správa zařízení

Vzdálená konfigurace, OTA aktualizace firmware a správa uživatelských přístupů.

</div>

</div>

---

## Hlavní API kategorie

### 🚀 Základy
Začněte zde - seznamte se se základními endpointy pro práci se zařízeními a uživateli.

- [**Zařízení**](./api/devices) - Seznam a informace o vašich stanicích
- [**Uživatelé**](./api/users-management) - Správa uživatelských účtů
- [**Společnosti**](./api/companies-management) - Správa organizací

### ⚡ Live Data
Real-time data z vašich nabíjecích stanic.

- [**Live Data**](./api/live-data) - Aktuální stav a telemetrie
- [**Snapshot**](./api/snapshot) - Kompletní okamžitý stav
- [**Telemetrie**](./api/telemetry) - Telemetrické hodnoty v čase

### 📈 Historie a reporty
Historická data a nabíjecí reporty pro analýzu.

- [**Charging Reports**](./api/charging-reports) - Historie nabíjecích relací
- [**Historická data**](./api/historical-data) - Časové řady dat
- [**Pokročilá historie**](./api/advanced-historical-data) - Detailní historické analýzy

### 🔧 Konfigurace a řízení
Nastavení a ovládání vašich stanic.

- [**Konfigurace zařízení**](./api/device-configuration) - Vzdálené nastavení
- [**Události**](./api/device-events) - Log událostí a stavů
- [**DLM**](./api/dlm-dynamic-load-management) - Dynamic Load Management

---

## Příklady použití

### Python - Monitoring spotřeby

```python
import requests
from datetime import datetime, timedelta, timezone

API_KEY = "your_api_key"
API_SECRET = "your_api_secret"
DEVICE_ID = "your_device_id"

# Získání dat za posledních 30 dní
date_to = datetime.now(timezone.utc)
date_from = date_to - timedelta(days=30)

response = requests.get(
    f"https://cloud.mybox.pro/admin-panel/v1/external/charging-reports/device/{DEVICE_ID}",
    auth=(API_KEY, API_SECRET),
    params={
        'startDate': date_from.isoformat(),
        'endDate': date_to.isoformat()
    }
)

data = response.json()
total_energy = sum(float(r['energy_delivered']) for r in data['data'])
print(f"Celková spotřeba: {total_energy:.2f} kWh")
```

### JavaScript - Real-time stav

```javascript
const getChargingStatus = async (deviceId) => {
  const response = await fetch(
    `https://cloud.mybox.pro/admin-panel/v1/external/live/device/${deviceId}`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_KEY}:${API_SECRET}`)
      }
    }
  );

  const data = await response.json();
  const device = data.data[0].device;

  console.log(`Stav: ${device.state}`);
  console.log(`Výkon: ${device.nodes[0].telemetry.find(t => t.id === 'act-power').value} W`);
};
```

---

## Další kroky

<div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem'}}>

<a href="./api/overview" style={{
  padding: '1rem 2rem',
  background: 'var(--ifm-color-primary)',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold'
}}>
📖 Prozkoumat API Reference
</a>

<a href="./examples/overview" style={{
  padding: '1rem 2rem',
  border: '2px solid var(--ifm-color-primary)',
  color: 'var(--ifm-color-primary)',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold'
}}>
💡 Ukázkové projekty
</a>

</div>

---

## Potřebujete pomoc?

- **Email**: support@mybox.cz
- **Web**: [www.mybox.cz](https://www.mybox.cz)
- **Dokumentace**: Procházíte ji právě teď

:::info Verze API
Tato dokumentace pokrývá MyBox API v1 s průběžnými aktualizacemi.
:::
