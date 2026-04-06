'use client';

import Link from 'next/link';
import styles from './about-project.module.css';
import { useEffect } from 'react';

export default function AboutProject() {

  // Simple fade-in on scroll
  useEffect(() => {
    const elements = document.querySelectorAll(`.${styles.fadeIn}`);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show);
        }
      });
    });

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.logo}>MediStock</h1>

        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#roles">Roles</a>
          <a href="#system">System</a>
        </nav>

        {/* <Link href="/auth/signin" className={styles.loginBtn}>
          Login
        </Link> */}
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <h2 className={styles.fadeIn}>
          Smart Hospital Pharmacy Inventory System
        </h2>
        <p className={styles.fadeIn}>
          Manage medicines, track inventory, monitor alerts, and control access
          across Admin, Manager, and Pharmacist roles — all in one intelligent system.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/auth/signin" className={styles.primaryBtn}>
            Get Started
          </Link>
          <a href="#features" className={styles.secondaryBtn}>
            Explore Features
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={`${styles.section} ${styles.fadeIn}`}>
        <h2>Core Features</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>📊 Inventory Intelligence</h3>
            <p>Track stock levels, monitor assets, and manage medicines in real-time.</p>
          </div>

          <div className={styles.card}>
            <h3>🚨 Smart Alerts</h3>
            <p>Automatic alerts for low stock, expiry, and system activity.</p>
          </div>

          <div className={styles.card}>
            <h3>🔐 Secure Access</h3>
            <p>Role-based authentication ensures secure access control.</p>
          </div>

          <div className={styles.card}>
            <h3>📈 Analytics Dashboard</h3>
            <p>Visual insights into stock distribution and system performance.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className={`${styles.section} ${styles.roles}`}>
        <h2 className={styles.fadeIn}>Role-Based Access System</h2>

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <h3>👑 Admin</h3>
            <p>
              Full system control. Manage users, monitor inventory, and oversee operations.
            </p>
          </div>

          <div className={`${styles.card} ${styles.fadeIn}`}>
            <h3>📦 Manager</h3>
            <p>
              Manage stock, suppliers, and inventory distribution with predictive insights.
            </p>
          </div>

          <div className={`${styles.card} ${styles.fadeIn}`}>
            <h3>💊 Pharmacist</h3>
            <p>
              View assigned medicines, handle orders, and track alerts efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* SYSTEM */}
      <section id="system" className={`${styles.section} ${styles.fadeIn}`}>
        <h2>System Capabilities</h2>

        <ul className={styles.list}>
          <li>✔ Real-time medicine tracking</li>
          <li>✔ Inventory distribution analytics</li>
          <li>✔ Secure authentication & authorization</li>
          <li>✔ AI-powered predictive tools</li>
          <li>✔ Multi-role dashboard system</li>
        </ul>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        {/* <h2>Start Managing Smarter Today</h2> */}
        <Link href="/auth/signin" className={styles.primaryBtn}>
          Login to MediStock
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © 2026 MediStock Inventory System
      </footer>
    </div>
  );
}