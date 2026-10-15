import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';

/* ══════════════════════════════════════════════════════
   22 SECTORS DATA — Matching Reference Design Exactly
   Each sector links directly to /app?project=upmela&sector={num}
══════════════════════════════════════════════════════ */
const SECTOR_DATA = [
  { num: 1,  name: 'Sector 1',  color: '#F58220', desc: 'संगम क्षेत्र, प्रमुख स्नान घाट, अखाड़ा शिविर' },
  { num: 2,  name: 'Sector 2',  color: '#E91E63', desc: 'त्रिवेणी मार्ग, प्रशासनिक नियंत्रण कक्ष, चिकित्सालय' },
  { num: 3,  name: 'Sector 3',  color: '#4CAF50', desc: 'महावीर मार्ग, साधु-संत शिविर, अन्नक्षेत्र' },
  { num: 4,  name: 'Sector 4',  color: '#7E57C2', desc: 'काली मार्ग, सांस्कृतिक मंच, खोया-पाया केंद्र' },
  { num: 5,  name: 'Sector 5',  color: '#E65100', desc: 'अरैल घाट, टेंट सिटी, वीआईपी आवास क्षेत्र' },
  { num: 6,  name: 'Sector 6',  color: '#00BCD4', desc: 'झूंसी क्षेत्र, मुख्य पार्किंग, बस टर्मिनल' },
  { num: 7,  name: 'Sector 7',  color: '#009688', desc: 'शास्त्री ब्रिज एप्रोच, पांटून पुल संख्या 1-4' },
  { num: 8,  name: 'Sector 8',  color: '#E53935', desc: 'किला घाट, अक्षयवट दर्शन मार्ग' },
  { num: 9,  name: 'Sector 9',  color: '#FFB300', desc: 'नागवासुकी मंदिर मार्ग, स्वयंसेवी शिविर' },
  { num: 10, name: 'Sector 10', color: '#43A047', desc: 'फाफामऊ एप्रोच, उप-प्रशासनिक केंद्र' },
  { num: 11, name: 'Sector 11', color: '#FB8C00', desc: 'गंगा पांटून क्षेत्र, आपातकालीन चिकित्सा केंद्र' },
  { num: 12, name: 'Sector 12', color: '#039BE5', desc: 'यमुना तट, बोटिंग जेटी, जल पुलिस नियंत्रण' },
  { num: 13, name: 'Sector 13', color: '#D81B60', desc: 'अलोपी देवी मार्ग, विशाल प्रदर्शनी मैदान' },
  { num: 14, name: 'Sector 14', color: '#F4511E', desc: 'दारागंज विस्तार, मीडिया केंद्र, सूचना केंद्र' },
  { num: 15, name: 'Sector 15', color: '#5E35B1', desc: 'शंकराचार्य शिविर, धर्म संसद स्थल' },
  { num: 16, name: 'Sector 16', color: '#00897B', desc: 'कल्पवासी क्षेत्र, भजन कुटीर परिसर' },
  { num: 17, name: 'Sector 17', color: '#FFB300', desc: 'नैनी एप्रोच, मुख्य होल्डिंग एरिया' },
  { num: 18, name: 'Sector 18', color: '#1E88E5', desc: 'अन्नपूर्णा क्षेत्र, जन सुविधा परिसर' },
  { num: 19, name: 'Sector 19', color: '#AD1457', desc: 'सुरक्षा बटालियन कैंप, पुलिस लाइन' },
  { num: 20, name: 'Sector 20', color: '#6A1B9A', desc: 'रेलवे स्पेशल शटल स्टैंड, प्राथमिक चिकित्सा' },
  { num: 21, name: 'Sector 21', color: '#2E7D32', desc: 'हेलीपैड क्षेत्र, आपदा प्रबंधन मुख्यालय' },
  { num: 22, name: 'Sector 22', color: '#C62828', desc: 'बाहरी रिंग रोड, अंतर्राज्यीय बस पड़ाव' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAdminMode } = useMapStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sectorsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectorClick = (sectorNum) => {
    // Navigate straight to the sector map navigation inside the app
    navigate(`/app?project=upmela&sector=${sectorNum}`);
  };

  const handleOpenAllSectors = () => {
    // Navigate to the main interactive overview map
    navigate('/app?project=upmela');
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === '#sectors') {
      sectorsRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredSectors = SECTOR_DATA.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.num.toString() === searchQuery.trim()
  );

  const row1 = filteredSectors.filter(s => s.num <= 11);
  const row2 = filteredSectors.filter(s => s.num > 11);

  return (
    <div className="kumbh-page">
      {/* ─── GOOGLE FONTS ─── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Yatra+One&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        /* ══════════════════════════════════════════════════════
           CSS STYLES — EXACT REPRODUCTION OF USER IMAGE
        ══════════════════════════════════════════════════════ */
        :root {
          --kumbh-saffron: #f26522;
          --kumbh-red: #c8102e;
          --kumbh-gold: #ffb300;
          --kumbh-bg: #fffbf5;
          --kumbh-border: #fed7aa;
          --font-hindi: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .kumbh-page {
          font-family: var(--font-hindi);
          background-color: var(--kumbh-bg);
          color: #1f2937;
          min-height: 100vh;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        /* ─── HEADER / NAVBAR ─── */
        .kumbh-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #ffffff;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
          z-index: 9999;
          display: flex;
          align-items: center;
          transition: all 0.25s ease;
          border-bottom: 1px solid #ffedd5;
        }
        .kumbh-nav.scrolled {
          box-shadow: 0 4px 20px rgba(242, 101, 34, 0.15);
        }
        .kumbh-nav__container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        /* Brand Logo on Left */
        .kumbh-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .kumbh-brand__img {
          height: 44px;
          width: auto;
          object-fit: contain;
        }
        .kumbh-brand__fallback {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .kumbh-brand__trishul {
          font-size: 1.8rem;
          color: var(--kumbh-saffron);
          line-height: 1;
        }
        .kumbh-brand__text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .kumbh-brand__city {
          font-size: 1.05rem;
          font-weight: 900;
          color: var(--kumbh-red);
          letter-spacing: -0.02em;
        }
        .kumbh-brand__event {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0f172a;
          position: relative;
        }

        /* Navigation Links in Center */
        .kumbh-menu {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .kumbh-menu__item {
          margin: 0;
        }
        .kumbh-menu__link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.42rem 0.85rem;
          font-size: 0.86rem;
          font-weight: 700;
          color: #374151;
          text-decoration: none;
          border-radius: 9999px;
          transition: all 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .kumbh-menu__link:hover {
          color: var(--kumbh-saffron);
          background-color: #fff7ed;
        }
        /* Active Home Pill Button (Matching Image) */
        .kumbh-menu__link--active {
          background-color: var(--kumbh-saffron) !important;
          color: #ffffff !important;
          box-shadow: 0 2px 8px rgba(242, 101, 34, 0.35);
        }

        /* Search & Right Controls */
        .kumbh-nav__right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .kumbh-search-box {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #fed7aa;
          border-radius: 9999px;
          padding: 0.18rem 0.2rem 0.18rem 0.75rem;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
          transition: border-color 0.2s;
        }
        .kumbh-search-box:focus-within {
          border-color: var(--kumbh-saffron);
          box-shadow: 0 0 0 2px rgba(242, 101, 34, 0.15);
        }
        .kumbh-search-box input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.82rem;
          width: 120px;
          color: #1f2937;
          font-family: inherit;
        }
        .kumbh-search-box input::placeholder {
          color: #9ca3af;
        }
        .kumbh-search-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--kumbh-saffron);
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          transition: transform 0.18s;
        }
        .kumbh-search-btn:hover {
          transform: scale(1.06);
          background: #ea580c;
        }

        /* Dashboard / Admin Button */
        .kumbh-admin-btn {
          background: #1e293b;
          color: #ffffff;
          padding: 0.42rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .kumbh-admin-btn:hover {
          background: var(--kumbh-red);
          transform: translateY(-1px);
        }

        /* Mobile Hamburger */
        .kumbh-hamburger {
          display: none;
          background: none;
          border: none;
          font-size: 1.4rem;
          cursor: pointer;
          color: var(--kumbh-saffron);
          padding: 0.25rem;
        }

        /* ─── HERO SECTION (BANNER) ─── */
        .kumbh-hero {
          position: relative;
          margin-top: 60px;
          width: 100%;
          background: #fff8ef;
          overflow: hidden;
        }
        .kumbh-hero__wrapper {
          position: relative;
          max-width: 1380px;
          margin: 0 auto;
          aspect-ratio: 1024 / 427;
          min-height: 360px;
          max-height: 620px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .kumbh-hero__banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* Interactive Hotspots Over Hero Action Cards */
        .kumbh-hero__actions-hotspot {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.75rem;
          z-index: 20;
          flex-wrap: nowrap;
        }
        .kumbh-hero__action-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          padding: 0.5rem 0.9rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.22s ease;
          text-decoration: none;
          font-family: inherit;
        }
        .kumbh-hero__action-pill:hover {
          transform: translateY(-3px) scale(1.03);
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(242, 101, 34, 0.25);
          border-color: var(--kumbh-saffron);
        }
        .kumbh-hero__action-icon {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
        }
        .kumbh-hero__action-text {
          font-size: 0.78rem;
          font-weight: 800;
          color: #1f2937;
          white-space: nowrap;
        }
        .kumbh-hero__action-arrow {
          font-size: 0.85rem;
          font-weight: 900;
          color: var(--kumbh-saffron);
          margin-left: 0.15rem;
        }

        /* Floating Stats Clickable / Interactive */
        .kumbh-hero__stats-hotspot {
          position: absolute;
          left: 1.5%;
          top: 32%;
          width: 15%;
          height: 52%;
          cursor: pointer;
          z-index: 20;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .kumbh-hero__stats-hotspot:hover {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 16px rgba(255, 179, 0, 0.2);
        }

        /* Floating Map Controls on Hero Right */
        .kumbh-hero__map-controls {
          position: absolute;
          right: 1.5%;
          top: 40%;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          z-index: 20;
        }
        .kumbh-map-ctrl-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
        .kumbh-map-ctrl-btn:hover {
          background: var(--kumbh-saffron);
          transform: scale(1.1);
        }

        /* ─── SECTORS SECTION (EXACT REFERENCE DESIGN) ─── */
        .kumbh-sectors-section {
          background: #ffffff;
          border-top: 3px solid #ffedd5;
          padding: 1.25rem 1rem 2.5rem;
        }
        .kumbh-sectors-header {
          max-width: 1380px;
          margin: 0 auto 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .kumbh-sectors-header__left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .kumbh-sectors-header__icon {
          height: 32px;
          width: auto;
          object-fit: contain;
        }
        .kumbh-sectors-header__title {
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--kumbh-red);
          margin: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 2px rgba(200, 16, 46, 0.08);
        }
        .kumbh-sectors-header__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1.8px solid var(--kumbh-saffron);
          color: var(--kumbh-saffron);
          border-radius: 9999px;
          padding: 0.42rem 1.15rem;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(242, 101, 34, 0.1);
          font-family: inherit;
        }
        .kumbh-sectors-header__btn:hover {
          background: var(--kumbh-saffron);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(242, 101, 34, 0.3);
        }

        /* Sector Search Filter */
        .kumbh-sectors-search {
          max-width: 1380px;
          margin: 0 auto 1rem;
        }
        .kumbh-sectors-search input {
          width: 100%;
          max-width: 380px;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: 1.5px solid #fed7aa;
          background: #fffbf5;
          font-size: 0.85rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }
        .kumbh-sectors-search input:focus {
          border-color: var(--kumbh-saffron);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(242, 101, 34, 0.15);
        }

        /* ─── 22 SECTOR CARDS GRID ─── */
        .kumbh-grid-container {
          max-width: 1380px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .kumbh-grid-row {
          display: grid;
          grid-template-columns: repeat(11, 1fr);
          gap: 0.55rem;
          width: 100%;
        }

        /* Individual Sector Card */
        .kumbh-card {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid transparent;
          position: relative;
        }
        .kumbh-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
          border-color: var(--card-color, var(--kumbh-saffron));
          z-index: 10;
        }
        .kumbh-card__thumb {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #e2e8f0;
        }
        .kumbh-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .kumbh-card:hover .kumbh-card__img {
          transform: scale(1.12);
        }
        .kumbh-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.32rem 0.45rem;
          gap: 0.25rem;
          transition: background 0.2s;
        }
        .kumbh-card__name {
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .kumbh-card__arrow {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 900;
          line-height: 1;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .kumbh-card:hover .kumbh-card__arrow {
          transform: scale(1.18) translateX(1px);
        }

        /* ─── ABOUT SECTION (कुंभ के बारे में) ─── */
        .kumbh-about {
          background: linear-gradient(180deg, #fffbf5 0%, #fff7ed 100%);
          padding: 4rem 1.5rem;
          border-top: 1px solid #fed7aa;
        }
        .kumbh-about__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3.5rem;
          align-items: center;
        }
        .kumbh-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffedd5;
          color: #c2410c;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          margin-bottom: 0.85rem;
          border: 1px solid #fdba74;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .kumbh-about__title {
          font-size: 2.3rem;
          font-weight: 900;
          color: #1e293b;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .kumbh-about__title span {
          color: var(--kumbh-saffron);
        }
        .kumbh-about__desc {
          color: #4b5563;
          font-size: 0.98rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .kumbh-dates-card {
          background: #ffffff;
          border: 1.5px solid #fed7aa;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 4px 16px rgba(242, 101, 34, 0.08);
          margin-bottom: 1.5rem;
        }
        .kumbh-dates-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--kumbh-red);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .kumbh-dates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
        }
        .kumbh-date-item {
          background: #fff8ef;
          padding: 0.5rem 0.7rem;
          border-radius: 8px;
          border-left: 3px solid var(--kumbh-saffron);
        }
        .kumbh-date-item__name {
          font-size: 0.78rem;
          font-weight: 800;
          color: #1f2937;
          display: block;
        }
        .kumbh-date-item__date {
          font-size: 0.7rem;
          color: #6b7280;
        }
        .kumbh-cta-btn {
          background: linear-gradient(135deg, var(--kumbh-saffron) 0%, var(--kumbh-red) 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.85rem 2.2rem;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(242, 101, 34, 0.35);
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .kumbh-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(242, 101, 34, 0.45);
        }

        /* Map Frame in About */
        .kumbh-about__map-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.15);
          border: 4px solid #ffffff;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .kumbh-about__map-card:hover {
          transform: scale(1.02);
        }
        .kumbh-about__map-card img {
          width: 100%;
          height: auto;
          display: block;
        }
        .kumbh-about__map-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          color: #ffffff;
        }
        .kumbh-about__map-badge {
          background: var(--kumbh-saffron);
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 800;
        }

        /* ─── FACILITIES SECTION (सुविधाएँ) ─── */
        .kumbh-fac {
          background: #ffffff;
          padding: 4.5rem 1.5rem;
          text-align: center;
        }
        .kumbh-fac__head {
          max-width: 680px;
          margin: 0 auto 2.5rem;
        }
        .kumbh-fac__title {
          font-size: 2.1rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .kumbh-fac__grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .kumbh-fac-card {
          background: linear-gradient(180deg, #fffaf4 0%, #ffffff 100%);
          border: 1.5px solid #fed7aa;
          border-radius: 16px;
          padding: 1.6rem 1.2rem;
          text-align: center;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .kumbh-fac-card:hover {
          transform: translateY(-5px);
          border-color: var(--kumbh-saffron);
          box-shadow: 0 10px 25px rgba(242, 101, 34, 0.15);
        }
        .kumbh-fac-card__icon {
          font-size: 2.4rem;
          margin-bottom: 0.75rem;
          display: inline-block;
        }
        .kumbh-fac-card__title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--kumbh-red);
          margin-bottom: 0.35rem;
        }
        .kumbh-fac-card__desc {
          font-size: 0.82rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* ─── TRAVEL SECTION (यात्रा जानकारी) ─── */
        .kumbh-travel {
          background: #fff8ef;
          padding: 4.5rem 1.5rem;
          border-top: 1px solid #fed7aa;
        }
        .kumbh-travel__container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .kumbh-travel__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .kumbh-travel-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border-top: 4px solid var(--kumbh-saffron);
        }
        .kumbh-travel-card__icon {
          font-size: 2rem;
          margin-bottom: 0.6rem;
        }
        .kumbh-travel-card__title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.4rem;
        }
        .kumbh-travel-card__desc {
          font-size: 0.84rem;
          color: #4b5563;
          line-height: 1.6;
        }

        /* ─── GALLERY SECTION (फोटो गैलरी) ─── */
        .kumbh-gallery {
          background: #ffffff;
          padding: 4.5rem 1.5rem;
          text-align: center;
        }
        .kumbh-gallery__grid {
          max-width: 1200px;
          margin: 2rem auto 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.2rem;
        }
        .kumbh-gallery__item {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          aspect-ratio: 16 / 11;
          position: relative;
        }
        .kumbh-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .kumbh-gallery__item:hover img {
          transform: scale(1.08);
        }

        /* ─── FOOTER (संपर्क व हेल्पलाइन) ─── */
        .kumbh-footer {
          background: linear-gradient(135deg, #180500 0%, #290800 100%);
          color: #ffffff;
          padding: 3.5rem 1.5rem 1.8rem;
          border-top: 4px solid var(--kumbh-saffron);
        }
        .kumbh-footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .kumbh-footer__brand {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .kumbh-footer__logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          align-self: flex-start;
        }
        .kumbh-footer__p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          max-width: 360px;
        }
        .kumbh-footer__col h4 {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--kumbh-gold);
          margin-bottom: 1rem;
        }
        .kumbh-footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .kumbh-footer__links a, .kumbh-footer__links button {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.82rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: left;
          font-family: inherit;
          transition: color 0.2s;
        }
        .kumbh-footer__links a:hover, .kumbh-footer__links button:hover {
          color: var(--kumbh-saffron);
        }
        .kumbh-footer__helpline {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255, 179, 0, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .kumbh-footer__helpline-num {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--kumbh-gold);
        }
        .kumbh-footer__bottom {
          max-width: 1200px;
          margin: 1.5rem auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
          color: rgba(255,255,255,0.45);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* ─── RESPONSIVE BREAKPOINTS ─── */
        @media (max-width: 1200px) {
          .kumbh-grid-row {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        @media (max-width: 960px) {
          .kumbh-menu, .kumbh-search-box {
            display: none !important;
          }
          .kumbh-hamburger {
            display: block !important;
          }
          .kumbh-hero__actions-hotspot {
            position: static;
            transform: none;
            justify-content: center;
            padding: 1rem;
            background: #ffffff;
            flex-wrap: wrap;
          }
          .kumbh-hero__action-pill {
            flex: 1 1 45%;
            justify-content: center;
          }
          .kumbh-hero__stats-hotspot, .kumbh-hero__map-controls {
            display: none;
          }
          .kumbh-about__container {
            grid-template-columns: 1fr;
          }
          .kumbh-footer__inner {
            grid-template-columns: 1fr;
          }
          .kumbh-grid-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 640px) {
          .kumbh-grid-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .kumbh-hero__action-pill {
            flex: 1 1 100%;
          }
          .kumbh-dates-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile drawer menu */
        .kumbh-mobile-drawer {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 2px solid var(--kumbh-saffron);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 9998;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .kumbh-mobile-drawer a {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1f2937;
          text-decoration: none;
          padding: 0.5rem 0.5rem;
          border-radius: 8px;
        }
        .kumbh-mobile-drawer a:hover {
          background: #fff7ed;
          color: var(--kumbh-saffron);
        }
      `}</style>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`kumbh-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="kumbh-nav__container">
          {/* Logo with Trishul & Yogi Adityanath Artwork */}
          <Link to="/" className="kumbh-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/assets/kumbh_header_logo.png"
              alt="प्रयागराज कुंभ मेला"
              className="kumbh-brand__img"
              onError={(e) => {
                e.target.style.display = 'none';
                const el = document.getElementById('kumbh-logo-fallback');
                if (el) el.style.display = 'flex';
              }}
            />
            <div id="kumbh-logo-fallback" className="kumbh-brand__fallback" style={{ display: 'none' }}>
              <span className="kumbh-brand__trishul">🔱</span>
              <div className="kumbh-brand__text">
                <span className="kumbh-brand__city">प्रयागराज</span>
                <span className="kumbh-brand__event">कुंभ मेला</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="kumbh-menu">
            <li className="kumbh-menu__item">
              <a
                href="#home"
                className="kumbh-menu__link kumbh-menu__link--active"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <span>🏠</span> होम
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#about" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}>
                कुंभ के बारे में
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#sectors" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#sectors'); }}>
                सेक्टर मानचित्र
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#travel" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#travel'); }}>
                यात्रा जानकारी
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#facilities" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#facilities'); }}>
                सुविधाएँ
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#gallery" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#gallery'); }}>
                गैलरी
              </a>
            </li>
            <li className="kumbh-menu__item">
              <a href="#contact" className="kumbh-menu__link" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}>
                संपर्क
              </a>
            </li>
          </ul>

          {/* Search Bar & Dashboard */}
          <div className="kumbh-nav__right">
            <div className="kumbh-search-box">
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginRight: '0.2rem' }}>🔍</span>
              <input
                type="text"
                placeholder="यहाँ खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') scrollToSection('#sectors');
                }}
              />
              <button
                className="kumbh-search-btn"
                title="खोजें"
                onClick={() => scrollToSection('#sectors')}
              >
                🔍
              </button>
            </div>

            <button
              className="kumbh-admin-btn"
              onClick={handleOpenAllSectors}
              title="लाइव मेप खोलें"
            >
              🗺️ लाइव मेप
            </button>

            <button
              className="kumbh-hamburger"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="kumbh-mobile-drawer">
            <a href="#home" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>🏠 होम</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}>कुंभ के बारे में</a>
            <a href="#sectors" onClick={(e) => { e.preventDefault(); scrollToSection('#sectors'); }}>सेक्टर मानचित्र</a>
            <a href="#travel" onClick={(e) => { e.preventDefault(); scrollToSection('#travel'); }}>यात्रा जानकारी</a>
            <a href="#facilities" onClick={(e) => { e.preventDefault(); scrollToSection('#facilities'); }}>सुविधाएँ</a>
            <a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('#gallery'); }}>फोटो गैलरी</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}>संपर्क व हेल्पलाइन</a>
            <button
              className="kumbh-cta-btn"
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.6rem' }}
              onClick={() => { setMobileMenuOpen(false); handleOpenAllSectors(); }}
            >
              🗺️ मुख्य मेला मेप खोलें
            </button>
          </div>
        )}
      </nav>

      {/* ═══════════════ MAIN HERO BANNER ═══════════════ */}
      <section id="home" className="kumbh-hero" ref={heroRef}>
        <div className="kumbh-hero__wrapper">
          {/* Main Panorama Banner Image from User Reference */}
          <img
            src="/assets/kumbh_hero_banner.jpg"
            alt="प्रयागराज कुंभ मेला मुख्य बैनर"
            className="kumbh-hero__banner-img"
            onError={(e) => { e.target.src = '/maps/kumbh_master_map.jpg'; }}
          />

          {/* Interactive Quick Action Hotspots matching the 4 pills in image */}
          <div className="kumbh-hero__actions-hotspot">
            <button
              className="kumbh-hero__action-pill"
              onClick={() => scrollToSection('#sectors')}
              title="सेक्टर मानचित्र देखें"
            >
              <span className="kumbh-hero__action-icon" style={{ color: '#f26522' }}>📍</span>
              <span className="kumbh-hero__action-text">सेक्टर मानचित्र देखें</span>
              <span className="kumbh-hero__action-arrow">›</span>
            </button>

            <button
              className="kumbh-hero__action-pill"
              onClick={() => scrollToSection('#travel')}
              title="यात्रा जानकारी"
            >
              <span className="kumbh-hero__action-icon" style={{ color: '#0284c7' }}>🧭</span>
              <span className="kumbh-hero__action-text">यात्रा जानकारी</span>
              <span className="kumbh-hero__action-arrow">›</span>
            </button>

            <button
              className="kumbh-hero__action-pill"
              onClick={() => scrollToSection('#facilities')}
              title="सुविधाएँ"
            >
              <span className="kumbh-hero__action-icon" style={{ color: '#16a34a' }}>👥</span>
              <span className="kumbh-hero__action-text">सुविधाएँ</span>
              <span className="kumbh-hero__action-arrow">›</span>
            </button>

            <button
              className="kumbh-hero__action-pill"
              onClick={() => scrollToSection('#gallery')}
              title="फोटो गैलरी"
            >
              <span className="kumbh-hero__action-icon" style={{ color: '#9333ea' }}>🖼️</span>
              <span className="kumbh-hero__action-text">फोटो गैलरी</span>
              <span className="kumbh-hero__action-arrow">›</span>
            </button>
          </div>

          {/* Left Stats Hotspot -> Clicking scrolls to facilities */}
          <div
            className="kumbh-hero__stats-hotspot"
            onClick={() => scrollToSection('#facilities')}
            title="मेला आंकड़े एवं व्यवस्थाएँ देखें"
          />

          {/* Floating Map Controls on Right */}
          <div className="kumbh-hero__map-controls">
            <button
              className="kumbh-map-ctrl-btn"
              title="पूरा मेप खोलें"
              onClick={handleOpenAllSectors}
            >
              🎯
            </button>
            <button
              className="kumbh-map-ctrl-btn"
              title="ज़ूम इन"
              onClick={handleOpenAllSectors}
            >
              +
            </button>
            <button
              className="kumbh-map-ctrl-btn"
              title="ज़ूम आउट"
              onClick={handleOpenAllSectors}
            >
              −
            </button>
            <button
              className="kumbh-map-ctrl-btn"
              title="मेप लेयर्स"
              onClick={handleOpenAllSectors}
            >
              🥞
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTOR MAP SECTION (सेक्टर मानचित्र) ═══════════════ */}
      <section id="sectors" className="kumbh-sectors-section" ref={sectorsRef}>
        {/* Section Header */}
        <div className="kumbh-sectors-header">
          <div className="kumbh-sectors-header__left">
            <img
              src="/assets/mandir_icon.png"
              alt="Mandir"
              className="kumbh-sectors-header__icon"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <h2 className="kumbh-sectors-header__title">सेक्टर मानचित्र</h2>
          </div>

          <button
            className="kumbh-sectors-header__btn"
            onClick={handleOpenAllSectors}
          >
            <span>सभी सेक्टर देखें</span>
            <span style={{ fontSize: '1rem' }}>→</span>
          </button>
        </div>

        {/* Search input for instant sector filtering */}
        <div className="kumbh-sectors-search">
          <input
            type="text"
            placeholder="🔍 सेक्टर खोजें (उदा. Sector 1, Sector 10...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 22 Sector Cards Grid — 2 Rows of 11 */}
        <div className="kumbh-grid-container">
          {/* ROW 1: Sector 1 to Sector 11 */}
          <div className="kumbh-grid-row">
            {row1.map((sector) => (
              <div
                key={sector.num}
                className="kumbh-card"
                style={{ '--card-color': sector.color }}
                onClick={() => handleSectorClick(sector.num)}
                title={`${sector.name} - ${sector.desc}`}
              >
                <div className="kumbh-card__thumb">
                  <img
                    src={`/sectors/thumb_${sector.num}.jpg`}
                    alt={sector.name}
                    className="kumbh-card__img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/maps/kumbh_master_map.jpg';
                    }}
                  />
                </div>
                <div className="kumbh-card__footer" style={{ backgroundColor: sector.color }}>
                  <span className="kumbh-card__name">{sector.name}</span>
                  <div className="kumbh-card__arrow" style={{ color: sector.color }}>
                    ›
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ROW 2: Sector 12 to Sector 22 */}
          {row2.length > 0 && (
            <div className="kumbh-grid-row">
              {row2.map((sector) => (
                <div
                  key={sector.num}
                  className="kumbh-card"
                  style={{ '--card-color': sector.color }}
                  onClick={() => handleSectorClick(sector.num)}
                  title={`${sector.name} - ${sector.desc}`}
                >
                  <div className="kumbh-card__thumb">
                    <img
                      src={`/sectors/thumb_${sector.num}.jpg`}
                      alt={sector.name}
                      className="kumbh-card__img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/maps/kumbh_master_map.jpg';
                      }}
                    />
                  </div>
                  <div className="kumbh-card__footer" style={{ backgroundColor: sector.color }}>
                    <span className="kumbh-card__name">{sector.name}</span>
                    <div className="kumbh-card__arrow" style={{ color: sector.color }}>
                      ›
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredSectors.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              कोई सेक्टर नहीं मिला। कृपया पुनः खोजें।
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ ABOUT SECTION (कुंभ के बारे में) ═══════════════ */}
      <section id="about" className="kumbh-about">
        <div className="kumbh-about__container">
          <div>
            <div className="kumbh-badge">कुंभ के बारे में</div>
            <h2 className="kumbh-about__title">
              विश्व का सबसे बड़ा<br />
              <span>धार्मिक एवं सांस्कृतिक समागम</span>
            </h2>
            <p className="kumbh-about__desc">
              प्रयागराज महाकुंभ में आपका स्वागत है। गंगा, यमुना और अदृश्य सरस्वती के पवित्र
              त्रिवेणी संगम पर आयोजित यह महापर्व सनातन धर्म, आस्था और विश्व बंधुत्व का प्रतीक है।
              हमारा डिजिटल नेविगेशन पोर्टल श्रद्धालुओं को इस विशाल 4,000+ हेक्टेयर मेला क्षेत्र
              में आसानी से सभी सेक्टरों, स्नान घाटों, अखाड़ों और शिविरों तक पहुँचने में मदद करता है।
            </p>

            {/* Shahi Snan Dates */}
            <div className="kumbh-dates-card">
              <div className="kumbh-dates-title">
                <span>🗓️</span> प्रमुख स्नान पर्व तिथियाँ
              </div>
              <div className="kumbh-dates-grid">
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">मकर संक्रांति</span>
                  <span className="kumbh-date-item__date">14 जनवरी</span>
                </div>
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">पौष पूर्णिमा</span>
                  <span className="kumbh-date-item__date">25 जनवरी</span>
                </div>
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">मौनी अमावस्या</span>
                  <span className="kumbh-date-item__date">29 जनवरी</span>
                </div>
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">बसंत पंचमी</span>
                  <span className="kumbh-date-item__date">03 फरवरी</span>
                </div>
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">माघी पूर्णिमा</span>
                  <span className="kumbh-date-item__date">12 फरवरी</span>
                </div>
                <div className="kumbh-date-item">
                  <span className="kumbh-date-item__name">महाशिवरात्रि</span>
                  <span className="kumbh-date-item__date">26 फरवरी</span>
                </div>
              </div>
            </div>

            <button className="kumbh-cta-btn" onClick={handleOpenAllSectors}>
              🗺️ लाइव सेक्टर नेविगेशन शुरू करें
            </button>
          </div>

          {/* Interactive Map Visual */}
          <div className="kumbh-about__map-card" onClick={handleOpenAllSectors}>
            <img
              src="/maps/1791975421893_zdn2nm.png"
              alt="Main Mela Ground Map"
              onError={(e) => { e.target.src = '/maps/kumbh_master_map.jpg'; }}
            />
            <div className="kumbh-about__map-overlay">
              <div className="kumbh-about__map-badge">
                📍 प्रयागराज मेला मास्टर ग्राउंड मेप (क्लिक करें)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FACILITIES SECTION (सुविधाएँ) ═══════════════ */}
      <section id="facilities" className="kumbh-fac">
        <div className="kumbh-fac__head">
          <div className="kumbh-badge">व्यवस्था एवं सेवाएँ</div>
          <h2 className="kumbh-fac__title">मेले में उपलब्ध प्रमुख सुविधाएँ</h2>
          <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
            श्रद्धालुओं और पर्यटकों की सुगमता, सुरक्षा एवं स्वास्थ्य के लिए आधुनिकतम व्यवस्था
          </p>
        </div>

        <div className="kumbh-fac__grid">
          {[
            { icon: '🏥', title: '20+ अस्पताल व स्वास्थ्य केंद्र', desc: 'हर सेक्टर में 24x7 इमरजेंसी ट्रॉमा सेंटर, एम्बुलेंस और निशुल्क दवा वितरण।' },
            { icon: '🌉', title: '20+ पांटून पुल', desc: 'गंगा और यमुना पर श्रद्धालुओं के सुगम आवागमन हेतु आधुनिक पांटून पुल नेटवर्क।' },
            { icon: '👮', title: 'इंटीग्रेटेड सुरक्षा व्यवस्था', desc: 'सीसीटीवी सर्विलांस, एआई कमांड सेंटर, जल पुलिस एवं पैरामिलिट्री सुरक्षा बल।' },
            { icon: '🅿️', title: '2.5 लाख+ पार्किंग क्षमता', desc: 'मेला क्षेत्र के सभी प्रवेश द्वारों पर सैटेलाइट पार्किंग और ई-रिक्शा कनेक्टिविटी।' },
            { icon: '🍲', title: 'अन्नक्षेत्र एवं भोजनालय', desc: 'सभी सेक्टरों में स्वच्छ एवं शुद्ध प्रसाद, निःशुल्क भंडारे एवं फ़ूड कोर्ट्स।' },
            { icon: '🚰', title: 'स्वच्छ पेयजल व स्वच्छता', desc: 'लाखों आरओ वाटर एटीएम, स्वच्छ बायो-टॉयलेट्स एवं सतत सफाई कर्मी।' },
            { icon: '🔍', title: 'खोया-पाया केंद्र', desc: 'डिजिटल स्क्रीन, लाउडस्पीकर एवं कंप्यूटर सहायता से तत्काल परिवार मिलाप सेवा।' },
            { icon: '🚌', title: 'निःशुल्क शटल बस सेवा', desc: 'रेलवे स्टेशनों और बस अड्डों से मेला क्षेत्र तक लगातार चलने वाली ई-बसें।' },
          ].map((item, idx) => (
            <div key={idx} className="kumbh-fac-card">
              <span className="kumbh-fac-card__icon">{item.icon}</span>
              <h3 className="kumbh-fac-card__title">{item.title}</h3>
              <p className="kumbh-fac-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TRAVEL INFO SECTION (यात्रा जानकारी) ═══════════════ */}
      <section id="travel" className="kumbh-travel">
        <div className="kumbh-travel__container">
          <div style={{ textAlign: 'center' }}>
            <div className="kumbh-badge">यात्रा गाइड</div>
            <h2 className="kumbh-fac__title">प्रयागराज कैसे पहुँचें</h2>
            <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
              देश के सभी कोनों से प्रयागराज के लिए विशेष विमान, ट्रेन और सड़क परिवहन की व्यवस्था
            </p>
          </div>

          <div className="kumbh-travel__grid">
            <div className="kumbh-travel-card">
              <div className="kumbh-travel-card__icon">✈️</div>
              <h3 className="kumbh-travel-card__title">हवाई मार्ग (Air Travel)</h3>
              <p className="kumbh-travel-card__desc">
                प्रयागराज एयरपोर्ट (IXD) दिल्ली, मुंबई, बेंगलुरु आदि से सीधे जुड़ा है। वाराणसी एवं लखनऊ एयरपोर्ट से भी सीधी कैब और ट्रेनें उपलब्ध हैं।
              </p>
            </div>
            <div className="kumbh-travel-card">
              <div className="kumbh-travel-card__icon">🚆</div>
              <h3 className="kumbh-travel-card__title">रेल मार्ग (Railways)</h3>
              <p className="kumbh-travel-card__desc">
                प्रयागराज जंक्शन (PRYJ), नैनी, सूबेदारगंज, प्रयाग और फाफामऊ स्टेशनों पर 1,000+ कुंभ स्पेशल ट्रेनें एवं विशेष यात्री आश्रय गृह तैयार हैं।
              </p>
            </div>
            <div className="kumbh-travel-card">
              <div className="kumbh-travel-card__icon">🚌</div>
              <h3 className="kumbh-travel-card__title">सड़क मार्ग (Roadways)</h3>
              <p className="kumbh-travel-card__desc">
                राष्ट्रीय राजमार्ग NH-19, NH-27 और पूर्वांचल लिंक एक्सप्रेसवे से प्रयागराज सीधे जुड़ा है। 7,000+ रोडवेज बसें निरंतर संचालित हैं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ GALLERY SECTION (फोटो गैलरी) ═══════════════ */}
      <section id="gallery" className="kumbh-gallery">
        <div className="kumbh-badge">दिव्य दर्शन</div>
        <h2 className="kumbh-fac__title">महाकुंभ दृश्य व पावन क्षण</h2>
        <div className="kumbh-gallery__grid">
          {[
            { img: '/sectors/thumb_1.jpg', label: 'संगम स्नान' },
            { img: '/sectors/thumb_2.jpg', label: 'भव्य पांटून पुल' },
            { img: '/sectors/thumb_3.jpg', label: 'अखाड़ा शोभायात्रा' },
            { img: '/sectors/thumb_4.jpg', label: 'शाम की महाआरती' },
            { img: '/sectors/thumb_5.jpg', label: 'टेंट सिटी विहंगम दृश्य' },
            { img: '/sectors/thumb_6.jpg', label: 'श्रद्धालु समागम' },
            { img: '/sectors/thumb_7.jpg', label: 'दीपदान संगम' },
            { img: '/sectors/thumb_8.jpg', label: 'अक्षयवट एवं किला' },
          ].map((item, idx) => (
            <div key={idx} className="kumbh-gallery__item">
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                onError={(e) => { e.target.src = '/maps/kumbh_master_map.jpg'; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer id="contact" className="kumbh-footer">
        <div className="kumbh-footer__inner">
          <div className="kumbh-footer__brand">
            <img
              src="/assets/kumbh_header_logo.png"
              alt="Upmela Kumbh"
              className="kumbh-footer__logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <p className="kumbh-footer__p">
              प्रयागराज महाकुंभ का आधिकारिक डिजिटल नेविगेशन एवं सेक्टर मैपिंग पोर्टल।
              श्रद्धालुओं की सुखद, सुलभ एवं सुरक्षित यात्रा के लिए समर्पित।
            </p>
          </div>

          <div className="kumbh-footer__col">
            <h4>त्वरित लिंक्स</h4>
            <ul className="kumbh-footer__links">
              <li><button onClick={() => scrollToSection('#sectors')}>सेक्टर मानचित्र (22 सेक्टर)</button></li>
              <li><button onClick={() => scrollToSection('#about')}>कुंभ के बारे में एवं स्नान तिथियाँ</button></li>
              <li><button onClick={() => scrollToSection('#facilities')}>अस्पताल व जन सुविधाएँ</button></li>
              <li><button onClick={() => scrollToSection('#travel')}>यातायात एवं पार्किंग</button></li>
              <li><button onClick={handleOpenAllSectors}>लाइव मेप नेविगेशन</button></li>
              <li><button onClick={() => navigate('/login')}>प्रशासनिक लॉगिन (Admin)</button></li>
            </ul>
          </div>

          <div className="kumbh-footer__col">
            <h4>आपातकालीन सहायता व संपर्क</h4>
            <div className="kumbh-footer__helpline">
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>मेला टोल-फ्री हेल्पलाइन (24x7):</span>
              <span className="kumbh-footer__helpline-num">1920 / 112</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                पुलिस कंट्रोल रूम: 0532-2500112<br />
                चिकित्सा सहायता: 108 / 102
              </span>
            </div>
          </div>
        </div>

        <div className="kumbh-footer__bottom">
          <span>© {new Date().getFullYear()} प्रयागराज मेला प्राधिकरण एवं Upmela Navigation. सर्वाधिकार सुरक्षित।</span>
          <span>आस्था • संस्कृति • समागम | ॥ संगम की धरती, आस्था का महापर्व ॥</span>
        </div>
      </footer>
    </div>
  );
}
