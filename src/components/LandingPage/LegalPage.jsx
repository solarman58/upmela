import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './LandingPage.css';

export default function LegalPage({ page }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const content = {
    privacy: {
      title: 'Privacy Policy',
      date: 'Effective Date: September 2026',
      body: (
        <>
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, and other information you choose to provide.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We may use the information we collect from you to:</p>
          <ul>
            <li>Provide, maintain, and improve our services, including to facilitate indoor navigation and routing.</li>
            <li>Perform internal operations necessary to provide our services, including troubleshooting software bugs and operational problems.</li>
            <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events of Margyaan.</li>
          </ul>

          <h3>3. Data Security</h3>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Our database connections are secured via robust TLS protocols and we do not store plaintext passwords.</p>
        </>
      )
    },
    terms: {
      title: 'Terms of Service',
      date: 'Effective Date: September 2026',
      body: (
        <>
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using the Margyaan platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Margyaan's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          
          <h3>3. Limitations</h3>
          <p>In no event shall Margyaan or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Margyaan's website.</p>
        </>
      )
    },
    support: {
      title: 'Support & Contact',
      date: 'We are here to help 24/7.',
      body: (
        <div className="flex flex-col gap-6 mt-4">
          <p className="text-slate-600 dark:text-slate-400">Need help with your indoor navigation deployment? Reach out to our technical support team.</p>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600"><FiMail size={20}/></div>
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white m-0">Email Support</h4>
               <a href="mailto:margyaansupport@gmail.com" className="text-blue-500 hover:underline font-medium">margyaansupport@gmail.com</a>
             </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600"><FiPhone size={20}/></div>
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white m-0">Sales & Enterprise</h4>
               <a href="tel:+919716821624" className="text-emerald-500 hover:underline font-medium">+91 97168 21624</a>
             </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600"><FiMapPin size={20}/></div>
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white m-0">Headquarters</h4>
               <p className="text-slate-500 text-sm m-0">Cyber City, Gurugram, Haryana, India</p>
             </div>
          </div>
        </div>
      )
    }
  };

  const currentContent = content[page] || content.privacy;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-24 pt-32">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-[0_10px_50px_rgba(15,23,42,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          {currentContent.title}
        </h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
          {currentContent.date}
        </p>
        
        <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400">
          {currentContent.body}
        </div>
      </div>
    </div>
  );
}
