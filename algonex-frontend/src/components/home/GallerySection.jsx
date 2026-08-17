import React, { useEffect, useState } from 'react';
import { Tag, Skeleton, Modal } from 'antd';
import { PlusOutlined, ZoomInOutlined } from '@ant-design/icons';
import { commonAPI } from '../../api/common';

const GallerySection = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        commonAPI.getGallery(true) // Fetch only featured gallery images for home
            .then(res => {
                setImages(res.data?.data?.results || res.data?.results || []);
            })
            .catch(err => console.error("Failed to fetch gallery images:", err))
            .finally(() => setLoading(false));
    }, []);

    const handlePreview = (image) => {
        setPreviewImage(image.image);
        setPreviewTitle(image.title || image.caption);
        setPreviewOpen(true);
    };

    if (!loading && images.length === 0) return null;

    return (
        <section className="py-16 px-6 bg-white relative">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Tag color="cyan" className="mb-4 px-4 py-1 text-sm font-semibold rounded-full uppercase">
                            Life at Algonex
                        </Tag>
                        <h2 className="text-2xl md:text-[32px] font-bold text-slate-900">
                            Inside Our <span className="text-[#00B4D8]">Training Center</span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto mt-3">
                            Glimpses into our training sessions, workshops, hackathons, and
                            the vibrant Algonex community.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[420px]">
                         {[1, 2, 3, 4].map(i => (
                            <Skeleton.Button key={i} active className="w-full h-full rounded-2xl" />
                         ))}
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[420px]">
                        {/* Featured Large Image */}
                        {images[0] && (
                            <motion.div 
                                className="relative flex-1 group cursor-pointer overflow-hidden rounded-2xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                onClick={() => handlePreview(images[0])}
                            >
                                <img 
                                    src={images[0].image} 
                                    alt={images[0].title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="text-white text-center p-6">
                                        <ZoomInOutlined className="text-4xl mb-3" />
                                        <h4 className="text-lg font-bold">{images[0].title}</h4>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-4 flex-1">
                            <div className="flex gap-4 flex-1">
                                {images.slice(1, 3).map((img, i) => (
                                    <motion.div 
                                        key={img.id}
                                        className="relative flex-1 group cursor-pointer overflow-hidden rounded-2xl"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * (i + 1) }}
                                        onClick={() => handlePreview(img)}
                                    >
                                        <img 
                                            src={img.image} 
                                            alt={img.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ZoomInOutlined className="text-3xl text-white" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {images[3] && (
                                <motion.div 
                                    className="relative flex-1 group cursor-pointer overflow-hidden rounded-2xl"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    onClick={() => handlePreview(images[3])}
                                >
                                    <img 
                                        src={images[3].image} 
                                        alt={images[3].title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-center p-4">
                                            <h4 className="text-lg font-bold">{images[3].title}</h4>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {images.length > 4 && (
                            <div className="flex md:flex-col gap-4 w-full md:w-48">
                                {images.slice(4, 6).map((img, i) => (
                                    <motion.div 
                                        key={img.id}
                                        className="relative flex-1 group cursor-pointer overflow-hidden rounded-2xl h-48 md:h-auto"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        onClick={() => handlePreview(img)}
                                    >
                                        <img 
                                            src={img.image} 
                                            alt={img.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                            {i === 1 && images.length > 6 ? `+${images.length - 6} more` : <PlusOutlined fontSize={24} />}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                centered
                width={1000}
                className="gallery-preview-modal"
            >
                <img alt="preview" style={{ width: '100%', borderRadius: 12 }} src={previewImage} />
            </Modal>
            
            <style jsx global>{`
                .gallery-preview-modal .ant-modal-content {
                    background: transparent;
                    box-shadow: none;
                }
                .gallery-preview-modal .ant-modal-header {
                    background: transparent;
                    border: none;
                }
                .gallery-preview-modal .ant-modal-title {
                    color: white;
                    font-size: 20px;
                }
                .gallery-preview-modal .ant-modal-close {
                    color: white;
                }
            `}</style>
        </section>
    );
};

export default GallerySection;
