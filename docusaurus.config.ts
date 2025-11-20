import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MyBox API Documentation',
  tagline: 'Kompletní dokumentace pro integraci s MyBox Cloud API',
  favicon: 'favicon/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.mybox.eco',
  baseUrl: '/',

  organizationName: 'mybox',
  projectName: 'mybox-api-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en'],
    localeConfigs: {
      cs: {
        label: 'Čeština',
        htmlLang: 'cs-CZ',
      },
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/mybox/api-docs/tree/main/',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-XXXXXXXXXX',
          anonymizeIP: true,
        },
        sitemap: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    metadata: [
      {name: 'keywords', content: 'MyBox, API, EV charging, nabíjecí stanice, dokumentace, IoT'},
      {name: 'description', content: 'Kompletní API dokumentace pro MyBox nabíjecí stanice. Naučte se integrovat, monitorovat a ovládat MyBox zařízení.'},
      {property: 'og:title', content: 'MyBox API Documentation'},
      {property: 'og:description', content: 'Kompletní dokumentace pro integraci s MyBox Cloud API'},
      {property: 'og:type', content: 'website'},
    ],
    image: 'img/mybox-social-card.jpg',
    navbar: {
      title: 'API',
      logo: {
        alt: 'MyBox',
        src: 'img/logo-mybox.svg',
        srcDark: 'img/logo-mybox--white.svg',
      },
      items: [
        {
          to: '/docs/',
          position: 'left',
          label: '🚀 Rychlý Start',
        },
        {
          to: '/docs/api/api-overview',
          position: 'left',
          label: '📚 API Reference',
        },
        {
          to: '/docs/guides/guides-overview',
          position: 'left',
          label: '📖 Průvodci',
        },
        {
          to: '/docs/examples/examples-overview',
          position: 'left',
          label: '💻 Příklady',
        },
        {
          type: 'dropdown',
          label: '🛠️ Nástroje',
          position: 'left',
          items: [
            {
              label: 'Swagger UI',
              href: 'https://mybox.too-smart-tech.com/admin-panel/swagger/',
            },
          ],
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://cloud.mybox.pro',
          label: 'MyBox Cloud',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Dokumentace',
          items: [
            {
              label: 'Rychlý Start',
              to: '/docs/',
            },
            {
              label: 'API Reference',
              to: '/docs/api/api-overview',
            },
            {
              label: 'Průvodci',
              to: '/docs/guides/guides-overview',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
          ],
        },
        {
          title: 'Nástroje',
          items: [
            {
              label: 'Swagger UI',
              href: 'https://mybox.too-smart-tech.com/admin-panel/swagger/',
            },
          ],
        },
        {
          title: 'MyBox',
          items: [
            {
              label: 'Hlavní web',
              href: 'https://mybox.eco',
            },
            {
              label: 'MyBox Cloud',
              href: 'https://cloud.mybox.pro',
            },
            {
              label: 'Podpora',
              href: 'https://mybox.eco/kontakty/',
            },
            {
              label: 'Obchodní podmínky',
              href: 'https://mybox.eco/wp-content/uploads/filr/3145/MyBox_VOP_2024_CZ-2.pdf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MyBox. Vytvořeno s ❤️ pomocí Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python', 'ruby', 'php', 'csharp', 'go', 'java', 'swift', 'kotlin'],
    },
    // Search (Algolia) is intentionally disabled for now
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/favicon/favicon-32x32.png',
          },
          {
            tagName: 'link',
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon/favicon-16x16.png',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/favicon/apple-touch-icon.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/favicon/safari-pinned-tab.svg',
            color: '#00A651',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/favicon/site.webmanifest',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#00A651',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#00A651',
          },
        ],
      },
    ],
  ],

  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js',
      async: true,
    },
  ],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
};

export default config;
