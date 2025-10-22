import React, { useState, useEffect } from 'react';
import './Carousel.css';

interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 轮播图片数据 - 使用本地竖版图片
  const slides = [
    {
      id: 1,
      image: '/img/img_v3_02r9_0e360b2b-0e13-43ae-87f9-6958c1de5c9g.jpg',
      title: '',
      subtitle: ''
    },
    {
      id: 2,
      image: '/img/img_v3_02r9_1fd88f52-4867-4695-a76f-1dc1b60fe1fg.jpg',
      title: '',
      subtitle: ''
    },
    {
      id: 3,
      image: '/img/img_v3_02r9_a5e8c4f0-dae9-4cf9-913f-1dcca5d3b75g.jpg',
      title: '',
      subtitle: ''
    },
    {
      id: 4,
      image: '/img/img_v3_02r9_e3728f96-8b69-4123-bf2f-eb468acc3abg.jpg',
      title: '',
      subtitle: ''
    }
  ];

  // 自动播放
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="carousel">
      <div className="carousel-container">
        <div 
          className="carousel-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="carousel-slide">
              <div 
                className="slide-background"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h3 className="slide-title">{slide.title}</h3>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        <button className="carousel-button prev" onClick={goToPrevious}>
          &#8249;
        </button>
        <button className="carousel-button next" onClick={goToNext}>
          &#8250;
        </button>

        {/* 指示器 */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
