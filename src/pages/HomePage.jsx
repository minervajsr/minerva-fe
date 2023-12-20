import React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import RecommendedSection from "../components/LandingPage/RecommendedSection";
import AboutSection from "../components/LandingPage/AboutSection";
import TestimonialSection from "../components/LandingPage/TestimonialSection";
import OurCEOSection from "../components/LandingPage/OurCEOSection";
import FooterSection from "../components/LandingPage/FooterSection";
import LandingNavbar from "../components/LandingPage/LandingNavbar";
import ExploreSection from "../components/LandingPage/ExploreSection";

const HomePage = () => {
  return (
    <div>
      <LandingNavbar />
      <HeroSection />
      <ExploreSection />
      <AboutSection order={true} background={"#F7F7FB"} />
      <RecommendedSection />
      <OurCEOSection />
      <TestimonialSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
