# 👥 Správa účastníků (Participants)

## Přehled

API pro správu účastníků umožňuje spravovat vztahy mezi uživateli a společnostmi včetně jejich rolí a oprávnění. Participant je záznam, který propojuje konkrétního uživatele se společností a definuje jeho oprávnění v rámci této společnosti.

### Hlavní funkce
- Získání seznamu účastníků pro uživatele
- Zobrazení detailů konkrétního účastníka
- Správa oprávnění a rolí
- Přiřazení uživatelů ke společnostem

### Koncept účastníka
**Participant** = spojení mezi:
- **User** (uživatel) - fyzická osoba s přihlašovacími údaji
- **Company** (společnost) - organizace vlastnící zařízení
- **Permissions** (oprávnění) - seznam práv v rámci společnosti

### Use cases
- **Multi-company přístup** - jeden uživatel může mít přístup k více společnostem
- **Role-based access** - různé úrovně oprávnění pro různé uživatele
- **Delegování správy** - vlastník může přidělit práva dalším uživatelům
- **Audit přístupů** - sledování kdo má jaká oprávnění

---

## 📋 Seznam účastníků uživatele

### Endpoint
```
GET /admin-panel/v1/external/user/{id}/participant
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `id` | number | ✅ | ID uživatele |

### Response
```json
{
  "status": 1,
  "data": [
    {
      "id": 9876543210987654,
      "email": "jan.novak@example.com",
      "phone_number": "+420123456789",
      "user": {
        "id": 1234567890123456,
        "first_name": "Jan",
        "last_name": "Novák",
        "email": "jan.novak@example.com"
      },
      "company": {
        "id": 5555555555555555,
        "name": "Example Company s.r.o.",
        "ico": "12345678",
        "dic": "CZ12345678",
        "address": {
          "street": "Hlavní 123",
          "city": "Praha",
          "postal_code": "11000",
          "country": "CZ"
        }
      },
      "permissions": [
        {
          "id": 1111111111111111,
          "slug": "view_monitoring",
          "name": "View Monitoring",
          "description": "Can view monitoring data",
          "category": "monitoring"
        },
        {
          "id": 2222222222222222,
          "slug": "manage_devices",
          "name": "Manage Devices",
          "description": "Can manage device settings",
          "category": "devices"
        },
        {
          "id": 3333333333333333,
          "slug": "view_reports",
          "name": "View Reports",
          "description": "Can view charging reports",
          "category": "reports"
        }
      ],
      "role": {
        "id": 7777777777777777,
        "name": "Device Manager",
        "slug": "device_manager",
        "description": "Can manage devices and view reports",
        "is_system": false
      },
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "created_by": {
        "id": 8888888888888888,
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "updated_at": "2024-03-20T14:25:00Z",
      "expires_at": null,
      "metadata": {
        "department": "Technical",
        "employee_id": "EMP001",
        "cost_center": "IT-001"
      }
    }
  ]
}
```

### Struktura dat

#### Participant objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | Unikátní identifikátor účastníka |
| `email` | string | E-mail účastníka (může se lišit od user.email) |
| `phone_number` | string/null | Telefonní číslo |
| `user` | object | Reference na uživatele |
| `company` | object | Reference na společnost |
| `permissions` | array | Seznam oprávnění |
| `role` | object | Přiřazená role |
| `status` | string | Status (`active`, `suspended`, `pending`) |
| `created_at` | string | Datum vytvoření |
| `expires_at` | string/null | Datum expirace přístupu |

### Příklad volání

#### cURL
```bash
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/user/1234567890123456/participant" \
  -u "YOUR_API_KEY:YOUR_API_SECRET" \
  -H "Accept: application/json"
```

#### Python
```python
import requests
from requests.auth import HTTPBasicAuth

def get_user_participants(user_id):
    """Získá seznam účastníků pro uživatele"""

    url = f"https://cloud.mybox.pro/admin-panel/v1/external/user/{user_id}/participant"

    response = requests.get(
        url,
        auth=HTTPBasicAuth('YOUR_API_KEY', 'YOUR_API_SECRET'),
        headers={'Accept': 'application/json'}
    )

    if response.status_code == 200:
        participants = response.json()['data']

        for participant in participants:
            print(f"\nÚčastník: {participant['email']}")
            print(f"Společnost: {participant['company']['name']}")
            print(f"Role: {participant.get('role', {}).get('name', 'Bez role')}")
            print(f"Status: {participant['status']}")

            print("Oprávnění:")
            for perm in participant['permissions']:
                print(f"  - {perm['name']} ({perm['slug']})")
    else:
        print(f"Chyba: {response.status_code}")

# Použití
get_user_participants(1234567890123456)
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

async function getUserParticipants(userId) {
  try {
    const response = await axios.get(
      `https://cloud.mybox.pro/admin-panel/v1/external/user/${userId}/participant`,
      {
        auth: {
          username: 'YOUR_API_KEY',
          password: 'YOUR_API_SECRET'
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const participants = response.data.data;

    participants.forEach(participant => {
      console.log(`\nÚčastník: ${participant.email}`);
      console.log(`Společnost: ${participant.company.name}`);
      console.log(`Status: ${participant.status}`);

      // Zobrazit oprávnění podle kategorie
      const permsByCategory = {};
      participant.permissions.forEach(perm => {
        const category = perm.category || 'other';
        if (!permsByCategory[category]) {
          permsByCategory[category] = [];
        }
        permsByCategory[category].push(perm.name);
      });

      console.log('Oprávnění po kategoriích:');
      Object.entries(permsByCategory).forEach(([category, perms]) => {
        console.log(`  ${category}: ${perms.join(', ')}`);
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Použití
getUserParticipants(1234567890123456);
```

---

## 👤 Detail účastníka

### Endpoint
```
GET /admin-panel/v1/external/user/{id}/participant/{participantId}
```

### Parametry

#### Path parametry
| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `id` | number | ✅ | ID uživatele |
| `participantId` | number | ✅ | ID účastníka |

### Response
```json
{
  "status": 1,
  "data": {
    "id": 9876543210987654,
    "email": "jan.novak@example.com",
    "phone_number": "+420123456789",
    "user": {
      "id": 1234567890123456,
      "first_name": "Jan",
      "last_name": "Novák",
      "email": "jan.novak@example.com",
      "status": "active",
      "last_login": "2024-03-25T09:15:00Z",
      "login_count": 42
    },
    "company": {
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
      "devices_count": 5,
      "users_count": 12
    },
    "permissions": [
      {
        "id": 1111111111111111,
        "slug": "view_monitoring",
        "name": "View Monitoring",
        "description": "Can view monitoring data",
        "category": "monitoring",
        "scope": "read"
      },
      {
        "id": 2222222222222222,
        "slug": "manage_devices",
        "name": "Manage Devices",
        "description": "Can manage device settings",
        "category": "devices",
        "scope": "write"
      }
    ],
    "role": {
      "id": 7777777777777777,
      "name": "Device Manager",
      "slug": "device_manager",
      "description": "Can manage devices and view reports",
      "is_system": false,
      "permissions_count": 8
    },
    "devices": [
      {
        "id": "000C1234567890AB",
        "name": "Nabíjecí stanice - Hlavní budova",
        "product": "MyBox Blue",
        "status": "online",
        "access_level": "full"
      },
      {
        "id": "000C9876543210CD",
        "name": "Nabíjecí stanice - Parking",
        "product": "MyBox Pro",
        "status": "online",
        "access_level": "read"
      }
    ],
    "activity": {
      "last_action": "device_configuration_changed",
      "last_action_date": "2024-03-24T16:30:00Z",
      "actions_last_30_days": 156,
      "most_used_feature": "monitoring"
    },
    "settings": {
      "notifications_enabled": true,
      "notification_channels": ["email", "sms"],
      "language": "cs",
      "timezone": "Europe/Prague",
      "two_factor_enabled": false
    },
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "created_by": {
      "id": 8888888888888888,
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "updated_at": "2024-03-20T14:25:00Z",
    "expires_at": null,
    "notes": "Hlavní technik pro správu nabíjecích stanic"
  }
}
```

### Příklad volání

#### cURL
```bash
curl -X GET "https://cloud.mybox.pro/admin-panel/v1/external/user/1234567890123456/participant/9876543210987654" \
  -u "YOUR_API_KEY:YOUR_API_SECRET" \
  -H "Accept: application/json"
```

---

## 🔑 Systém oprávnění

### Kategorie oprávnění

#### Monitoring
| Permission | Popis |
|------------|-------|
| `view_monitoring` | Zobrazení live dat a telemetrie |
| `view_history` | Zobrazení historických dat |
| `export_data` | Export dat do CSV/Excel |

#### Devices
| Permission | Popis |
|------------|-------|
| `view_devices` | Zobrazení seznamu zařízení |
| `manage_devices` | Změna nastavení zařízení |
| `control_charging` | Start/stop nabíjení |
| `firmware_update` | Aktualizace firmware |

#### Reports
| Permission | Popis |
|------------|-------|
| `view_reports` | Zobrazení reportů |
| `create_reports` | Vytváření vlastních reportů |
| `export_reports` | Export reportů |

#### Users
| Permission | Popis |
|------------|-------|
| `view_users` | Zobrazení uživatelů |
| `manage_users` | Správa uživatelů |
| `manage_participants` | Správa účastníků |

#### Company
| Permission | Popis |
|------------|-------|
| `view_company` | Zobrazení informací o společnosti |
| `manage_company` | Editace údajů společnosti |
| `billing_access` | Přístup k fakturaci |

---

## 📊 Pokročilé použití

### Správa oprávnění podle zařízení
```python
def get_user_device_permissions(user_id):
    """Získá přehled oprávnění uživatele podle zařízení"""

    # Získat účastníky
    participants = get_user_participants(user_id)

    device_permissions = {}

    for participant in participants:
        company = participant['company']['name']

        # Pro každé zařízení v participant datech
        for device in participant.get('devices', []):
            device_id = device['id']

            if device_id not in device_permissions:
                device_permissions[device_id] = {
                    'device_name': device['name'],
                    'companies': [],
                    'permissions': set(),
                    'access_levels': []
                }

            device_permissions[device_id]['companies'].append(company)
            device_permissions[device_id]['access_levels'].append(device['access_level'])

            # Přidat oprávnění
            for perm in participant['permissions']:
                device_permissions[device_id]['permissions'].add(perm['slug'])

    return device_permissions
```

### Validace přístupových práv
```javascript
class AccessValidator {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async canUserAccessDevice(userId, deviceId, requiredPermission) {
    // Získat účastníky uživatele
    const participants = await this.getUserParticipants(userId);

    for (const participant of participants) {
      // Zkontrolovat, zda má přístup k zařízení
      const hasDevice = participant.devices?.some(d => d.id === deviceId);

      if (hasDevice) {
        // Zkontrolovat oprávnění
        const hasPermission = participant.permissions.some(
          p => p.slug === requiredPermission
        );

        if (hasPermission) {
          return {
            allowed: true,
            company: participant.company.name,
            role: participant.role?.name
          };
        }
      }
    }

    return {
      allowed: false,
      reason: 'No access or missing permission'
    };
  }

  async getUserPermissionMatrix(userId) {
    const participants = await this.getUserParticipants(userId);
    const matrix = {};

    participants.forEach(participant => {
      const companyId = participant.company.id;

      matrix[companyId] = {
        company: participant.company.name,
        role: participant.role?.name || 'Custom',
        permissions: participant.permissions.map(p => p.slug),
        devices: participant.devices?.map(d => ({
          id: d.id,
          name: d.name,
          access: d.access_level
        })) || []
      };
    });

    return matrix;
  }
}
```

### Audit přístupů
```python
from datetime import datetime, timedelta
import pandas as pd

def audit_participant_access(company_id, days_back=30):
    """Vytvoří audit report přístupů za období"""

    # Získat všechny účastníky společnosti
    participants = get_company_participants(company_id)

    audit_data = []

    for participant in participants:
        # Základní informace
        record = {
            'participant_id': participant['id'],
            'user_email': participant['user']['email'],
            'user_name': f"{participant['user']['first_name']} {participant['user']['last_name']}",
            'status': participant['status'],
            'role': participant.get('role', {}).get('name', 'No role'),
            'created_at': participant['created_at'],
            'last_activity': participant.get('activity', {}).get('last_action_date'),
            'permissions_count': len(participant['permissions']),
            'devices_access_count': len(participant.get('devices', []))
        }

        # Kontrola expirace
        if participant.get('expires_at'):
            expires = datetime.fromisoformat(participant['expires_at'].replace('Z', '+00:00'))
            record['expires_in_days'] = (expires - datetime.now()).days
            record['is_expiring_soon'] = record['expires_in_days'] < 30
        else:
            record['expires_in_days'] = None
            record['is_expiring_soon'] = False

        # Aktivita
        if participant.get('activity'):
            record['actions_last_30_days'] = participant['activity'].get('actions_last_30_days', 0)
            record['is_active'] = record['actions_last_30_days'] > 0
        else:
            record['actions_last_30_days'] = 0
            record['is_active'] = False

        # Kritická oprávnění
        critical_permissions = ['manage_devices', 'firmware_update', 'manage_users', 'billing_access']
        user_critical_perms = [
            p['slug'] for p in participant['permissions']
            if p['slug'] in critical_permissions
        ]
        record['has_critical_permissions'] = len(user_critical_perms) > 0
        record['critical_permissions'] = ', '.join(user_critical_perms)

        audit_data.append(record)

    # Vytvořit DataFrame
    df = pd.DataFrame(audit_data)

    # Analýza
    print("📊 AUDIT REPORT - Přístupy účastníků")
    print("=" * 60)
    print(f"Celkem účastníků: {len(df)}")
    print(f"Aktivní: {df['status'].eq('active').sum()}")
    print(f"Suspendovaní: {df['status'].eq('suspended').sum()}")
    print(f"Čekající: {df['status'].eq('pending').sum()}")
    print()

    print("⚠️ Vyžadují pozornost:")
    print(f"- Brzy expirující přístupy: {df['is_expiring_soon'].sum()}")
    print(f"- Neaktivní účastníci (0 akcí za 30 dní): {(~df['is_active']).sum()}")
    print(f"- Účastníci s kritickými oprávněními: {df['has_critical_permissions'].sum()}")

    # Export do Excel
    filename = f"audit_participants_{company_id}_{datetime.now().strftime('%Y%m%d')}.xlsx"
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Participants', index=False)

        # Přidat souhrn
        summary = pd.DataFrame([
            {'Metrika': 'Celkem účastníků', 'Hodnota': len(df)},
            {'Metrika': 'Aktivní účastníci', 'Hodnota': df['status'].eq('active').sum()},
            {'Metrika': 'Průměrný počet oprávnění', 'Hodnota': df['permissions_count'].mean()},
            {'Metrika': 'Účastníci s kritickými oprávněními', 'Hodnota': df['has_critical_permissions'].sum()}
        ])
        summary.to_excel(writer, sheet_name='Summary', index=False)

    print(f"\n✅ Report exportován: {filename}")

    return df
```

---

## ⚠️ Chybové stavy

### Možné chybové odpovědi

#### 401 Unauthorized
```json
{
  "status": 0,
  "error": "Unauthorized",
  "message": "Invalid API credentials"
}
```

#### 403 Forbidden
```json
{
  "status": 0,
  "error": "Forbidden",
  "message": "Insufficient permissions to view participants"
}
```

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "Participant not found"
}
```

---

## 💡 Best Practices

### 1. Cachování participant dat
```python
from functools import lru_cache
import time

class ParticipantCache:
    def __init__(self, ttl=300):  # 5 minut cache
        self.cache = {}
        self.ttl = ttl

    def get_participant(self, user_id, participant_id):
        cache_key = f"{user_id}:{participant_id}"

        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.ttl:
                return cached_data

        # Fetch from API
        data = self._fetch_from_api(user_id, participant_id)
        self.cache[cache_key] = (data, time.time())
        return data
```

### 2. Permission checking helper
```javascript
class PermissionChecker {
  constructor(participants) {
    this.participants = participants;
    this.permissionMap = this.buildPermissionMap();
  }

  buildPermissionMap() {
    const map = new Map();

    this.participants.forEach(participant => {
      participant.permissions.forEach(perm => {
        if (!map.has(perm.slug)) {
          map.set(perm.slug, []);
        }
        map.get(perm.slug).push({
          participantId: participant.id,
          companyId: participant.company.id,
          companyName: participant.company.name
        });
      });
    });

    return map;
  }

  hasPermission(permissionSlug) {
    return this.permissionMap.has(permissionSlug);
  }

  getCompaniesWithPermission(permissionSlug) {
    const entries = this.permissionMap.get(permissionSlug) || [];
    return [...new Set(entries.map(e => e.companyName))];
  }

  canAccessCompany(companyId) {
    return this.participants.some(p => p.company.id === companyId);
  }
}
```

### 3. Role management
```python
def get_effective_permissions(participant):
    """Získá efektivní oprávnění (role + custom permissions)"""

    permissions = set()

    # Oprávnění z role
    if participant.get('role'):
        role_permissions = get_role_permissions(participant['role']['id'])
        permissions.update(p['slug'] for p in role_permissions)

    # Explicitní oprávnění
    permissions.update(p['slug'] for p in participant['permissions'])

    # Odebrat revoked permissions
    if participant.get('revoked_permissions'):
        for revoked in participant['revoked_permissions']:
            permissions.discard(revoked['slug'])

    return list(permissions)
```

---

## 📚 Další zdroje

- [Správa uživatelů](/api/users-management) - API pro práci s uživateli
- [Správa společností](/api/companies-management) - API pro práci se společnostmi
- [Správa zařízení](/api/devices) - Informace o zařízeních
- [FAQ - Časté dotazy](/faq#participants) - Odpovědi na časté dotazy o účastnících