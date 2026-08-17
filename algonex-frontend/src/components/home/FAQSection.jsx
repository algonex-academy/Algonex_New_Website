import React, { useEffect, useState } from 'react';
import { Collapse, Tag, Skeleton, Typography } from 'antd';
import { PlusOutlined, MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { commonAPI } from '../../api/common';
import { ALGONEX_FAQS } from '../../constants/constant';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const FAQSection = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const openChat = () => {
        const chatBtn = document.getElementById('buddy-fab-btn');
        if (chatBtn) {
            chatBtn.click();
        } else {
            // fallback if chatbot is not rendered yet or in different state
            console.warn("Buddy chatbot button not found");
        }
    };

    useEffect(() => {
        commonAPI.getFAQs()
            .then(res => {
                const results = res.data?.data?.results || res.data?.results || [];
                // If backend returns empty, fallback to constants for demonstration
                setFaqs(results.length > 0 ? results : ALGONEX_FAQS);
            })
            .catch(err => {
                console.error("Failed to fetch FAQs:", err);
                setFaqs(ALGONEX_FAQS);
            })
            .finally(() => setLoading(false));
    }, []);

    const customExpandIcon = (panelProps) => (
        <div className={`transition-transform duration-300 ${panelProps.isActive ? 'rotate-180 text-[#00B4D8]' : 'text-slate-400'}`}>
            {panelProps.isActive ? <MinusOutlined /> : <PlusOutlined />}
        </div>
    );

    return (
        <section className="py-16 px-6 bg-slate-50 overflow-hidden relative">
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Tag color="cyan" className="mb-4 px-4 py-1 text-sm font-semibold rounded-full uppercase">
                            Got Questions?
                        </Tag>
                        <h2 className="text-2xl md:text-[32px] font-bold text-slate-900 mb-2 leading-tight">
                            Frequently Asked <span className="text-[#00B4D8]">Questions</span>
                        </h2>
                        <Paragraph className="text-base text-slate-600">
                            Clear, concise answers to help you choose the right training program at Algonex.
                        </Paragraph>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton.Button key={i} active className="w-full h-16 rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Collapse 
                            accordion 
                            expandIcon={customExpandIcon}
                            expandIconPosition="end"
                            ghost
                            className="faq-collapse"
                        >
                            {faqs.map((faq, index) => (
                                <Panel 
                                    header={
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-[#00B4D8] font-bold text-xs">
                                                {index + 1}
                                            </div>
                                            <span className="text-base font-semibold text-slate-800">{faq.question}</span>
                                        </div>
                                    } 
                                    key={faq.id || index}
                                    className="mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                >
                                    <Paragraph className="text-slate-600 text-base leading-relaxed pl-12 pr-4 pb-4">
                                        {faq.answer}
                                    </Paragraph>
                                </Panel>
                            ))}
                        </Collapse>
                    </motion.div>
                )}
                
                <motion.div 
                    className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0891b2] text-white text-center shadow-lg shadow-cyan-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <QuestionCircleOutlined className="text-2xl mb-3 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-cyan-100 mb-6">Our training advisors are always ready to help you find the right program.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={openChat}
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Live Chat Now
                        </button>
                        <button 
                            onClick={() => navigate('/contact')}
                            className="px-8 py-3 bg-blue-500/30 text-white border border-white/20 font-bold rounded-2xl hover:bg-blue-500/40 transition-all backdrop-blur-sm hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Contact Support
                        </button>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .faq-collapse .ant-collapse-item .ant-collapse-header {
                    padding: 16px 20px !important;
                    align-items: center !important;
                }
                .faq-collapse .ant-collapse-item-active .ant-collapse-header {
                    border-bottom: 1px solid #f1f5f9;
                }
                .faq-collapse .ant-collapse-content-box {
                    padding: 16px 20px 20px !important;
                }
                .faq-collapse .ant-collapse-item {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .faq-collapse .ant-collapse-item:hover {
                    border-color: #00B4D8 !important;
                }
            `}</style>
        </section>
    );
};

export default FAQSection;
