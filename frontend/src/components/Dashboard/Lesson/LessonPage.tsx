import React from "react";
import { useParams } from "react-router-dom";

const LessonPage = () => {
  const { id } = useParams();

  // Mock lesson details for demonstration
  const lessonDetails = {
    1: "Introduction to Typing Content...",
    2: "Keys f & j Content...",
    3: "Space Bar Content...",
    4: "Review f & j Content...",
    5: "Keys d & k Content...",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-2xl font-bold text-blue-700 mb-4">Lesson {id}</div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Lesson Content</h2>
        <p className="text-gray-600">{lessonDetails[id] || "Lesson content not found."}</p>
      </div>
    </div>
  );
};

export default LessonPage;
