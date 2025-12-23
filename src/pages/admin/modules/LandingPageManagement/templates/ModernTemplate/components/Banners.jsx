import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider({ media = [], type = "image" }) {
  const swiperRef = useRef(null);

  if (!media.length) return null;

  return (
    <section className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={0}
            loop={media.length > 1}
            autoplay={type === "video" ? false : { delay: 5000 }}
            pagination={{ clickable: true }}
            className="h-full w-full"
            onSwiper={(s) => (swiperRef.current = s)}
          >
            {media.map((url, i) => (
              <SwiperSlide key={i} className="h-full w-full">
                {type === "video" ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`banner-${i}`}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {media.length > 1 && (
            <>
              <button
                onClick={() => swiperRef.current.slidePrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 w-12 h-12 rounded-full"
              >
                ←
              </button>
              <button
                onClick={() => swiperRef.current.slideNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 w-12 h-12 rounded-full"
              >
                →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
