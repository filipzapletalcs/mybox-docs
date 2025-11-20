---
id: energy-monitoring
title: 📈 Pokročilý monitoring spotřeby energie
sidebar_position: 4
---

# Monitoring a analýza spotřeby energie

## 🎯 Proč monitorovat spotřebu?

Detailní monitoring spotřeby energie vám umožní:
- 💰 **Optimalizovat náklady** - identifikovat největší spotřebiče
- 📊 **Analyzovat trendy** - pochopit vzorce spotřeby
- ⚡ **Předcházet přetížení** - včasné varování před překročením limitů
- 🌱 **Snižovat CO2** - sledovat a redukovat uhlíkovou stopu
- 🔧 **Detekovat problémy** - odhalit abnormální spotřebu

## 📡 Real-time monitoring s MyBox API

### Základní monitoring systém

```python
import requests
import json
from datetime import datetime, timedelta
import pandas as pd
import matplotlib.pyplot as plt
from collections import deque

class EnergyMonitor:
    """
    Komplexní systém pro monitoring spotřeby energie
    """

    def __init__(self, device_id, api_key, api_secret):
        self.device_id = device_id
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://cloud.mybox.pro/admin-panel/v1"
        self.auth = (api_key, api_secret)

        # Datové struktury pro ukládání měření
        self.power_buffer = deque(maxlen=3600)  # 1 hodina dat (vzorek/sekundu)
        self.energy_data = []
        self.alerts = []

    def get_current_power(self):
        """
        Získání aktuálního příkonu
        """

        response = requests.get(
            f"{self.base_url}/external/live/device/{self.device_id}",
            auth=self.auth
        )

        if response.status_code == 200:
            data = response.json()

            # Extrakce telemetrických dat
            for owner_data in data.get('data', []):
                device = owner_data.get('device', {})
                nodes = device.get('nodes', [])

                for node in nodes:
                    if node.get('id') == 'ac-module':
                        sensors = node.get('sensors', [])

                        power_data = {
                            'timestamp': datetime.now(),
                            'l1_voltage': None,
                            'l2_voltage': None,
                            'l3_voltage': None,
                            'l1_current': None,
                            'l2_current': None,
                            'l3_current': None,
                            'total_power': None,
                            'power_factor': None,
                            'frequency': None
                        }

                        for sensor in sensors:
                            sensor_id = sensor.get('id', '')
                            value = sensor.get('value', '')

                            if 'voltage-l1' in sensor_id:
                                power_data['l1_voltage'] = float(value) if value else 0
                            elif 'voltage-l2' in sensor_id:
                                power_data['l2_voltage'] = float(value) if value else 0
                            elif 'voltage-l3' in sensor_id:
                                power_data['l3_voltage'] = float(value) if value else 0
                            elif 'current-l1' in sensor_id:
                                power_data['l1_current'] = float(value) if value else 0
                            elif 'current-l2' in sensor_id:
                                power_data['l2_current'] = float(value) if value else 0
                            elif 'current-l3' in sensor_id:
                                power_data['l3_current'] = float(value) if value else 0
                            elif 'act-power' in sensor_id:
                                power_data['total_power'] = float(value) if value else 0
                            elif 'power-factor' in sensor_id:
                                power_data['power_factor'] = float(value) if value else 0
                            elif 'frequency' in sensor_id:
                                power_data['frequency'] = float(value) if value else 0

                        # Výpočet celkového výkonu pokud není přímo k dispozici
                        if power_data['total_power'] is None:
                            p1 = (power_data['l1_voltage'] or 0) * (power_data['l1_current'] or 0)
                            p2 = (power_data['l2_voltage'] or 0) * (power_data['l2_current'] or 0)
                            p3 = (power_data['l3_voltage'] or 0) * (power_data['l3_current'] or 0)
                            power_data['total_power'] = (p1 + p2 + p3) / 1000  # kW

                        return power_data

        return None

    def start_monitoring(self, interval_seconds=5, duration_minutes=60):
        """
        Spuštění kontinuálního monitoringu

        Args:
            interval_seconds: Interval mezi měřeními
            duration_minutes: Celková doba monitoringu
        """

        import time

        end_time = datetime.now() + timedelta(minutes=duration_minutes)
        measurements = []

        print(f"🔍 Spouštím monitoring na {duration_minutes} minut...")
        print("-" * 50)

        while datetime.now() < end_time:
            # Získat aktuální data
            power_data = self.get_current_power()

            if power_data:
                measurements.append(power_data)
                self.power_buffer.append(power_data['total_power'])

                # Kontrola anomálií
                self._check_anomalies(power_data)

                # Zobrazení aktuálních hodnot
                self._display_current_values(power_data)

                # Uložení do bufferu
                self.energy_data.append(power_data)

            time.sleep(interval_seconds)

        # Analýza po dokončení
        self._analyze_session(measurements)

        return measurements

    def _check_anomalies(self, power_data):
        """
        Detekce anomálií ve spotřebě
        """

        alerts = []

        # Kontrola překročení limitů
        if power_data['total_power'] > 11:  # 11 kW limit
            alerts.append({
                'type': 'POWER_LIMIT',
                'message': f"Překročen limit výkonu: {power_data['total_power']:.2f} kW",
                'severity': 'HIGH'
            })

        # Kontrola nevyváženosti fází
        currents = [
            power_data['l1_current'] or 0,
            power_data['l2_current'] or 0,
            power_data['l3_current'] or 0
        ]

        if max(currents) > 0:
            imbalance = (max(currents) - min(currents)) / max(currents) * 100
            if imbalance > 20:  # 20% nevyváženost
                alerts.append({
                    'type': 'PHASE_IMBALANCE',
                    'message': f"Nevyváženost fází: {imbalance:.1f}%",
                    'severity': 'MEDIUM'
                })

        # Kontrola power factoru
        if power_data['power_factor'] and power_data['power_factor'] < 0.9:
            alerts.append({
                'type': 'LOW_POWER_FACTOR',
                'message': f"Nízký účiník: {power_data['power_factor']:.2f}",
                'severity': 'LOW'
            })

        # Zpracování alertů
        for alert in alerts:
            self.alerts.append({
                'timestamp': power_data['timestamp'],
                **alert
            })
            print(f"⚠️ ALERT: {alert['message']}")

    def _display_current_values(self, power_data):
        """
        Zobrazení aktuálních hodnot
        """

        print(f"\n[{power_data['timestamp'].strftime('%H:%M:%S')}]")
        print(f"⚡ Výkon: {power_data['total_power']:.2f} kW")
        print(f"📊 L1: {power_data['l1_current']:.1f}A @ {power_data['l1_voltage']:.0f}V")
        print(f"📊 L2: {power_data['l2_current']:.1f}A @ {power_data['l2_voltage']:.0f}V")
        print(f"📊 L3: {power_data['l3_current']:.1f}A @ {power_data['l3_voltage']:.0f}V")

        if power_data['power_factor']:
            print(f"⚡ Účiník: {power_data['power_factor']:.2f}")

    def _analyze_session(self, measurements):
        """
        Analýza naměřených dat
        """

        if not measurements:
            return

        df = pd.DataFrame(measurements)

        print("\n" + "=" * 50)
        print("📊 ANALÝZA SPOTŘEBY")
        print("=" * 50)

        # Základní statistiky
        avg_power = df['total_power'].mean()
        max_power = df['total_power'].max()
        min_power = df['total_power'].min()

        print(f"\n📈 Statistiky výkonu:")
        print(f"  Průměr: {avg_power:.2f} kW")
        print(f"  Maximum: {max_power:.2f} kW")
        print(f"  Minimum: {min_power:.2f} kW")

        # Výpočet spotřeby
        duration_hours = (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 3600
        total_energy = avg_power * duration_hours

        print(f"\n⚡ Celková spotřeba: {total_energy:.2f} kWh")
        print(f"💰 Odhadovaná cena: {total_energy * 4.5:.2f} Kč")  # 4.5 Kč/kWh

        # Alertů souhrn
        if self.alerts:
            print(f"\n⚠️ Detekováno {len(self.alerts)} alertů")
            alert_types = {}
            for alert in self.alerts:
                alert_types[alert['type']] = alert_types.get(alert['type'], 0) + 1

            for alert_type, count in alert_types.items():
                print(f"  - {alert_type}: {count}x")
```

