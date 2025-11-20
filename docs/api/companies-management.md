# 🏢 Správa společností

## Přehled

API pro správu společností umožňuje získávat informace o společnostech registrovaných v systému MyBox. Každá společnost může mít přiřazené uživatele, zařízení a specifická nastavení. Tato funkcionalita je klíčová pro organizaci a správu firemních zákazníků.

### Hlavní funkce
- Získání seznamu všech společností
- Zobrazení detailních informací o konkrétní společnosti
- Přehled přiřazených uživatelů a jejich rolí
- Seznam zařízení patřících společnosti
- Informace o fakturačních údajích

### Use cases
- **Správa zákazníků** - organizace B2B zákazníků a jejich zařízení
- **Fakturace** - získání fakturačních údajů pro vyúčtování
- **Asset management** - přehled zařízení podle společností
- **Multi-tenant řešení** - oddělení dat různých zákazníků
- **Reporting** - generování přehledů podle společností

---

## 📋 Seznam společností

### Endpoint
```
GET /admin-panel/v1/external/company
```

### Parametry
Tento endpoint nepřijímá žádné parametry.

### Response
```json
{
  "status": 1,
  "data": [
    {
      "id": 5555555555555555,
      "name": "Example Company s.r.o.",
      "ico": "12345678",
      "dic": "CZ12345678",
      "address": {
        "street": "Hlavní 123",
        "city": "Praha",
        "postal_code": "11000",
        "country": "CZ"
      },
      "contact": {
        "email": "info@example.com",
        "phone": "+420123456789",
        "website": "https://example.com"
      },
      "billing": {
        "invoice_email": "fakturace@example.com",
        "payment_method": "bank_transfer",
        "billing_period": "monthly"
      },
      "settings": {
        "default_tariff": "STANDARD",
        "auto_start_enabled": true,
        "max_charging_power": 22000,
        "notifications_enabled": true
      },
      "statistics": {
        "total_devices": 5,
        "active_devices": 4,
        "total_users": 12,
        "total_consumption_kwh": 15234.56
      },
      "created_at": "2023-06-15T10:30:00",
      "updated_at": "2024-03-20T14:25:00",
      "status": "active"
    }
  ]
}
```

### Struktura dat

#### Company objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | Unikátní identifikátor společnosti |
| `name` | string | Název společnosti |
| `ico` | string | IČO společnosti |
| `dic` | string | DIČ společnosti |
| `address` | object | Adresa sídla společnosti |
| `contact` | object | Kontaktní údaje |
| `billing` | object | Fakturační nastavení |
| `settings` | object | Specifická nastavení společnosti |
| `statistics` | object | Statistické údaje |
| `created_at` | string | Datum vytvoření |
| `updated_at` | string | Datum poslední aktualizace |
| `status` | string | Status společnosti (`active`, `suspended`, `deleted`) |

#### Address objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `street` | string | Ulice a číslo popisné |
| `city` | string | Město |
| `postal_code` | string | PSČ |
| `country` | string | Kód země (ISO 3166-1 alpha-2) |

#### Contact objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `email` | string | Kontaktní e-mail |
| `phone` | string | Telefonní číslo |
| `website` | string | Webová stránka |

#### Billing objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `invoice_email` | string | E-mail pro fakturaci |
| `payment_method` | string | Způsob platby |
| `billing_period` | string | Fakturační období |

### Příklad volání

#### cURL
```bash
curl -X GET https://api.mybox.eco/admin-panel/v1/external/company \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests

url = "https://api.mybox.eco/admin-panel/v1/external/company"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
companies = response.json()

# Vypíše všechny společnosti
for company in companies['data']:
    print(f"{company['name']} (IČO: {company['ico']})")
    print(f"  Zařízení: {company['statistics']['total_devices']}")
    print(f"  Uživatelů: {company['statistics']['total_users']}")
    print(f"  Spotřeba: {company['statistics']['total_consumption_kwh']} kWh")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const getCompanies = async () => {
  try {
    const response = await axios.get('https://api.mybox.eco/admin-panel/v1/external/company', {
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Accept': 'application/json'
      }
    });

    const companies = response.data.data;
    companies.forEach(company => {
      console.log(`${company.name} (IČO: ${company.ico})`);
      console.log(`  Status: ${company.status}`);
      console.log(`  Zařízení: ${company.statistics.total_devices}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

