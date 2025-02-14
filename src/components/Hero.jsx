import React from "react";
import { assets } from "../assets/assets.js";

const Hero = () => {
  return (
    <div>
      <div className="hero bg-base-100 min-h-full rounded-lg border border-gray-400">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={assets.hero_img} className="sm:w-1/2 w-full rounded-lg shadow-2xl" />
          <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
            <div className="text-[#414141]">
              <div className="flex items-center gap-2">
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                <p className="font-medium font-sans text-sm md:text-base ">
                  OUR BESTSELLERS
                </p>
              </div>
              <h1 className="font-serif text-3xl sm:py-3 lg:text-5xl leading-relaxed ">
                Latest Arrivals
              </h1>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm md:text-base ">SHOP NOW</p>
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
