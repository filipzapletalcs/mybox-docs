# 👥 Správa uživatelů

## Přehled

API pro správu uživatelů umožňuje získávat informace o uživatelích v systému MyBox, včetně jejich rolí, oprávnění a přiřazení ke společnostem. Tato funkcionalita je klíčová pro správu přístupů a organizaci uživatelů ve vašem systému.

### Hlavní funkce
- Získání seznamu všech uživatelů
- Zobrazení detailních informací o konkrétním uživateli
- Přehled účastníků (participants) a jejich rolí
- Informace o oprávněních a přístupech

### Use cases
- **Audit přístupů** - kontrola kdo má přístup k vašim zařízením
- **Správa oprávnění** - přehled rolí a permissions
- **Integrace s HR systémy** - synchronizace uživatelských dat
- **Reporting** - generování přehledů o uživatelích

---

## 📋 Seznam uživatelů

### Endpoint
```
GET /admin-panel/v1/external/user
```

### Parametry
Tento endpoint nepřijímá žádné parametry.

### Response
```json
{
  "status": 1,
  "data": [
    {
      "id": 1234567890123456,
      "first_name": "Jan",
      "last_name": "Novák",
      "email": "jan.novak@example.com",
      "status": "self_registered",
      "password": null,
      "credentials": null,
      "access": {
        "id": 1234567890123457,
        "email": "jan.novak@example.com",
        "phone_number": "+420123456789"
      },
      "participants": [
        {
          "id": 9876543210987654,
          "email": "jan.novak@example.com",
          "phone_number": null,
          "user": {
            "id": 1234567890123456
          },
          "company": {
            "id": 5555555555555555,
            "name": "Example Company s.r.o."
          },
          "permissions": [
            {
              "id": 1111111111111111,
              "slug": "view_users"
            },
            {
              "id": 2222222222222222,
              "slug": "view_monitoring"
            }
          ],
          "created_at": "2024-01-15T10:30:00",
          "created_by": null
        }
      ],
      "created_by": null,
      "created_at": "2024-01-15T10:30:00",
      "deleted_at": null
    }
  ]
}
```

### Struktura dat

#### User objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | Unikátní identifikátor uživatele |
| `first_name` | string | Jméno uživatele |
| `last_name` | string | Příjmení uživatele |
| `email` | string | E-mailová adresa |
| `status` | string | Status registrace (`self_registered`, `imported`, `invited`) |
| `access` | object | Přístupové údaje |
| `participants` | array | Seznam účastníků a jejich rolí |
| `created_at` | string | Datum vytvoření |
| `deleted_at` | string/null | Datum smazání (null pokud aktivní) |

#### Access objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | ID přístupu |
| `email` | string | E-mail pro přihlášení |
| `phone_number` | string/null | Telefonní číslo |

#### Participant objekt
| Pole | Typ | Popis |
|------|-----|-------|
| `id` | number | ID účastníka |
| `email` | string | E-mail účastníka |
| `phone_number` | string/null | Telefon účastníka |
| `user` | object | Reference na uživatele |
| `company` | object | Přiřazená společnost |
| `permissions` | array | Seznam oprávnění |

### Příklad volání

#### cURL
```bash
curl -X GET https://api.mybox.eco/admin-panel/v1/external/user \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests

url = "https://api.mybox.eco/admin-panel/v1/external/user"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
users = response.json()

# Vypíše všechny uživatele
for user in users['data']:
    print(f"{user['first_name']} {user['last_name']} ({user['email']})")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const getUsers = async () => {
  try {
    const response = await axios.get('https://api.mybox.eco/admin-panel/v1/external/user', {
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Accept': 'application/json'
      }
    });

    const users = response.data.data;
    users.forEach(user => {
      console.log(`${user.first_name} ${user.last_name} (${user.email})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

