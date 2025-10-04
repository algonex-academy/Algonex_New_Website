import React from 'react';
import {COURSES} from '../../constants/constant';
import { Card } from 'antd';
const { Meta } = Card;  
import './CourseCard.css';
const CourseCard = () => (
    <div className="course-card-container">
        {COURSES.map((course) => (
            <Card
                key={course.id}
                hoverable
                style={{ width: 240 }}
                cover={
                <img
                    draggable={false}
                    alt="example"
                    src={course.image}
                />
            }
            >
            <Meta title={course.name} description={course.description} />
            </Card>
        ))}
    </div>
);
export default CourseCard;