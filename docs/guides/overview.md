---
id: guides-overview
title: 📖 Průvodci
sidebar_position: 1
---

# Průvodci MyBox API

Krok za krokem návody pro nejčastější use cases.

## 🎯 Rychlé průvodce

### Začínáme
- [🔑 Autentizace a první kroky](./authentication)
- [🔍 Jak najít své zařízení](./finding-devices)
- [⚡ Získání live dat](./live-data)

### Monitoring
- [📊 Sledování spotřeby energie](./energy-monitoring)
- [🌡️ Monitoring teplot a napětí](./temperature-voltage)
- [📈 Vytváření grafů z historických dat](./historical-data)

### Ovládání
- [🔌 Spuštění a zastavení nabíjení](./start-stop-charging)
- [⏰ Plánování nabíjecích relací](./scheduled-charging)
- [🔄 Restart zařízení na dálku](./remote-restart)

### Pokročilé
- [🪝 Webhooky a události](./webhooks)
- [📱 Integrace s mobilní aplikací](./mobile-integration)
- [🏠 Smart home integrace](./smart-home)

## 📚 Kompletní průvodci

### 1. Fleet Management
Kompletní průvodce pro správu flotily nabíjecích stanic.

```javascript
// Příklad: Získání přehledu všech stanic
const getFleetOverview = async () => {
  const devices = await fetchAllDevices();
  const statuses = await Promise.all(
    devices.map(d => fetchDeviceStatus(d.id))
  );
  return analyzeFleetData(devices, statuses);
};
```

[Číst průvodce →](./fleet-management)

### 2. Energy Analytics
Analýza spotřeby a optimalizace nákladů.

```python
# Příklad: Výpočet měsíční spotřeby
def calculate_monthly_consumption(device_id, month):
    reports = get_charging_reports(device_id, month)
    total_kwh = sum(r['energy_consumed'] for r in reports)
    return total_kwh
```

[Číst průvodce →](./energy-analytics)

### 3. Automatizace
Automatizace běžných úloh pomocí API.

```bash
# Příklad: Automatický monitoring
#!/bin/bash
while true; do
  curl -X GET "https://cloud.mybox.pro/api/v1/external/live/device/$DEVICE_ID" \
    -u "$API_KEY:$API_SECRET" \
    | jq '.data.charging_state'
  sleep 60
done
```

[Číst průvodce →](./automation)

## 🛠️ Best Practices

### Optimalizace výkonu
- **Caching:** Cachujte statická data (informace o zařízení)
- **Batching:** Skupinujte požadavky když je to možné
- **Polling:** Používejte rozumné intervaly (30-60 sekund)

### Bezpečnost
- **Credentials:** Nikdy neukládejte API klíče v kódu
- **HTTPS:** Vždy používejte šifrované spojení
- **Validace:** Ověřujte všechna příchozí data

### Error Handling
```javascript
try {
  const data = await fetchDeviceData(deviceId);
  processData(data);
} catch (error) {
  if (error.status === 429) {
    // Rate limit - počkat a zkusit znovu
    await sleep(60000);
    return retry();
  }
  // Logovat ostatní chyby
  console.error('API Error:', error);
}
```

## 📺 Video tutoriály

- [První kroky s MyBox API](https://youtube.com/...) (5 min)
- [Monitoring nabíjecích stanic](https://youtube.com/...) (10 min)
- [Pokročilá automatizace](https://youtube.com/...) (15 min)

## 💡 Tipy a triky

### Rychlé testování
Použijte náš [API Explorer](/api-explorer) pro rychlé testování endpointů přímo v prohlížeči.

### Debugging
Zapněte verbose logging pro detailní informace o požadavcích:
```bash
curl -v -X GET "https://cloud.mybox.pro/..."
```

### Rate Limiting
Implementujte exponential backoff pro automatické opakování:
```javascript
const backoff = (retries) => Math.pow(2, retries) * 1000;
```

## 🤝 Potřebujete pomoc?

- 📧 [Technická podpora](mailto:tomas@mybox.eco)
- 💬 [Discord komunita](https://discord.gg/mybox)
- 🐛 [Nahlásit problém](https://github.com/mybox/api-docs/issues)