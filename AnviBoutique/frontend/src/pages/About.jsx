import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Heart, Leaf, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white font-sans text-gray-900">
      {/* HERO SECTION */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            About Anvi Studio
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto italic font-light">
            "Weaving elegance, heritage, and modern grace into every thread."
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-[#ff7c04]">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  At Anvi Studio, we believe that a Saree is not just six yards of fabric; it's a legacy, a celebration, and a piece of art. 
                  Our journey began with a simple vision: to bridge the gap between traditional Indian craftsmanship and the contemporary woman's lifestyle.
                </p>
                <p>
                  Every piece in our collection is hand-curated with a focus on authenticity. We work closely with master weavers across the country 
                  to ensure that the heritage of Indian textiles is preserved while offering designs that are comfortable, stylish, and timeless.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center text-gray-400">
              {/* Replace with an actual image in your production code */}
              <span className="text-sm uppercase tracking-widest">Brand Image Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl font-serif font-bold">Our Core Values</h2>
          <div className="w-16 h-1 bg-[#ff7c04] mx-auto mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-100">
              <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="text-[#ff7c04]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Authentic Craftsmanship</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We celebrate the human touch. Every weave and every motif tells a story of a weaver's dedication and skill passed down through generations.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-100">
              <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Gem className="text-[#ff7c04]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Uncompromising Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Only premium, handpicked fabrics and enduring designs make it into our collections, ensuring longevity and luxury in every drape.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-100">
              <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Leaf className="text-[#ff7c04]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Fashion</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We strive to minimize waste and support ethical production cycles, choosing slow fashion over mass production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Users className="text-[#ff7c04]" size={32} />
          </div>
          <h3 className="text-3xl font-serif font-bold mb-4">Meet the Founders</h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Founded by <span className="font-bold">Pratyusha & Vijaya</span>, Anvi Studio started as a passion project to bring accessible, 
            high-quality traditional attire to the modern woman who values her roots.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;