getUsers();
```

---

## 👤 Detail uživatele

### Endpoint
```
GET /admin-panel/v1/external/user/{id}
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
  "data": {
    "id": 1234567890123456,
    "first_name": "Jan",
    "last_name": "Novák",
    "email": "jan.novak@example.com",
    "status": "self_registered",
    "password": null,
    "credentials": null,
    "access": {
      "id": 1234567890123457,
      "email": "jan.novak@example.com",
      "phone_number": "+420123456789",
      "devices": [
        {
          "id": "000C1234567890AB",
          "name": "Nabíjecí stanice - Hlavní budova",
          "product": "MyBox Blue",
          "company": {
            "id": 5555555555555555,
            "name": "Example Company s.r.o."
          }
        }
      ]
    },
    "participants": [
      {
        "id": 9876543210987654,
        "email": "jan.novak@example.com",
        "phone_number": null,
        "user": {
          "id": 1234567890123456,
          "first_name": "Jan",
          "last_name": "Novák"
        },
        "company": {
          "id": 5555555555555555,
          "name": "Example Company s.r.o.",
          "ico": "12345678",
          "dic": "CZ12345678"
        },
        "permissions": [
          {
            "id": 1111111111111111,
            "slug": "view_users",
            "name": "View Users",
            "description": "Can view user information"
          },
          {
            "id": 2222222222222222,
            "slug": "view_monitoring",
            "name": "View Monitoring",
            "description": "Can view monitoring data"
          },
          {
            "id": 3333333333333333,
            "slug": "manage_devices",
            "name": "Manage Devices",
            "description": "Can manage device settings"
          }
        ],
        "created_at": "2024-01-15T10:30:00",
        "created_by": {
          "id": 7777777777777777,
          "name": "Admin User"
        }
      }
    ],
    "created_by": null,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-03-20T14:25:00",
    "deleted_at": null,
    "last_login": "2024-03-25T09:15:00",
    "login_count": 42
  }
}
```

### Příklad volání

#### cURL
```bash
curl -X GET https://api.mybox.eco/admin-panel/v1/external/user/1234567890123456 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Python
```python
import requests

user_id = 1234567890123456
url = f"https://api.mybox.eco/admin-panel/v1/external/user/{user_id}"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
user = response.json()['data']

print(f"Uživatel: {user['first_name']} {user['last_name']}")
print(f"E-mail: {user['email']}")
print(f"Status: {user['status']}")
print(f"Poslední přihlášení: {user['last_login']}")

# Výpis oprávnění
for participant in user['participants']:
    print(f"\nSpolečnost: {participant['company']['name']}")
    print("Oprávnění:")
    for perm in participant['permissions']:
        print(f"  - {perm['name']}: {perm['description']}")
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const getUserDetail = async (userId) => {
  try {
    const response = await axios.get(
      `https://api.mybox.eco/admin-panel/v1/external/user/${userId}`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Accept': 'application/json'
        }
      }
    );

    const user = response.data.data;
    console.log(`Uživatel: ${user.first_name} ${user.last_name}`);
    console.log(`E-mail: ${user.email}`);
    console.log(`Status: ${user.status}`);

    // Výpis zařízení s přístupem
    if (user.access.devices) {
      console.log('\nPřístup k zařízením:');
      user.access.devices.forEach(device => {
        console.log(`  - ${device.name} (${device.product})`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

getUserDetail(1234567890123456);
```

---

## 🔑 Oprávnění (Permissions)

Systém MyBox používá následující oprávnění pro řízení přístupu:

| Permission Slug | Název | Popis |
|----------------|-------|-------|
| `view_users` | View Users | Zobrazení informací o uživatelích |
| `manage_users` | Manage Users | Správa uživatelů (vytváření, editace) |
| `delete_users` | Delete Users | Mazání uživatelů |
| `view_roles` | View Roles | Zobrazení rolí a oprávnění |
| `manage_roles` | Manage Roles | Správa rolí |
| `view_companies` | View Companies | Zobrazení informací o společnostech |
| `manage_companies` | Manage Companies | Správa společností |
| `view_participants` | View Participants | Zobrazení účastníků |
| `manage_participants` | Manage Participants | Správa účastníků |
| `view_monitoring` | View Monitoring | Zobrazení monitorovacích dat |
| `manage_devices` | Manage Devices | Správa zařízení |
| `manage_requested_actions` | Manage Actions | Správa požadovaných akcí |

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
  "message": "Insufficient permissions to access user data"
}
```
**Řešení:** Uživatel nemá oprávnění `view_users`. Kontaktujte správce pro přidělení oprávnění.

#### 404 Not Found
```json
{
  "status": 0,
  "error": "Not Found",
  "message": "User not found"
}
```
**Řešení:** Zkontrolujte správnost ID uživatele.

#### 500 Internal Server Error
```json
{
  "status": 0,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
**Řešení:** Kontaktujte technickou podporu MyBox.

---

## 💡 Best Practices

### 1. Cachování dat
```python
import time
from functools import lru_cache

@lru_cache(maxsize=100, typed=True)
def get_user_cached(user_id):
    """Cache user data for 5 minutes"""
    return fetch_user_from_api(user_id)

# Clear cache after 5 minutes
def clear_cache_periodically():
    while True:
        time.sleep(300)  # 5 minutes
        get_user_cached.cache_clear()
```

### 2. Batch processing
```javascript
// Získání více uživatelů najednou
async function getUsersBatch(userIds) {
  const promises = userIds.map(id =>
    axios.get(`https://api.mybox.eco/admin-panel/v1/external/user/${id}`, {
      headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
    })
  );

  const responses = await Promise.allSettled(promises);
  return responses
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value.data.data);
}
```

### 3. Error handling
```python
def safe_get_user(user_id):
    """Bezpečné získání uživatele s retry logikou"""
    max_retries = 3
    retry_delay = 1

    for attempt in range(max_retries):
        try:
            response = requests.get(
                f"https://api.mybox.eco/admin-panel/v1/external/user/{user_id}",
                headers={"Authorization": "Bearer YOUR_API_TOKEN"},
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))
                continue
            else:
                raise e
```

### 4. Filtrování a vyhledávání
```javascript
// Lokální filtrování uživatelů
function filterUsers(users, criteria) {
  return users.filter(user => {
    // Filtrování podle společnosti
    if (criteria.companyId) {
      const hasCompany = user.participants.some(
        p => p.company.id === criteria.companyId
      );
      if (!hasCompany) return false;
    }

    // Filtrování podle oprávnění
    if (criteria.permission) {
      const hasPermission = user.participants.some(p =>
        p.permissions.some(perm => perm.slug === criteria.permission)
      );
      if (!hasPermission) return false;
    }

    // Filtrování podle statusu
    if (criteria.status && user.status !== criteria.status) {
      return false;
    }

    return true;
  });
}
```

### 5. Monitoring přístupů
```python
import logging
from datetime import datetime

def audit_user_access(user_id, action):
    """Logování přístupů k uživatelským datům"""
    logging.info(f"""
        User Access Audit:
        Timestamp: {datetime.now().isoformat()}
        User ID: {user_id}
        Action: {action}
        API User: {get_current_api_user()}
    """)
```

---

## 📚 Další zdroje

- [Správa společností](/api/companies-management) - API pro práci se společnostmi
- [Účastníci](/api/participants) - Detailní informace o účastnících
- [FAQ - Časté dotazy](/faq#uzivatele) - Odpovědi na časté dotazy
- [Bezpečnost API](/guides/security) - Best practices pro zabezpečení