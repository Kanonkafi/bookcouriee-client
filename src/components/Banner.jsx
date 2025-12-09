
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'

import { Link } from 'react-router-dom'
import AOS from 'aos'
import { useEffect } from 'react'
import { FaBookOpen } from 'react-icons/fa'

const slides = [
  {
    id: 1,
    title: 'লাইব্রেরি থেকে বই — তোমার ঘরে',
    subtitle: 'BookCourier: লাইব্রেরি টু হোম ডেলিভারি — স্টুডেন্ট ও রিসার্চারের জন্য স্মার্ট সার্ভিস।',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 2,
    title: 'ওয়ান-ক্লিক অর্ডার, টাইমলি ডেলিভারি',
    subtitle: 'ওর্ডার করো, আমরা পিক-আপ ও ডেলিভারি করে দেব। সহজ আর নিরাপদ।',
    img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 3,
    title: 'রিসার্চ বই বা রেয়ার টাইটেল? উইশলিস্ট করো',
    subtitle: 'উইশলিস্ট করে রাখো, আমরা খুঁজে এনে দেই — রেয়ার কভারেজ।',
    img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1350&q=80',
  },
]

const Banner = () => {
  // AOS init (animation on scroll) — one-time
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic' })
  }, [])

  return (
    <section className="relative">
      {/* Swiper (full-width but centered content) */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        effect={'fade'}
        className="h-[64vh] md:h-[72vh] lg:h-[76vh]"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            {/* slide background image with dark overlay for readable text */}
            <div
              className="w-full h-full bg-center bg-cover relative"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(3,7,18,0.30), rgba(3,7,18,0.45)), url(${s.img})`,
              }}
            >
              {/* content wrapper: center & constrained width for recruiter-friendly layout */}
              <div className="w-11/12 max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center justify-center md:justify-between">
                {/* Left: text */}
                <div className="text-white max-w-xl py-12 md:py-24" data-aos="fade-up" data-aos-delay="200">
                  {/* Gradient headline: bg-clip-text + text-transparent */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                    {/* main title normal part */}
                    <span className="block">
                      {/* first line ordinary */}
                      <span className="block text-white">{s.title.split(' — ')[0]}</span>
                    </span>

                    {/* gradient highlighted word or phrase */}
                    <span className="block mt-2">
                      {/* using bg-clip-text trick for gradient text */}
                      <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {s.title.split(' — ')[1] ?? 'BookCourier'}
                      </span>
                    </span>
                  </h1>

                  {/* subtitle */}
                  <p className="mt-4 text-gray-200 text-sm md:text-lg">{s.subtitle}</p>

                  {/* CTA buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/books"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        text-white font-semibold shadow-lg hover:scale-[1.02] transition"
                    >
                      <FaBookOpen />
                      All Books
                    </Link>

                    <Link
                      to="/books"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full
                        bg-white/10 border border-white/20 text-white font-medium hover:opacity-90 transition"
                    >
                      Explore
                    </Link>
                  </div>
                </div>

                {/* Right: hero image / card (hidden on small screens) */}
                <div
                  className="hidden md:block w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* decorative gradient bar under slider */}
      <div className="absolute left-0 right-0 bottom-6 flex justify-center pointer-events-none">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-40 rounded-full opacity-60"></div>
      </div>
    </section>
  )
}

export default Banner
