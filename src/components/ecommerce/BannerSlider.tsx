import { useEffect, useState } from "react";

const BannerSlider: React.FC = () => {
  const images: string[] = [
    "/Booking/Dreamasia-Banner.jpg",
    "/Booking/dreamasia-image.jpg",
    "/Booking/big-banner-2.png",
    "/Booking/facilities.jpg",
    "/Booking/boat.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full md:h-[300px] overflow-hidden rounded-xl">
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className="w-full md:h-[300px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
