import React from 'react';
import HeroSection from './components/HeroSection';
import FormSection from './components/FormSection';

const Contact = () => {
  return (
    <>
      <style>
        {`
          .font-serif {
            font-family: 'Playfair Display', serif;
          }
          .font-sans {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <main className="min-h-screen bg-[#fafafa] font-sans text-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-2">
            <HeroSection/>
            <FormSection/>

        </div>
      </main>
    </>
  );
};

export default Contact;