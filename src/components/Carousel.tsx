import React, { useState, useEffect } from 'react';
import './Carousel.css';

interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 轮播图片数据 - 海马体照相馆主题
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
      title: '专业写真摄影',
      subtitle: '记录最美的你'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=400&fit=crop',
      title: '情侣写真套餐',
      subtitle: '爱情的美好瞬间'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
      title: '家庭亲子摄影',
      subtitle: '温馨家庭时光'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=400&fit=crop',
      title: '商务形象照',
      subtitle: '专业形象展示'
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
