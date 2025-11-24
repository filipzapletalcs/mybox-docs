import React from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import { Activity, Zap, Database, Target } from 'lucide-react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  icon: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Real-time Monitoring',
    titleId: 'features.realtimeMonitoring.title',
    icon: <Activity size={64} strokeWidth={1.5} />,
    description: 'Sledujte stav nabíjení, spotřebu energie a všechny důležité parametry v reálném čase přes jednoduché API.',
    descriptionId: 'features.realtimeMonitoring.description',
  },
  {
    title: 'Snadná Integrace',
    titleId: 'features.easyIntegration.title',
    icon: <Zap size={64} strokeWidth={1.5} />,
    description: 'REST API s Basic Auth, JSON formát, jasná dokumentace a příklady kódu v různých jazycích.',
    descriptionId: 'features.easyIntegration.description',
  },
  {
    title: 'Historická Data',
    titleId: 'features.historicalData.title',
    icon: <Database size={64} strokeWidth={1.5} />,
    description: 'Přístup k historii nabíjení, telemetrii a kompletním reportům pro analýzy a fakturaci.',
    descriptionId: 'features.historicalData.description',
  },
];

function Feature({title, titleId, icon, description, descriptionId}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{ marginBottom: '1rem', color: 'var(--ifm-color-primary)' }}>
        {icon}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>
          <Translate id={titleId}>{title}</Translate>
        </h3>
        <p>
          <Translate id={descriptionId}>{description}</Translate>
        </p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="text--center" style={{ marginBottom: '3rem' }}>
          <Translate id="homepage.features.title">Proč používat MyBox API?</Translate>
        </h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        <div className="row" style={{ marginTop: '4rem' }}>
          <div className="col col--12 text--center">
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Target size={32} strokeWidth={2} />
              <Translate id="homepage.getStarted.title">Začněte hned teď</Translate>
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              <Translate id="homepage.getStarted.description">
                Vše co potřebujete pro integraci MyBox do vašich aplikací
              </Translate>
            </p>
          </div>
        </div>

        <div className="row" style={{ marginTop: '2rem' }}>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.steps.step1.title">1. Získejte přístup</Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.steps.step1.description">
                    Vygenerujte API klíče v MyBox Cloud
                  </Translate>
                </p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.steps.step2.title">2. Otestujte API</Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.steps.step2.description">
                    Použijte náš API Explorer nebo Swagger UI
                  </Translate>
                </p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.steps.step3.title">3. Integrujte</Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.steps.step3.description">
                    Využijte příklady kódu ve vašem jazyce
                  </Translate>
                </p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.steps.step4.title">4. Monitorujte</Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.steps.step4.description">
                    Sledujte real-time data z vašich stanic
                  </Translate>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}