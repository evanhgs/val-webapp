import {useEffect, useRef, useState} from 'react';
import kiosque from '../../../public/le-kiosque-a-musique-sur-le-champ-de-mars.jpg'
import ruelles from '../../../public/les-ruelles-de-valence.jpg'
import musee from '../../../public/musee-valence.jpg'
import valence from '../../../public/valence.jpg'
import maison from '../../../public/visiter-valence-et-la-maison.jpg'
import parc from '../../../public/visiter-valence-et-le-parc-jouvet.jpg'
import phone from "../../../public/iphone-removebg.png"

const PhoneCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const images = [
    kiosque,
    ruelles,
    musee,
    valence,
    maison,
    parc,
  ]

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000); // change l'intervale en ms

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImage((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.clientX);
  };
  const handleMouseUp = () => {
    if (!touchStart || !touchStart) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleMouseLeave = () => {
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative hidden md:block">
      {/* Phone frame */}
      <img
        src={phone}  // 436x572 picture ration
        alt="Phone Mockup"
        className="max-w-xs relative z-10"
        draggable="false"
      />

      {/* Screen content */}
      <div
        className="absolute top-[40px] left-1/2 transform -translate-x-1/2 w-[220px] h-[420px] overflow-hidden rounded-[24px] z-0 bg-black"
        style={{
          top: '40px',
          width: '190px',
          height: '360px',
        }}>
        {/* Carousel container qui occupe tout l'espace disponible */}
        {/* Slide container avec flex et width: 100% pour chaque image */}
        <div
          className="relative w-full h-full overflow-hidden"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${(currentImage * 100) / images.length}%)`
            }}>
            {images.map((image, index) => (
              <div
                key={index}
                className="relative"
                style={{ width: `${100 / images.length}%`, height: '100%' }}>
                <img
                  src={image}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center',
                  }}
                  draggable="false"
                />
              </div>
            ))}
          </div>


          {/* Indicator dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentImage === index ? 'bg-white scale-125' : 'bg-gray-400'}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>

          {/* Overlay with app title */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <h2 className="text-white font-bold text-xl drop-shadow-lg">Valenstagram</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCarousel;