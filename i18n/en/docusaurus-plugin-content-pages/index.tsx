import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { Rocket, Clock } from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title" style={{color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
          MyBox API Documentation
        </Heading>
        <p className="hero__subtitle" style={{color: 'white', textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'}}>
          Complete documentation for integration with MyBox Cloud API
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Rocket size={20} />
            Quick Start - 5min
            <Clock size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Complete documentation for integration with MyBox Cloud API">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
