import React from 'react';
import './Module.scss';

const Module = ({ module }) => {
    return (
        <div className="module-container">
            <div className="module-meta-data">
                <h2>Module</h2>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <a href={module.link} className="module-link">View Module</a>
            </div>
            <div className="module-topics">
                {module.topics.map((topic, index) => (
                    <div key={index} className="module-topic">
                        <h4>{topic.title}</h4>
                        <p>{topic.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Module;