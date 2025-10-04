import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

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
const courses = Array(8).fill({
  title: 'PYTHON',
  image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
  level: 'Beginner',
  duration: '6 months',
  modules: '56',
});

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
                 <div className="relative flex space-x-[-10px] mb-10 ml-6">
                    <div className="w-8 h-8 rounded-full bg-pink-400 shadow-lg z-10" />
                    <div className="w-8 h-8 rounded-full bg-yellow-200 shadow-lg z-20" />
                    <div className="w-8 h-8 rounded-full bg-green-300 shadow-lg z-30" />
                    <div className="w-8 h-8 rounded-full bg-gray-300 shadow-lg z-40" />
                 </div>
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

      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ready to Reimagine Your Career?</h1>
        <p className="text-lg text-gray-600 mb-10">Kickstart your career with confidence</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
          <div
          className="relative bg-cover bg-center rounded-xl overflow-hidden"
          style={{
            backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture3.png?updatedAt=1759557480087")',
          }}
        >
          {/* NEW Badge */}
          <div className="absolute top-4 right-4 bg-[#66E5FF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            NEW
          </div>

          {/* Bottom Card */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#ebfbff] p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800">JAVA FULLSTACK</h1>
              <FaArrowUpRightFromSquare className="text-[#66E5FF] text-xl cursor-pointer" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {/* First Row */}
              <div className="flex flex-row gap-3">
                <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                  Data Visualization
                </button>
                <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                  AI ML
                </button>
                <p className="text-sm text-gray-600 self-center">+12</p>
              </div>

              {/* Second Row */}
              <div className="flex flex-row gap-1">
                <button className="flex items-center gap-1 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/dd633407c004d0747c47c11815a35f98692126fc.png?updatedAt=1759588354353"
                    alt="All Levels Icon"
                    className="w-4 h-4"
                  />
                  All Levels
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/59690c968648007a2420eabecf38f3fed802c334.png?updatedAt=1759588564115"
                    alt="Course Duration"
                    className="w-4 h-4"
                  />
                  6 Months
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/aa811ecebf620f0d8790c489d7fa4019bbe44911.png?updatedAt=1759588563739"
                    alt="AI Tools"
                    className="w-4 h-4"
                  />
                  10+ AI Tools
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/b04dbda97308e590577f869e17e07cbee0ed620d.png?updatedAt=1759588563953"
                    alt="Total Enrolled"
                    className="w-4 h-4"
                  />
                  56
                </button>
              </div>
        </div>
      </div>
          </div>

          <div
            className="relative h-[300px] bg-cover bg-center rounded-xl overflow-hidden"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture4.png?updatedAt=1759557479904")',
            }}>
                {/* NEW Badge */}
                <div className="absolute top-4 right-4 bg-[#66E5FF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  NEW
                </div>

                {/* Bottom Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#ebfbff] p-4 rounded-xl shadow-lg">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-gray-800">PYTHON FULLSTACK</h1>
                    <FaArrowUpRightFromSquare className="text-[#66E5FF] text-xl cursor-pointer" />
                  </div>
                  <div className="flex flex-col gap-4 mt-4">
                    {/* First Row */}
                    <div className="flex flex-row gap-3">
                      <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                        Data Visualization
                      </button>
                      <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                        AI ML
                      </button>
                      <p className="text-sm text-gray-600 self-center">+12</p>
                    </div>

                    {/* Second Row */}
                    <div className="flex flex-row gap-1">
                <button className="flex items-center gap-1 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/dd633407c004d0747c47c11815a35f98692126fc.png?updatedAt=1759588354353"
                    alt="All Levels Icon"
                    className="w-4 h-4"
                  />
                  All Levels
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/59690c968648007a2420eabecf38f3fed802c334.png?updatedAt=1759588564115"
                    alt="Course Duration"
                    className="w-4 h-4"
                  />
                  6 Months
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/aa811ecebf620f0d8790c489d7fa4019bbe44911.png?updatedAt=1759588563739"
                    alt="AI Tools"
                    className="w-4 h-4"
                  />
                  10+ AI Tools
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/b04dbda97308e590577f869e17e07cbee0ed620d.png?updatedAt=1759588563953"
                    alt="Total Enrolled"
                    className="w-4 h-4"
                  />
                  56
                </button>
              </div>
              </div>
            </div>
          </div>

          <div
            className="relative h-[300px] bg-cover bg-center rounded-xl overflow-hidden"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/ipo22webapp/Picture5.png?updatedAt=1759557479964")',
            }}>
            {/* NEW Badge */}
            <div className="absolute top-4 right-4 bg-[#66E5FF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              NEW
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#ebfbff] p-4 rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-800">DATA COURSES</h1>
                <FaArrowUpRightFromSquare className="text-[#66E5FF] text-xl cursor-pointer" />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {/* First Row */}
                <div className="flex flex-row gap-3">
                  <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                    Data Visualization
                  </button>
                  <button className="px-2 py-1 bg-[#66E5FF] text-black text-sm cursor-pointer rounded-md transition hover:bg-[#4dcff0]">
                    AI ML
                  </button>
                  <p className="text-sm text-gray-600 self-center">+12</p>
                </div>

                {/* Second Row */}
                <div className="flex flex-row gap-1">
                <button className="flex items-center gap-1 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/dd633407c004d0747c47c11815a35f98692126fc.png?updatedAt=1759588354353"
                    alt="All Levels Icon"
                    className="w-4 h-4"
                  />
                  All Levels
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/59690c968648007a2420eabecf38f3fed802c334.png?updatedAt=1759588564115"
                    alt="Course Duration"
                    className="w-4 h-4"
                  />
                  6 Months
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/aa811ecebf620f0d8790c489d7fa4019bbe44911.png?updatedAt=1759588563739"
                    alt="AI Tools"
                    className="w-4 h-4"
                  />
                  10+ AI Tools
                </button>

                <button className="flex items-center gap-2 px-2 py-1 bg-transparent border border-[#66E5FF] text-black text-xs rounded-md transition hover:bg-[#e6faff]">
                  <img
                    src="https://ik.imagekit.io/ipo22webapp/b04dbda97308e590577f869e17e07cbee0ed620d.png?updatedAt=1759588563953"
                    alt="Total Enrolled"
                    className="w-4 h-4"
                  />
                  56
                </button>
              </div>
          </div>
            </div>
          </div>
        </div>

        <button className="bg-[#00B4D8] text-white px-6 py-3 rounded-3xl cursor-pointer transition">
          All Career Accelerators
        </button>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Explore Online Courses</h1>

        {/* Buttons */}
        <div className="flex flex-row justify-center flex-wrap gap-5 mb-8">
          {[
            'Trending', 'Frontend', 'Backend', 'Data Engineer', 'Java', 'Python', 'Excel',
            'Gen AI', 'Data Courses', 'Cyber Security', 'DevOps', 'Cloud',
            'Machine Learning', 'Power BI', 'Testing', 'Github'
          ].map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-[#ccf6ff] border border-black text-black rounded-full hover:bg-[#d3f6ff] transition"
            >
              {category}
            </button>
          ))}
        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md p-4 hover:shadow-lg transition"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #FFE608, #585900)',
            }}
          >
            <img
              src={course.image}
              alt={`${course.title} Course`}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-white mb-2">{course.title}</h2>

            <div className="flex flex-row flex-wrap gap-2 mb-4">
              <button className="px-3 py-1 text-white border border-amber-200 rounded-md text-sm">
                {course.level}
              </button>
              <button className="px-3 py-1 text-white border border-amber-200 rounded-md text-sm">
                {course.duration}
              </button>
              <button className="px-3 py-1 text-white border border-amber-200 rounded-md text-sm">
                {course.modules}
              </button>
            </div>

            <button className="w-full px-4 py-2 bg-[#ccf6ff] text-black rounded-md hover:bg-[#4dcff0] transition">
              Explore Course
            </button>
          </div>
        ))}
      </div>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Why Algonex</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div
              className="h-90 bg-cover bg-center rounded-xl text-white text-5xl font-semibold shadow-md ml-3 flex items-end justify-start p-4"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/2cd43e0ca079a01f4b9629bbafe92a56299a4a1f.jpg?updatedAt=1759587051791")',
              }}
            >
              Solving<br/> Problems<br/> Matter
            </div>
            <div
              className="h-40 bg-cover bg-center rounded-xl flex items-center justify-center text-white text-xl font-semibold shadow-md"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/d135d30df2a0df0759bac0d9fb5020d984111047.jpg?updatedAt=1759587110164")',
              }}
            >
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <div
              className="h-40 bg-cover bg-center rounded-xl flex items-center justify-center text-white text-xl font-semibold shadow-md"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/ebb357bc544220fa94b25d4f63fdf7f920b10ccc.jpg?updatedAt=1759587259094")',
              }}
            >
            </div>
            <div
              className="h-90 bg-cover bg-center rounded-xl text-white text-5xl font-semibold shadow-md ml-3 flex items-end justify-center p-4"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/b8f8f0002f65d23c6110e87aa3e08f288a3c4d8f.jpg?updatedAt=1759587259315")',
              }}
            >Smarter <br/>With <br/>Gen AI
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <div
              className="h-100 bg-cover bg-center rounded-xl text-white text-4xl font-semibold shadow-md ml-3 flex items-end justify-start p-4"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/7c7342c9eb086b7fba6a4607ce317bb026d07de6.jpg?updatedAt=1759587259013")',
              }}
            >Real Industry<br/> Real Connections
            </div>
            <div
              className="h-30 bg-cover bg-center rounded-xl flex items-center justify-center text-white text-xl font-semibold shadow-md"
              style={{
                backgroundImage:
                  'url("https://ik.imagekit.io/ipo22webapp/d8c92713d1f16c2a4bc3fe93fb4f9c6d2717425c.jpg?updatedAt=1759587259155")',
              }}
            >
            </div>
          </div>
        </div>
      </div>

    </div>
      
  );
};
export default Home;
