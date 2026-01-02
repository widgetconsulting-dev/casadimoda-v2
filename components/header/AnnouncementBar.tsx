"use client";

import { useState } from "react";
import { X, Gift, Truck, Percent } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  // Array of announcements
  const announcements = [
    {
      icon: <Percent size={16} className="text-accent" />,
      text: "New Year Sale: Up to 50% OFF on Selected Items",
      link: "/products?sort=featured",
    },
    {
      icon: <Truck size={16} className="text-accent" />,
      text: "Free Express Shipping on Orders Over $500",
      link: "/products",
    },
    {
      icon: <Gift size={16} className="text-accent" />,
      text: "VIP Members Get Exclusive Access to New Collections",
      link: "/vip-store",
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="bg-white text-primary py-1 px-4 relative overflow-hidden border-b border-gray-100">
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scroll-container {
          animation: scroll-left 15s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex items-center justify-between gap-4">
        {/* Breaking News Label */}
        <div className="flex-shrink-0 bg-accent text-white px-3 py-1 rounded-md">
          <span className="text-xs font-black uppercase tracking-wider">
            Offers
          </span>
        </div>

        {/* Scrolling Announcement Container */}
        <div className="flex-grow overflow-hidden relative">
          <div className="scroll-container flex items-center whitespace-nowrap">
            {/* First set of announcements */}
            {announcements.map((announcement, index) => (
              <a
                key={`first-${index}`}
                href={announcement.link}
                className="inline-flex items-center gap-2 mx-12 hover:text-accent transition-colors cursor-pointer"
              >
                {announcement.icon}
                <span className="text-sm font-bold">{announcement.text}</span>
                <span className="text-accent font-black text-lg ml-2">•</span>
              </a>
            ))}
            {/* Duplicate set for seamless loop */}
            {announcements.map((announcement, index) => (
              <a
                key={`second-${index}`}
                href={announcement.link}
                className="inline-flex items-center gap-2 mx-12 hover:text-accent transition-colors cursor-pointer"
              >
                {announcement.icon}
                <span className="text-sm font-bold">{announcement.text}</span>
                <span className="text-accent font-black text-lg ml-2">•</span>
              </a>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close announcement"
        >
          <X size={14} className="text-text-dark/50 hover:text-primary" />
        </button>
      </div>
    </div>
  );
}
