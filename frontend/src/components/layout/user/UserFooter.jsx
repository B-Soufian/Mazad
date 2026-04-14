import React from 'react';
// import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const brandRed = "#D71939";

  const footerLinks = {
    auctions: [
      "Automobiles",
      "Properties",
      "General Surplus",
      "Jewellery & Watches"
    ],
    company: [
      "About EA",
      "Careers",
      "Auction Calendar",
      "News & Media",
      "Success Stories"
    ],
    support: [
      "Help Center",
      "How it Works",
      "Contact Us",
      "Privacy Policy",
      "Terms & Conditions"
    ]
  };

  return (
    <footer className="bg-white pt-20 pb-12 px-6 md:px-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Logo and Description Section */}
          <div className="md:col-span-4">
            <div className="flex items-baseline mb-8">
              <span className="text-2xl font-black tracking-tighter text-black uppercase mr-1">
                Morocco
              </span>
              <div className="relative inline-block">
                <span className="text-2xl font-black tracking-tighter uppercase" style={{ color: brandRed }}>
                  Auction
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-[2px]" style={{ backgroundColor: brandRed }}></div>
              </div>
            </div>
            
            <p className="text-gray-600 text-[14px] leading-relaxed max-w-[280px] mb-8">
              The largest auction company in the Middle East. Specialized in automobiles, machinery, and equipment.
            </p>

            {/* <div className="flex gap-6 items-center">
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-black rounded-full">
                  <Facebook size={14} fill="currentColor" />
                </div>
              </a>
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <Instagram size={24} strokeWidth={2} />
              </a>
            </div> */}
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-black mb-8 text-[16px]">Auctions</h4>
            <ul className="space-y-4">
              {footerLinks.auctions.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-700 text-[14px] hover:text-black transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-black mb-8 text-[16px]">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-700 text-[14px] hover:text-black transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-black mb-8 text-[16px]">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-700 text-[14px] hover:text-black transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-24 pt-8">
          <p className="text-gray-500 text-[12px]">
            © 2023 Soufian Auction. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;