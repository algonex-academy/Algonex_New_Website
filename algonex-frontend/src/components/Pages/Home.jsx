import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const carouselImages = [
  'https://ik.imagekit.io/ipo22webapp/1bcdac68561d678bbfc4e872b8b69a1972698c51.png?updatedAt=1759554862009',
  'https://ik.imagekit.io/ipo22webapp/1bcdac68561d678bbfc4e872b8b69a1972698c51.png?updatedAt=1759554862009',
  'https://ik.imagekit.io/ipo22webapp/1bcdac68561d678bbfc4e872b8b69a1972698c51.png?updatedAt=1759554862009'
];

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#CCF6FF]">
      <div className="container mx-auto mt-4">
        <Slider {...settings}>
          {carouselImages.map((url, index) => (
            <div key={index}>
              <div
                className="flex flex-col justify-end bg-cover bg-center h-[65vh] px-4 py-20 rounded-2xl"
                style={{ backgroundImage: `url(${url})` }}
              >
                <h1 className="text-4xl font-bold text-white mb-4 ml-6">Become Top 1% in the<br/> AI-First World</h1>
                <p className="text-lg text-white mb-6 ml-6">Whether it is Product, Growth, Design, Business,<br/> Tech or Data, GrowthSchool is the place to learn from<br/> top experts in the field to become the Top 1%</p>
                <div className="flex space-x-4 ml-6">
                  <button className="bg-[#EBFBFF] px-4 py-2 rounded-xl transition cursor-pointer">
                    Learn More
                  </button>
                  <button className="bg-[#00B4D8] px-4 py-2 hover:bg-blue-700 transition cursor-pointer rounded-xl">
                    Explore More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ready to Reimagine Your Career?</h1>
        <p className="text-lg text-gray-600 mb-10">Kickstart your career with confidence</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="shadow-md rounded-lg p-6 bg-cover bg-center text-white"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture3.png?updatedAt=1759557480087")',
            }}>
          </div>

          <div
            className="relative shadow-md rounded-lg p-6 bg-cover bg-center text-white h-64"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture4.png?updatedAt=1759557479904")',
            }}
          >
          </div>

          <div
            className="shadow-md rounded-lg p-6 bg-cover bg-center text-white"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture5.png?updatedAt=1759557479964")',
            }}>
          </div>
        </div>

        <button className="bg-[#00B4D8] text-white px-6 py-3 rounded-3xl cursor-pointer transition">
          All Career Accelerators
        </button>
      </div>

    </div>
  );
};
export default Home;