getCompanies();
```

---

## 🏢 Detail společnosti

### Endpoint
```
GET /admin-panel/v1/external/company/{id}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `id` | number | ✅ | ID společnosti |

### Response
```json
{
  "status": 1,
  "data": {
    "id": 5555555555555555,
    "name": "Example Company s.r.o.",
    "ico": "12345678",
    "dic": "CZ12345678",
    "address": {
      "street": "Hlavní 123",
      "city": "Praha",
      "postal_code": "11000",
      "country": "CZ",
      "gps": {
        "latitude": 50.0755381,
        "longitude": 14.4378005
      }
    },
    "contact": {
      "email": "info@example.com",
      "phone": "+420123456789",
      "website": "https://example.com",
      "support_email": "support@example.com",
      "support_phone": "+420987654321"
    },
    "billing": {
      "invoice_email": "fakturace@example.com",
      "payment_method": "bank_transfer",
      "billing_period": "monthly",
      "bank_account": "123456789/0100",
      "currency": "CZK",
      "vat_rate": 21,
      "credit_limit": 100000
    },
    "settings": {
      "default_tariff": "STANDARD",
      "auto_start_enabled": true,
      "max_charging_power": 22000,
      "notifications_enabled": true,
      "language": "cs",
      "timezone": "Europe/Prague",
      "api_access_enabled": true,
      "custom_branding": {
        "logo_url": "https://cdn.mybox.eco/logos/example-company.png",
        "primary_color": "#1E40AF"
      }
    },
    "users": [
      {
        "id": 1234567890123456,
        "first_name": "Jan",
        "last_name": "Novák",
        "email": "jan.novak@example.com",
        "role": "admin",
        "permissions": ["manage_devices", "view_monitoring", "manage_users"]
      },
      {
        "id": 9876543210987654,
        "first_name": "Marie",
        "last_name": "Svobodová",
        "email": "marie.svobodova@example.com",
        "role": "user",
        "permissions": ["view_monitoring"]
      }
    ],
    "devices": [
      {
        "id": "000C1234567890AB",
        "name": "Nabíjecí stanice - Hlavní budova",
        "product": "MyBox Blue",
        "status": "online",
        "location": "Praha - centrála",
        "installation_date": "2023-08-15"
      },
      {
        "id": "000C9876543210CD",
        "name": "Nabíjecí stanice - Parking",
        "product": "MyBox Pro",
        "status": "online",
        "location": "Praha - parking",
        "installation_date": "2023-09-20"
      }
    ],
    "contracts": [
      {
        "id": "CONTRACT-2023-001",
        "type": "service",
        "valid_from": "2023-06-15",
        "valid_to": "2025-06-14",
        "status": "active"
      }
    ],
    "statistics": {
      "total_devices": 5,
      "active_devices": 4,
      "offline_devices": 1,
      "total_users": 12,
      "active_users": 10,
      "total_consumption_kwh": 15234.56,
      "consumption_this_month_kwh": 1234.56,
      "total_charging_sessions": 3456,
      "sessions_this_month": 234,
      "average_session_duration_min": 45,
      "total_revenue_czk": 456789.50
    },
    "created_at": "2023-06-15T10:30:00",
    "updated_at": "2024-03-20T14:25:00",
    "created_by": {
      "id": 1111111111111111,
      "name": "System Admin"
    },
    "status": "active",
    "notes": "VIP zákazník - prioritní podpora"
  }
}
```

### Příklad volání

