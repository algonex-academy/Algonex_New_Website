import React from 'react';
import { Tag } from 'antd';
import './Skills.scss';

const Skills = ({ course }) => {
    return (
        <div className="skills-section">
            <div className="section-header">
                <h2 className="section-title">Skills You Will Master</h2>
                <p className="section-subtitle">Build expertise in these core technologies</p>
            </div>
            <div className="skills-tags-container">
                { course.skills ? course.skills.map((skill) => (
                    <Tag key={skill} className="skill-tag">
                        {skill}
                    </Tag>
                )) : course.modules.map((module) => (
                    <Tag key={module.id} className="skill-tag">
                        {module.title}
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default Skills;