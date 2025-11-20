---
id: faq
title: ❓ FAQ
sidebar_position: 10
---

# FAQ - Často kladené otázky

## Odpovědi na nejčastější dotazy a řešení problémů

---

## 🔐 Autentizace a připojení

### Q: Kde získám API Key a API Secret?
**A:** 
1. Přihlaste se do [MyBox Cloud](https://cloud.mybox.pro/)
2. Klikněte na váš email vpravo nahoře → "Nastavení účtu"
3. Najděte sekci "Autorizační tokeny"
4. Klikněte na "Vygenerovat token"

:::caution Důležité
Pro správnou funkčnost API je nutné mít roli **Company Admin**.
:::

### Q: Mohu používat stejné API přihlašovací údaje pro více zařízení?
**A:** Ano, jedny přihlašovací údaje poskytují přístup ke všem vašim zařízením. Device ID určuje, se kterým zařízením pracujete.

### Q: Chyba 401 Unauthorized - co dělat?
**A:** 
- Zkontrolujte správnost API Key a API Secret
- Ověřte, že používáte Basic Authentication
- Ujistěte se, že máte roli Company Admin
- Zkontrolujte, že neposíláte údaje s mezerami nebo novými řádky

### Q: Timeout při připojení k API
**A:**
- Ověřte internetové připojení
- Používejte HTTPS, ne HTTP
- Zkontrolujte, že není blokován port 443
- API server může být dočasně nedostupný - zkuste za chvíli

---

## 📊 Data a odpovědi

### Q: Proč API vrací pole s více záznamy?
**A:** API může vracet:
- Historické stavy zařízení
- Data pro různé vlastníky
- Různé verze dat

**Řešení:** Vždy použijte **poslední záznam** v poli (má nejvíce vyplněných hodnot).

```javascript
const data = response.data.data;
const current = data[data.length - 1]; // Poslední = aktuální
```

### Q: Některé hodnoty jsou null nebo prázdné
**A:** Ne všechny senzory jsou aktivní pořád:
- Některé se aktivují jen během nabíjení
- Některé závisí na konfiguraci zařízení
- Některé jsou dostupné jen u určitých modelů

**Řešení:** Vždy kontrolujte, zda hodnota existuje:
```javascript
const value = sensor?.value || 'N/A';
```

### Q: Všechny hodnoty ve snapshot jsou string
**A:** Pro jednotnost formátu jsou všechny hodnoty uložené jako text.

**Řešení:** Převádějte podle potřeby:
```javascript
const power = parseFloat(sensor.value);  // Pro desetinná čísla
const signal = parseInt(sensor.value);   // Pro celá čísla
```

---

## 🔌 Stavy zařízení

### Q: Jaký je rozdíl mezi `state` a `status`?
**A:**
- **status** = stav párování (paired, new, pairing)
- **state** = aktuální provozní stav (ready, disconnected, charging)

### Q: Co znamená `state: disconnected` vs `not_connected`?
**A:**
- **disconnected** = bylo online, ale ztratilo spojení (dočasný výpadek)
- **not_connected** = ještě nikdy nebylo online (nové zařízení)

### Q: Jak zjistím, že zařízení nabíjí?
**A:** Kontrolujte `state` v EVSE modulu:
```javascript
// V live data nebo snapshot
const evseNode = nodes.find(n => n.id === 'evse');
const state = evseNode.sensors.find(s => s.id === 'state');
const isCharging = state.value === '3'; // 3 = charging
```

### Q: Co znamenají stavy EVSE?
**A:**
- **1** = Idle (nečinný)
- **2** = Ready (připojeno vozidlo)
- **3** = Charging (nabíjí)
- **4** = Error (chyba)

---

## 📡 Endpointy a volání

### Q: Jaký je rate limit API?
**A:** 100 požadavků za minutu na API klíč.

### Q: Jak dlouho jsou uchovávána historická data?
**A:** Standardně 90 dní. Pro delší historii kontaktujte podporu.

### Q: Mohu ovládat zařízení přes API?
**A:** Základní API je určeno pro čtení dat. Pro ovládání (start/stop nabíjení, změna nastavení) je potřeba rozšířené API - kontaktujte podporu.

### Q: Podporuje API webhooky?
**A:** Ano, ale vyžaduje speciální konfiguraci. Kontaktujte podporu pro aktivaci.

---

## 🌡️ Senzory a telemetrie

### Q: Jaké jsou normální hodnoty teplot?
**A:**
- **temp-evse**: 20-60°C při nabíjení
- **temp-chip**: 30-70°C
- **temp-amb**: okolní teplota

⚠️ Při teplotách nad 80°C se nabíjení automaticky omezí nebo zastaví.

### Q: Co znamená hodnota signal/RSSI?
**A:**
- **signal** (0-100%): Síla WiFi signálu v procentech
- **RSSI** (dBm): Raw hodnota síly signálu
  - -30 až -50 dBm = výborný signál
  - -50 až -70 dBm = dobrý signál
  - -70 až -85 dBm = slabý signál

### Q: Jak převést session-energy na cenu?
**A:** 
```javascript
const kWh = parseFloat(sessionEnergy);
const pricePerKWh = 6.50; // Kč/kWh
const totalPrice = kWh * pricePerKWh;
```

---

## 🔧 Technické problémy

### Q: Zařízení se neobjevuje v seznamu
**A:**
1. Zkontrolujte, že je zařízení správně spárované
2. Ověřte, že máte k zařízení přístupová práva
3. Zkontrolujte roli vašeho účtu (Company Admin)

### Q: Data se neaktualizují
**A:**
- Zkontrolujte stav zařízení (musí být "ready")
- Ověřte připojení zařízení k internetu
- Data se aktualizují každých 30-60 sekund

### Q: Swagger UI nefunguje
**A:**
1. Přejděte na [Swagger UI](https://mybox.too-smart-tech.com/admin-panel/swagger/)
2. Klikněte na "Authorize"
3. Zadejte API Key jako username a API Secret jako password
4. Klikněte "Authorize" a pak "Close"

---

## 🚀 Tipy pro vývojáře

### Optimalizace požadavků
```javascript
// Špatně - mnoho jednotlivých požadavků
for (const device of devices) {
  await fetchDeviceData(device.id);
}

// Dobře - paralelní požadavky
const promises = devices.map(d => fetchDeviceData(d.id));
const results = await Promise.all(promises);
```

### Error handling
```javascript
try {
  const data = await fetchAPI(endpoint);
  return data;
} catch (error) {
  if (error.status === 429) {
    // Rate limit - počkat a zkusit znovu
    await sleep(60000);
    return fetchAPI(endpoint);
  }
  throw error;
}
```

### Caching
```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 60 sekund

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

---

## 📞 Kontakt na podporu

**Technická podpora:**
- 📧 Email: tomas@mybox.eco
- 🌐 Web: https://mybox.eco
- 💬 Discord: [MyBox Community](https://discord.gg/mybox)

**Provozní doba podpory:**
- Po-Pá: 9:00 - 17:00 CET
- Odpověď do 24 hodin v pracovní dny