import React from 'react';
import HeroSection from './components/HeroSection';
import SuccessSection from './components/SuccessSection';
import FeaturedSection from './components/FeaturedSection';
import SellSection from './components/SellSection';
import StepsSection from './components/StepsSection';
import QuestionsSection from './components/QuestionsSection';

const Home = () => {
  return (
    <div className="font-sans text-gray-900 w-full overflow-x-hidden">
      <HeroSection/>
      <SuccessSection/>
      <FeaturedSection/>
      <SellSection/>
      <StepsSection/>
      <QuestionsSection/>
    </div>
  );
};
export default Home;