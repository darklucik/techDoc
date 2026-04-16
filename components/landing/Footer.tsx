'use client';
import { Wrench, Phone, Mail, MapPin, Clock } from 'lucide-react';
import RequestForm from './RequestForm';
import AnimateOnScroll from './AnimateOnScroll';
import { useLang } from '@/components/LanguageContext';
import { getContent } from '@/lib/db';

// Footer reads contacts from content.json via prop
interface Contacts { phone: string; email: string; address: string; hours: string; }

export default function Footer({ contacts }: { contacts: Contacts }) {
  const { T } = useLang();
  const fo = T.footer;

  return (
    <footer id="contact" className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimateOnScroll direction="right" className="space-y-8">
              <div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
                  {fo.contactBadge}
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  {fo.title} <span className="gradient-text">{fo.accent}</span>
                </h2>
                <p className="text-slate-400 leading-relaxed">{fo.description}</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Phone,  label: fo.phoneLabel,   val: contacts.phone,   href: `tel:${contacts.phone}`, color: 'blue',   cls: 'bg-blue-600/15 border-blue-600/30 text-blue-400' },
                  { icon: Mail,   label: fo.emailLabel,   val: contacts.email,   href: `mailto:${contacts.email}`, color: 'orange', cls: 'bg-orange-500/15 border-orange-500/30 text-orange-400' },
                  { icon: MapPin, label: fo.addressLabel, val: contacts.address, href: undefined, color: 'green',  cls: 'bg-green-500/15 border-green-500/30 text-green-400' },
                  { icon: Clock,  label: fo.hoursLabel,   val: contacts.hours,   href: undefined, color: 'purple', cls: 'bg-purple-500/15 border-purple-500/30 text-purple-400' },
                ].map(({ icon: Icon, label, val, href, cls }) => (
                  <div key={label} className="flex items-center gap-4 glass rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${cls}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                      {href
                        ? <a href={href} className="text-white font-medium hover:text-blue-300 transition-colors">{val}</a>
                        : <span className="text-white font-medium">{val}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" className="flex justify-center lg:justify-end">
              <RequestForm />
            </AnimateOnScroll>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Wrench size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">Tech<span className="text-blue-400">Doc</span></span>
          </div>
          <p className="text-sm text-slate-600">{fo.copyright}</p>
          <div />
        </div>
      </div>
    </footer>
  );
}
