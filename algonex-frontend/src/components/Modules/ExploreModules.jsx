import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './exploreModules.scss';

const { Meta } = Card;

const ExploreModules = ({ course }) => {
    const navigate = useNavigate();

    const handleModuleClick = (moduleId) => {
        navigate(`/course/${course.id}/module/${moduleId}`);
    };

    return (
        <div className="modules-container">
            <h2 className="modules-title">Course Modules</h2>
            <div className="modules-grid">
                {course.modules.map((module) => (
                    <Card
                        key={module.id}
                        hoverable
                        className="module-card"
                        cover={
                            <div className="module-image-container">
                                <img 
                                    src={course.image} 
                                    alt={module.title}
                                    className="module-image"
                                />
                                <div className="module-overlay">
                                    <span className="module-number">Module {module.id}</span>
                                </div>
                            </div>
                        }
                        onClick={() => handleModuleClick(module.id)}
                    >
                        <Meta 
                            title={module.title} 
                            description={module.description}
                        />
                        <div className="module-actions">
                            <span className="topics-count">
                                {module.topics?.length || 0} Topics
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExploreModules;