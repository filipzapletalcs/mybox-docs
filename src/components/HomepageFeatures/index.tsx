import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '⚡ Real-time Monitoring',
    icon: '📊',
    description: 'Sledujte stav nabíjení, spotřebu energie a všechny důležité parametry v reálném čase přes jednoduché API.',
  },
  {
    title: '🔧 Snadná Integrace',
    icon: '🚀',
    description: 'REST API s Basic Auth, JSON formát, jasná dokumentace a příklady kódu v různých jazycích.',
  },
  {
    title: '📈 Historická Data',
    icon: '💾',
    description: 'Přístup k historii nabíjení, telemetrii a kompletním reportům pro analýzy a fakturaci.',
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        {icon}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="text--center" style={{ marginBottom: '3rem' }}>
          Proč používat MyBox API?
        </h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        <div className="row" style={{ marginTop: '4rem' }}>
          <div className="col col--12 text--center">
            <h2>🎯 Začněte hned teď</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Vše co potřebujete pro integraci MyBox do vašich aplikací
            </p>
          </div>
        </div>
        
        <div className="row" style={{ marginTop: '2rem' }}>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>1️⃣ Získejte přístup</h3>
              </div>
              <div className="card__body">
                <p>Vygenerujte API klíče v MyBox Cloud</p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>2️⃣ Otestujte API</h3>
              </div>
              <div className="card__body">
                <p>Použijte náš API Explorer nebo Swagger UI</p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>3️⃣ Integrujte</h3>
              </div>
              <div className="card__body">
                <p>Využijte příklady kódu ve vašem jazyce</p>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>4️⃣ Monitorujte</h3>
              </div>
              <div className="card__body">
                <p>Sledujte real-time data z vašich stanic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}