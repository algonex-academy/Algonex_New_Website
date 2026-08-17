import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Avatar, Rate, Tag, Skeleton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { alumniAPI } from '../../api/alumni';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReviewsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        alumniAPI.featured()
            .then(res => {
                setReviews(res.data?.data || []);
            })
            .catch(err => console.error("Failed to fetch featured alumni reviews:", err))
            .finally(() => setLoading(false));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    if (!loading && reviews.length === 0) return null;

    return (
        <section className="py-16 px-6 bg-slate-50 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-1" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-1" />

            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Tag color="cyan" className="mb-4 px-4 py-1 text-sm font-semibold rounded-full uppercase">
                            Success Stories
                        </Tag>
                        <h2 className="text-2xl md:text-[32px] font-bold text-slate-900 mb-2">
                            శిక్షణ పొందినవాళ్ళు <span className="text-[#00B4D8]">ఏమంటున్నారంటే...</span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto">
                            Thousands of trained professionals now work at top tech companies.
                            Your career transformation starts here.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="reviews-slider-container -mx-4">
                        <Slider {...settings}>
                            {reviews.map((review) => (
                                <div key={review.id} className="px-3 pb-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 h-full relative group">
                                        <div className="absolute top-6 right-6 text-cyan-100 group-hover:text-cyan-200 transition-colors">
                                            <CommentOutlined style={{ fontSize: 28 }} />
                                        </div>

                                        <div className="flex items-center gap-3 mb-5">
                                            <Avatar
                                                src={review.avatar}
                                                size={48}
                                                className="border-2 border-cyan-100"
                                                alt={review.name}
                                            >
                                                {review.name[0]}
                                            </Avatar>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900">{review.name}</h4>
                                                <div className="text-sm text-[#00B4D8] font-medium">
                                                    {review.current_role} @ {review.current_company}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 italic leading-relaxed mb-5 text-sm">
                                            "{review.short_quote || "The training at Algonex was transformative. It gave me the skills and confidence to land my dream role in the tech industry."}"
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                                                    {review.course_name || "Training Program"}
                                                </div>
                                                <Rate disabled defaultValue={5} style={{ fontSize: 14 }} className="text-amber-400" />
                                            </div>
                                            <div className="text-slate-800 font-bold">
                                                {review.package_range || '8-12'} LPA
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .reviews-slider-container .slick-dots {
                    bottom: -10px;
                }
                .reviews-slider-container .slick-dots li button:before {
                    font-size: 10px;
                    color: #94a3b8;
                    opacity: 0.5;
                }
                .reviews-slider-container .slick-dots li.slick-active button:before {
                    color: #00B4D8;
                    opacity: 1;
                }
                .reviews-slider-container .slick-track {
                    display: flex !important;
                }
                .reviews-slider-container .slick-slide {
                    height: inherit !important;
                }
                .reviews-slider-container .slick-slide > div {
                    height: 100%;
                }
            `}</style>
        </section>
    );
};

export default ReviewsSection;