### Pokročilá analýza dat

```python
import numpy as np
from scipy import signal
from sklearn.ensemble import IsolationForest

class AdvancedEnergyAnalytics:
    """
    Pokročilé analytické funkce pro energetická data
    """

    def __init__(self, energy_monitor):
        self.monitor = energy_monitor
        self.df = None

    def load_historical_data(self, device_id, days=30):
        """
        Načtení historických dat
        """

        response = requests.get(
            f"{self.monitor.base_url}/external/history/telemetry/{device_id}/act-power",
            auth=self.monitor.auth,
            params={
                'from': (datetime.now() - timedelta(days=days)).isoformat(),
                'to': datetime.now().isoformat(),
                'interval': '15m'  # 15 minutové intervaly
            }
        )

        if response.status_code == 200:
            data = response.json()
            # Převod na DataFrame
            self.df = pd.DataFrame(data['data'])
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
            self.df.set_index('timestamp', inplace=True)

            return self.df

        return None

    def detect_consumption_patterns(self):
        """
        Detekce vzorců ve spotřebě
        """

        if self.df is None:
            return None

        patterns = {
            'daily_profile': self._analyze_daily_pattern(),
            'weekly_profile': self._analyze_weekly_pattern(),
            'peak_hours': self._find_peak_hours(),
            'baseline_consumption': self._find_baseline()
        }

        return patterns

    def _analyze_daily_pattern(self):
        """
        Analýza denního profilu spotřeby
        """

        hourly_avg = self.df.groupby(self.df.index.hour)['value'].mean()

        return {
            'hourly_average': hourly_avg.to_dict(),
            'morning_peak': hourly_avg[6:9].max(),
            'evening_peak': hourly_avg[17:21].max(),
            'night_minimum': hourly_avg[[23, 0, 1, 2, 3, 4, 5]].min()
        }

    def _analyze_weekly_pattern(self):
        """
        Analýza týdenního profilu
        """

        daily_avg = self.df.groupby(self.df.index.dayofweek)['value'].mean()

        return {
            'daily_average': daily_avg.to_dict(),
            'weekday_avg': daily_avg[0:5].mean(),
            'weekend_avg': daily_avg[5:7].mean(),
            'busiest_day': daily_avg.idxmax()
        }

    def _find_peak_hours(self, percentile=90):
        """
        Identifikace špičkových hodin
        """

        threshold = self.df['value'].quantile(percentile / 100)
        peak_data = self.df[self.df['value'] > threshold]

        peak_hours = peak_data.index.hour.value_counts().head(3)

        return {
            'threshold_kw': threshold,
            'top_hours': peak_hours.to_dict(),
            'peak_percentage': len(peak_data) / len(self.df) * 100
        }

    def _find_baseline(self):
        """
        Určení základní spotřeby (standby)
        """

        # Použít 5. percentil jako baseline
        baseline = self.df['value'].quantile(0.05)

        return {
            'baseline_kw': baseline,
            'baseline_daily_kwh': baseline * 24,
            'baseline_monthly_kwh': baseline * 24 * 30,
            'baseline_yearly_cost': baseline * 24 * 365 * 4.5  # 4.5 Kč/kWh
        }

    def anomaly_detection(self, contamination=0.05):
        """
        Detekce anomálií pomocí Isolation Forest
        """

        if self.df is None or len(self.df) < 100:
            return None

        # Příprava features
        features = []
        for i in range(len(self.df)):
            features.append([
                self.df.iloc[i]['value'],
                self.df.index[i].hour,
                self.df.index[i].dayofweek,
                self.df.iloc[max(0, i-1)]['value'] if i > 0 else 0,  # Předchozí hodnota
                self.df.iloc[min(len(self.df)-1, i+1)]['value'] if i < len(self.df)-1 else 0  # Následující
            ])

        # Trénování modelu
        clf = IsolationForest(contamination=contamination, random_state=42)
        predictions = clf.fit_predict(features)

        # Identifikace anomálií
        anomalies = self.df[predictions == -1].copy()
        anomalies['severity'] = 'HIGH'

        return {
            'count': len(anomalies),
            'anomalies': anomalies.to_dict('records'),
            'percentage': len(anomalies) / len(self.df) * 100
        }

    def forecast_consumption(self, days_ahead=7):
        """
        Predikce budoucí spotřeby
        """

        if self.df is None or len(self.df) < 168:  # Minimálně týden dat
            return None

        # Jednoduchý ARIMA model nebo Prophet by byl lepší,
        # ale pro demonstraci použijeme průměrování

        # Vypočítat průměrný profil pro každou hodinu každého dne v týdnu
        weekly_profile = {}

        for day in range(7):
            for hour in range(24):
                mask = (self.df.index.dayofweek == day) & (self.df.index.hour == hour)
                weekly_profile[(day, hour)] = self.df[mask]['value'].mean()

        # Generovat predikci
        forecast = []
        current_time = datetime.now()

        for i in range(days_ahead * 24):
            future_time = current_time + timedelta(hours=i)
            day = future_time.weekday()
            hour = future_time.hour

            predicted_value = weekly_profile.get((day, hour), 0)

            # Přidat náhodnou variabilitu (±10%)
            predicted_value *= np.random.uniform(0.9, 1.1)

            forecast.append({
                'timestamp': future_time,
                'predicted_kw': predicted_value,
                'confidence_lower': predicted_value * 0.8,
                'confidence_upper': predicted_value * 1.2
            })

        return pd.DataFrame(forecast)
```

