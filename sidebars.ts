import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Úvod'
    },
    {
      type: 'doc',
      id: 'api/api-overview',
      label: '📚 API Reference'
    },
    {
      type: 'category',
      label: '🚀 Základy',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'api/devices',
          label: '📱 Informace o zařízeních'
        },
        {
          type: 'doc',
          id: 'api/users-management',
          label: '👤 Správa uživatelů'
        },
        {
          type: 'doc',
          id: 'api/companies-management',
          label: '🏢 Správa společností'
        },
        {
          type: 'doc',
          id: 'api/participants',
          label: '👥 Správa účastníků'
        }
      ]
    },
    {
      type: 'category',
      label: '⚡ Real-time Data',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'api/live-data',
          label: '📊 Live Data'
        },
        {
          type: 'doc',
          id: 'api/telemetry',
          label: '📡 Telemetrie'
        },
        {
          type: 'doc',
          id: 'api/snapshot',
          label: '📸 Snapshot'
        },
        {
          type: 'doc',
          id: 'api/node-level-monitoring',
          label: '🔍 Node-level Monitoring'
        }
      ]
    },
    {
      type: 'category',
      label: '📈 Historická data',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'api/historical-data',
          label: '📅 Základní historie'
        },
        {
          type: 'doc',
          id: 'api/advanced-historical-data',
          label: '🔬 Pokročilá historická data'
        },
        {
          type: 'doc',
          id: 'api/configuration-history',
          label: '⚙️ Historie konfigurací'
        }
      ]
    },
    {
      type: 'category',
      label: '🔧 Konfigurace a události',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'api/device-configuration',
          label: '⚙️ Konfigurace zařízení'
        },
        {
          type: 'doc',
          id: 'api/device-events',
          label: '📋 Události zařízení'
        }
      ]
    },
    // {
    //   type: 'category',
    //   label: '💡 DLM - Dynamic Load Management',
    //   collapsed: true,
    //   items: [
    //     {
    //       type: 'doc',
    //       id: 'api/dlm-dynamic-load-management',
    //       label: '⚡ DLM Dokumentace'
    //     },
    //     {
    //       type: 'doc',
    //       id: 'api/dlm-comparison',
    //       label: '🔄 AC Sensor vs ARM Unit'
    //     }
    //   ]
    // },
    {
      type: 'category',
      label: '📊 Reporty a analýzy',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'api/charging-reports',
          label: '🔌 Charging Reports'
        }
      ]
    }
  ],
};

export default sidebars;
