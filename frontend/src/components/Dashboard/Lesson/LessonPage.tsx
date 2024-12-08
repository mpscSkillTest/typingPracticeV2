import React from "react";
import { useParams } from "react-router-dom";

const LessonPage = () => {
  const { id } = useParams(); // Access dynamic route parameter

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Lesson {id}</h1>
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Lesson Content
        </h2>
        <p className="text-gray-600">
          {`This is the content for lesson ${id}.`}
        </p>
      </div>
    </div>
  );

};

export default LessonPage;
