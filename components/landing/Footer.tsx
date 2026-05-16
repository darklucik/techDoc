'use client';
import { Wrench, Phone, Mail, MapPin, Clock } from 'lucide-react';
import RequestForm from './RequestForm';
import AnimateOnScroll from './AnimateOnScroll';
import { useLang } from '@/components/LanguageContext';

interface Contacts { phone: string; email: string; address: string; hours: string; }

export default function Footer({ contacts }: { contacts: Contacts }) {
  const { T } = useLang();
  const fo = T.footer;

  const contactItems = [
    {
      icon: Phone,  label: fo.phoneLabel,   val: contacts.phone,
      href: `tel:${contacts.phone}`,
      bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.3)', color: 'var(--teal)',
    },
    {
      icon: Mail,   label: fo.emailLabel,   val: contacts.email,
      href: `mailto:${contacts.email}`,
      bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.3)', color: 'var(--amber)',
    },
    {
      icon: MapPin, label: fo.addressLabel, val: contacts.address,
      href: undefined,
      bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.3)', color: '#22C55E',
    },
    {
      icon: Clock,  label: fo.hoursLabel,   val: contacts.hours,
      href: undefined,
      bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', color: '#A855F7',
    },
  ];

  return (
    <footer id="contact" className="relative pt-24 pb-12 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--border), transparent)' }}
      />
      {/* Ambient blob */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--teal-glow)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Contact info */}
            <AnimateOnScroll direction="right" className="space-y-8">
              <div>
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border mb-4"
                  style={{ background: 'var(--amber-glow)', borderColor: 'rgba(217,119,6,0.25)', color: 'var(--amber)' }}
                >
                  {fo.contactBadge}
                </div>
                <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                  {fo.title} <span className="gradient-text">{fo.accent}</span>
                </h2>
                <p className="text-[var(--text-muted)] leading-relaxed">{fo.description}</p>
              </div>

              <div className="space-y-3">
                {contactItems.map(({ icon: Icon, label, val, href, bg, border, color }) => (
                  <div key={label} className="glass rounded-xl p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: bg, border: `1px solid ${border}`, color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: 'var(--text-dim)' }}>{label}</div>
                      {href
                        ? <a href={href} className="font-medium hover:text-[var(--teal)] transition-colors text-[var(--text-primary)]">{val}</a>
                        : <span className="font-medium text-[var(--text-primary)]">{val}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Request form */}
            <AnimateOnScroll direction="left" className="flex justify-center lg:justify-end">
              <RequestForm />
            </AnimateOnScroll>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--teal)' }}
            >
              <Wrench size={14} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)]">
              Repair<span style={{ color: 'var(--teal)' }}>Master</span>
            </span>
          </div>
          <p className="text-sm text-[var(--text-dim)]">{fo.copyright}</p>
          <div />
        </div>
      </div>
    </footer>
  );
}
