import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Activity } from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';
import { SERVICE_CATEGORIES } from '@/constants/services';

const socialLinks = [
  { name: 'Facebook', href: APP_CONFIG.social.facebook, icon: Facebook },
  { name: 'Instagram', href: APP_CONFIG.social.instagram, icon: Instagram },
  { name: 'Twitter', href: APP_CONFIG.social.twitter, icon: Twitter },
  { name: 'LinkedIn', href: APP_CONFIG.social.linkedin, icon: Linkedin },
  { name: 'YouTube', href: APP_CONFIG.social.youtube, icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Image
                src="/h2hwebsitelogo.png"
                alt="H2H Healthcare"
                width={140}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              {APP_CONFIG.tagline}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[14px] font-medium text-white mb-5">Services</h3>
            <ul className="space-y-3">
              {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                <li key={key}>
                  <Link
                    href={`/services/${key}`}
                    className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[14px] font-medium text-white mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[13px] text-gray-400 hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[14px] font-medium text-white mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-0.5">Toll Free</p>
                  <a href={`tel:${APP_CONFIG.phone}`} className="text-[13px] text-gray-300 hover:text-cyan-400 transition-colors">
                    {APP_CONFIG.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-0.5">Email</p>
                  <a href={`mailto:${APP_CONFIG.email}`} className="text-[13px] text-gray-300 hover:text-cyan-400 transition-colors">
                    {APP_CONFIG.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-0.5">Locations</p>
                  <Link href="/locations" className="text-[13px] text-gray-300 hover:text-cyan-400 transition-colors">
                    8+ Cities Across India
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-500">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-500">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