### Vizualizace a dashboardy

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

class EnergyDashboard:
    """
    Interaktivní dashboard pro vizualizaci energetických dat
    """

    def __init__(self, analytics):
        self.analytics = analytics

    def create_realtime_dashboard(self):
        """
        Vytvoření real-time dashboardu
        """

        # Vytvoření subplotů
        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=(
                'Aktuální výkon', 'Rozdělení fází',
                'Historie 24h', 'Týdenní trend',
                'Denní profil', 'Nákladová analýza'
            ),
            specs=[
                [{'type': 'indicator'}, {'type': 'bar'}],
                [{'type': 'scatter'}, {'type': 'scatter'}],
                [{'type': 'bar'}, {'type': 'pie'}]
            ]
        )

        # 1. Aktuální výkon (gauge)
        current_power = self.analytics.monitor.power_buffer[-1] if self.analytics.monitor.power_buffer else 0

        fig.add_trace(
            go.Indicator(
                mode="gauge+number+delta",
                value=current_power,
                title={'text': "Výkon (kW)"},
                delta={'reference': 11},
                gauge={
                    'axis': {'range': [None, 15]},
                    'bar': {'color': "darkblue"},
                    'steps': [
                        {'range': [0, 6], 'color': "lightgray"},
                        {'range': [6, 11], 'color': "gray"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 11
                    }
                }
            ),
            row=1, col=1
        )

        # 2. Rozdělení fází (bar chart)
        last_measurement = self.analytics.monitor.energy_data[-1] if self.analytics.monitor.energy_data else {}

        fig.add_trace(
            go.Bar(
                x=['L1', 'L2', 'L3'],
                y=[
                    last_measurement.get('l1_current', 0),
                    last_measurement.get('l2_current', 0),
                    last_measurement.get('l3_current', 0)
                ],
                name='Proud (A)',
                marker_color=['red', 'yellow', 'blue']
            ),
            row=1, col=2
        )

        # 3. Historie 24h
        if self.analytics.df is not None:
            last_24h = self.analytics.df.last('24H')

            fig.add_trace(
                go.Scatter(
                    x=last_24h.index,
                    y=last_24h['value'],
                    mode='lines',
                    name='Výkon',
                    line=dict(color='blue', width=2)
                ),
                row=2, col=1
            )

        # 4. Týdenní trend
        if self.analytics.df is not None:
            weekly = self.analytics.df.resample('D').mean().last('7D')

            fig.add_trace(
                go.Scatter(
                    x=weekly.index,
                    y=weekly['value'],
                    mode='lines+markers',
                    name='Denní průměr',
                    line=dict(color='green', width=2)
                ),
                row=2, col=2
            )

        # 5. Denní profil
        patterns = self.analytics.detect_consumption_patterns()
        if patterns:
            hourly = patterns['daily_profile']['hourly_average']

            fig.add_trace(
                go.Bar(
                    x=list(hourly.keys()),
                    y=list(hourly.values()),
                    name='Hodinový průměr',
                    marker_color='lightblue'
                ),
                row=3, col=1
            )

        # 6. Nákladová analýza
        costs = self._calculate_costs()

        fig.add_trace(
            go.Pie(
                labels=list(costs.keys()),
                values=list(costs.values()),
                hole=.3
            ),
            row=3, col=2
        )

        # Aktualizace layoutu
        fig.update_layout(
            height=900,
            showlegend=False,
            title_text="Energy Monitoring Dashboard",
            title_font_size=20
        )

        return fig

    def _calculate_costs(self):
        """
        Výpočet nákladů podle tarifů
        """

        if self.analytics.df is None:
            return {}

        # Simulace různých tarifů
        high_tariff_hours = [7, 8, 17, 18, 19, 20]
        low_tariff_hours = [23, 0, 1, 2, 3, 4, 5]

        costs = {
            'Vysoký tarif': 0,
            'Nízký tarif': 0,
            'Běžný tarif': 0
        }

        for hour in range(24):
            hourly_consumption = self.analytics.df[self.analytics.df.index.hour == hour]['value'].sum()

            if hour in high_tariff_hours:
                costs['Vysoký tarif'] += hourly_consumption * 6.0  # 6 Kč/kWh
            elif hour in low_tariff_hours:
                costs['Nízký tarif'] += hourly_consumption * 3.0  # 3 Kč/kWh
            else:
                costs['Běžný tarif'] += hourly_consumption * 4.5  # 4.5 Kč/kWh

        return costs

    def export_report(self, filename='energy_report.html'):
        """
        Export reportu do HTML
        """

        fig = self.create_realtime_dashboard()
        fig.write_html(filename)

        print(f"✅ Report exportován do {filename}")
```

## 🔔 Alerting a notifikace

```python
class AlertingSystem:
    """
    Systém pro zasílání alertů a notifikací
    """

    def __init__(self, thresholds):
        self.thresholds = thresholds
        self.alert_history = []

    def check_thresholds(self, measurement):
        """
        Kontrola překročení prahových hodnot
        """

        alerts = []

        # Kontrola výkonu
        if measurement['total_power'] > self.thresholds.get('max_power', 11):
            alerts.append({
                'type': 'POWER_EXCEEDED',
                'severity': 'HIGH',
                'value': measurement['total_power'],
                'threshold': self.thresholds['max_power'],
                'message': f"Výkon {measurement['total_power']:.2f} kW překročil limit {self.thresholds['max_power']} kW"
            })

        # Kontrola proudu na fázích
        for phase in ['l1', 'l2', 'l3']:
            current = measurement.get(f'{phase}_current', 0)
            max_current = self.thresholds.get(f'max_current_{phase}', 16)

            if current > max_current:
                alerts.append({
                    'type': f'CURRENT_EXCEEDED_{phase.upper()}',
                    'severity': 'HIGH',
                    'value': current,
                    'threshold': max_current,
                    'message': f"Proud na {phase.upper()} ({current:.1f}A) překročil limit {max_current}A"
                })

        return alerts

    def send_alert(self, alert):
        """
        Odeslání alertu
        """

        # Email notifikace
        if alert['severity'] == 'HIGH':
            self._send_email_alert(alert)

        # SMS pro kritické alerté
        if alert['severity'] == 'CRITICAL':
            self._send_sms_alert(alert)

        # Webhook pro integraci
        self._send_webhook(alert)

        # Uložení do historie
        self.alert_history.append({
            'timestamp': datetime.now(),
            **alert
        })

    def _send_email_alert(self, alert):
        """
        Odeslání emailové notifikace
        """

        import smtplib
        from email.mime.text import MIMEText

        subject = f"⚠️ MyBox Alert: {alert['type']}"
        body = f"""
        Detekován alert ve vašem MyBox systému:

        Typ: {alert['type']}
        Závažnost: {alert['severity']}
        Hodnota: {alert['value']}
        Limit: {alert['threshold']}

        Zpráva: {alert['message']}

        Čas: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """

        # Zde byste implementovali skutečné odeslání emailu
        print(f"📧 Email alert odeslán: {alert['type']}")

    def _send_webhook(self, alert):
        """
        Odeslání webhooku pro externí systémy
        """

        webhook_url = "https://your-webhook-endpoint.com/alerts"

        payload = {
            'timestamp': datetime.now().isoformat(),
            'alert': alert
        }

        # requests.post(webhook_url, json=payload)
        print(f"🔗 Webhook odeslán: {alert['type']}")

    def generate_daily_summary(self):
        """
        Generování denního souhrnu
        """

        today_alerts = [
            a for a in self.alert_history
            if a['timestamp'].date() == datetime.now().date()
        ]

        summary = {
            'date': datetime.now().date().isoformat(),
            'total_alerts': len(today_alerts),
            'by_severity': {},
            'by_type': {}
        }

        for alert in today_alerts:
            # Podle závažnosti
            severity = alert['severity']
            summary['by_severity'][severity] = summary['by_severity'].get(severity, 0) + 1

            # Podle typu
            alert_type = alert['type']
            summary['by_type'][alert_type] = summary['by_type'].get(alert_type, 0) + 1

        return summary
```

## 🎯 Příklad použití

```python
# Konfigurace
API_KEY = "YOUR_API_KEY"
API_SECRET = "YOUR_API_SECRET"
DEVICE_ID = "qfeb-od13-ul2c-sgrl"

# Inicializace monitoru
monitor = EnergyMonitor(DEVICE_ID, API_KEY, API_SECRET)

# Spuštění monitoringu
measurements = monitor.start_monitoring(
    interval_seconds=5,
    duration_minutes=60
)

# Pokročilá analýza
analytics = AdvancedEnergyAnalytics(monitor)
analytics.load_historical_data(DEVICE_ID, days=30)

# Detekce vzorců
patterns = analytics.detect_consumption_patterns()
print(f"📊 Denní špička: {patterns['daily_profile']['evening_peak']:.2f} kW")
print(f"📊 Noční minimum: {patterns['daily_profile']['night_minimum']:.2f} kW")
print(f"📊 Základní spotřeba: {patterns['baseline_consumption']['baseline_kw']:.2f} kW")

# Detekce anomálií
anomalies = analytics.anomaly_detection()
if anomalies:
    print(f"⚠️ Detekováno {anomalies['count']} anomálií ({anomalies['percentage']:.1f}%)")

# Vytvoření dashboardu
dashboard = EnergyDashboard(analytics)
dashboard.export_report('energy_monitoring_report.html')

# Nastavení alertingu
alerting = AlertingSystem({
    'max_power': 11,
    'max_current_l1': 16,
    'max_current_l2': 16,
    'max_current_l3': 16
})

# Kontrola aktuálního stavu
current = monitor.get_current_power()
alerts = alerting.check_thresholds(current)
for alert in alerts:
    alerting.send_alert(alert)

print("✅ Monitoring dokončen!")
```

## 📚 Související návody

- [DLM - Dynamic Load Management](./dlm-setup)
- [Nabíjení podle spotových cen](./spot-price-charging)
- [Integrace s Home Assistant](./home-assistant-integration)