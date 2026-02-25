import React from 'react';
import { Button } from 'antd';

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text1">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

function TourCard({ badgeText, badgeColor, imageSrc }) {
  return (
    <div className="border rounded-2xl p-[18px] bg-background mb-6 flex flex-col xl:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow font-sans">

      {/* Left: Image Box */}
      <div className="relative w-full xl:w-[280px] shrink-0 h-[220px] rounded-xl overflow-hidden">
        <img
          src={imageSrc || "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800"}
          alt="Tour"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {badgeText && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-text2 text-[12px] font-bold ${badgeColor || 'bg-primary'}`}>
            {badgeText}
          </div>
        )}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background flex items-center justify-center cursor-pointer hover:bg-background transition-colors shadow-sm">
          <HeartIcon />
        </div>
      </div>

      {/* Middle: Info */}
      <div className="flex-1 flex flex-col py-1">
        <div className="text-text1 text-[13px] mb-1.5 font-medium">Paris, France</div>
        <h3 className="text-text1 font-bold text-[18px] leading-tight mb-2 hover:text-primary cursor-pointer transition-colors line-clamp-2">
          Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-text1 font-bold text-[14px]">4.8</span>
          <span className="text-text1 text-[14px]">(269)</span>
        </div>

        <p className="text-text1/70 text-[14px] mb-4 line-clamp-2 leading-relaxed max-w-[90%]">
          The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.
        </p>

        <div className="mt-auto flex gap-6 text-primary text-[13px] font-medium">
          <span>Best Price Guarantee</span>
          <span>Free Cancellation</span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden xl:block w-px bg-background my-2"></div>
      <div className="block xl:hidden h-px bg-background"></div>

      {/* Right: Pricing & CTA */}
      <div className="xl:w-[160px] shrink-0 flex flex-col justify-between py-1 text-center xl:text-right">
        <div className="text-text1 font-medium text-[14px] mb-4 xl:mb-0">
          2 Days 1 Nights
        </div>

        <div className="flex flex-col items-center xl:items-end mb-4 xl:mb-0">
          <div className="text-text1 line-through text-[14px] mb-0.5">$1200</div>
          <div className="text-text1 text-[13px] uppercase">
            From <span className="font-bold text-[22px] normal-case tracking-tight ml-1">$114</span>
          </div>
        </div>

        <Button
          type="default"
          className="w-full h-11 border-primary text-primary hover:!bg-primary hover:!text-text2 hover:!border-primary rounded-lg font-semibold text-[14px] transition-colors"
        >
          View Details
        </Button>
      </div>

    </div>
  );
}

export default TourCard;
