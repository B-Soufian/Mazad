import React from 'react';
import HeroSection from './components/HeroSection';
import SuccessSection from './components/SuccessSection';
import StandardSection from './components/StandardSection';
import DoSection from './components/DoSection';
import TickerSection from './components/TickerSection';
import JoinSection from './components/JoinSection';
import AboutSection from './components/AboutSection';
import SellSection from '../Home/components/SellSection';

const About = () => {

  return (
    <>
        <HeroSection/>
        <AboutSection/>
        <SuccessSection/>
        <StandardSection/>
        <SellSection/>
        <DoSection/>
        <TickerSection/>
        <JoinSection/>
    </>
  );
};

export default About;