#### cURL
```bash
curl -X GET https://api.mybox.eco/admin-panel/v1/external/company/5555555555555555 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests

company_id = 5555555555555555
url = f"https://api.mybox.eco/admin-panel/v1/external/company/{company_id}"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
company = response.json()['data']

print(f"Společnost: {company['name']}")
print(f"IČO: {company['ico']}, DIČ: {company['dic']}")
print(f"Status: {company['status']}")
print(f"\nAdresa:")
print(f"  {company['address']['street']}")
print(f"  {company['address']['postal_code']} {company['address']['city']}")

print(f"\nStatistiky:")
print(f"  Celková spotřeba: {company['statistics']['total_consumption_kwh']} kWh")
print(f"  Spotřeba tento měsíc: {company['statistics']['consumption_this_month_kwh']} kWh")
print(f"  Počet nabíjecích relací: {company['statistics']['total_charging_sessions']}")

print(f"\nZařízení ({len(company['devices'])}):")
for device in company['devices']:
    print(f"  - {device['name']} ({device['product']}) - {device['status']}")

print(f"\nUživatelé ({len(company['users'])}):")
for user in company['users']:
    print(f"  - {user['first_name']} {user['last_name']} ({user['role']})")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const getCompanyDetail = async (companyId) => {
  try {
    const response = await axios.get(
      `https://api.mybox.eco/admin-panel/v1/external/company/${companyId}`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Accept': 'application/json'
        }
      }
    );

    const company = response.data.data;
    console.log(`Společnost: ${company.name}`);
    console.log(`IČO: ${company.ico}, DIČ: ${company.dic}`);
    console.log(`Status: ${company.status}`);

    // Výpis zařízení
    console.log('\nZařízení:');
    company.devices.forEach(device => {
      console.log(`  - ${device.name} (${device.status})`);
    });

    // Výpis statistik
    console.log('\nStatistiky:');
    console.log(`  Aktivní zařízení: ${company.statistics.active_devices}/${company.statistics.total_devices}`);
    console.log(`  Aktivní uživatelé: ${company.statistics.active_users}/${company.statistics.total_users}`);
    console.log(`  Spotřeba tento měsíc: ${company.statistics.consumption_this_month_kwh} kWh`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

getCompanyDetail(5555555555555555);
```

---

## 📊 Pokročilé použití

### Filtrování společností podle statistik
```python
def find_large_companies(min_devices=10, min_consumption=10000):
    """Najde velké společnosti podle počtu zařízení a spotřeby"""
    response = requests.get(
        "https://api.mybox.eco/admin-panel/v1/external/company",
        headers={"Authorization": "Bearer YOUR_API_TOKEN"}
    )
    companies = response.json()['data']

    large_companies = [
        company for company in companies
        if company['statistics']['total_devices'] >= min_devices
        and company['statistics']['total_consumption_kwh'] >= min_consumption
    ]

    return sorted(
        large_companies,
        key=lambda x: x['statistics']['total_consumption_kwh'],
        reverse=True
    )
```

### Monitoring stavu zařízení společnosti
```javascript
async function monitorCompanyDevices(companyId) {
  const response = await axios.get(
    `https://api.mybox.eco/admin-panel/v1/external/company/${companyId}`,
    {
      headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
    }
  );

  const company = response.data.data;
  const offlineDevices = company.devices.filter(d => d.status === 'offline');

  if (offlineDevices.length > 0) {
    console.log(`⚠️ ALERT: ${offlineDevices.length} zařízení offline!`);
    offlineDevices.forEach(device => {
      console.log(`  - ${device.name} (${device.location})`);
    });

    // Odeslat notifikaci
    sendNotification({
      company: company.name,
      offlineDevices: offlineDevices
    });
  }
}
```

### Generování měsíčního reportu
```python
from datetime import datetime
import pandas as pd

def generate_monthly_report(company_id):
    """Generuje měsíční report pro společnost"""
    # Získání dat společnosti
    response = requests.get(
        f"https://api.mybox.eco/admin-panel/v1/external/company/{company_id}",
        headers={"Authorization": "Bearer YOUR_API_TOKEN"}
    )
    company = response.json()['data']

    # Příprava dat pro report
    report_data = {
        'Společnost': company['name'],
        'IČO': company['ico'],
        'Měsíc': datetime.now().strftime('%B %Y'),
        'Počet zařízení': company['statistics']['total_devices'],
        'Aktivní zařízení': company['statistics']['active_devices'],
        'Počet uživatelů': company['statistics']['total_users'],
        'Spotřeba za měsíc (kWh)': company['statistics']['consumption_this_month_kwh'],
        'Počet nabíjecích relací': company['statistics']['sessions_this_month'],
        'Průměrná doba nabíjení (min)': company['statistics']['average_session_duration_min']
    }

    # Export do Excel
    df = pd.DataFrame([report_data])
    filename = f"report_{company['ico']}_{datetime.now().strftime('%Y%m')}.xlsx"
    df.to_excel(filename, index=False)

    return filename
```

---

## ⚠️ Chybové stavy

### Možné chybové odpovědi

#### 401 Unauthorized
```json
{
  "status": 0,
  "error": "Unauthorized",
  "message": "Invalid or missing API token"
}
```
**Řešení:** Zkontrolujte správnost API tokenu a jeho platnost.

#### 403 Forbidden
```json
{
  "status": 0,
  "error": "Forbidden",
  "message": "Insufficient permissions to access company data"
}
```
**Řešení:** Uživatel nemá oprávnění `view_companies`. Kontaktujte správce.

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "Company not found"
}
```
**Řešení:** Zkontrolujte správnost ID společnosti.

#### 429 Too Many Requests
```json
{
  "status": 0,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```
**Řešení:** Implementujte rate limiting a exponential backoff.

---

## 💡 Best Practices

### 1. Cachování dat společností
```python
from functools import lru_cache
import hashlib
import json

class CompanyCache:
    def __init__(self, ttl=300):  # 5 minut
        self.cache = {}
        self.ttl = ttl

    def get_company(self, company_id):
        cache_key = f"company_{company_id}"

        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.ttl:
                return cached_data

        # Fetch from API
        data = self._fetch_from_api(company_id)
        self.cache[cache_key] = (data, time.time())
        return data
```

### 2. Batch operations
```javascript
async function updateCompanySettings(companies, settings) {
  const results = await Promise.allSettled(
    companies.map(company =>
      axios.patch(
        `https://api.mybox.eco/admin-panel/v1/external/company/${company.id}`,
        { settings },
        { headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' } }
      )
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Aktualizováno: ${successful}, Selhalo: ${failed}`);
  return results;
}
```

### 3. Monitoring změn
```python
import hashlib
import json

def detect_company_changes(company_id, interval=60):
    """Detekuje změny v datech společnosti"""
    previous_hash = None

    while True:
        response = requests.get(
            f"https://api.mybox.eco/admin-panel/v1/external/company/{company_id}",
            headers={"Authorization": "Bearer YOUR_API_TOKEN"}
        )

        current_data = response.json()['data']
        current_hash = hashlib.md5(
            json.dumps(current_data, sort_keys=True).encode()
        ).hexdigest()

        if previous_hash and current_hash != previous_hash:
            print(f"Změna detekována pro společnost {company_id}")
            analyze_changes(previous_data, current_data)

        previous_hash = current_hash
        previous_data = current_data
        time.sleep(interval)
```

---

## 🔐 Bezpečnostní doporučení

1. **API Token Management**
   - Používejte samostatné tokeny pro různé aplikace
   - Pravidelně rotujte API tokeny
   - Nikdy neukládejte tokeny v kódu

2. **Rate Limiting**
   - Implementujte vlastní rate limiting
   - Používejte exponential backoff při chybách
   - Cachujte data kde je to možné

3. **Data Privacy**
   - Šifrujte citlivá data při ukládání
   - Logujte přístupy k datům společností
   - Implementujte audit trail

4. **Error Handling**
   - Nikdy nezobrazujte detailní chybové zprávy uživatelům
   - Logujte všechny chyby pro debugging
   - Implementujte fallback mechanismy

---

## 📚 Další zdroje

- [Správa uživatelů](/api/users-management) - API pro práci s uživateli
- [Správa zařízení](/api/devices) - Detailní informace o zařízeních
- [Nabíjecí reporty](/api/charging-reports) - Statistiky nabíjení
- [FAQ - Časté dotazy](/faq#spolecnosti) - Odpovědi na časté dotazy