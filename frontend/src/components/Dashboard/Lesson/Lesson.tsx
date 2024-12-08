import { useNavigate } from "react-router-dom";

const lessons = [
  { id: 1, title: "Introduction to Typing", completed: true, route: "/lesson/1" },
  { id: 2, title: "Keys f & j", completed: true, route: "/lesson/2" },
  { id: 3, title: "Space Bar", completed: false, route: "/lesson/3" },
  { id: 4, title: "Review f & j", completed: false, route: "/lesson/4" },
  { id: 5, title: "Keys d & k", completed: false, route: "/lesson/5" },
  { id: 6, title: "Introduction to Typing", completed: true, route: "/lesson/1" },
  { id: 7, title: "Keys f & j", completed: true, route: "/lesson/2" },
  { id: 8, title: "Space Bar", completed: false, route: "/lesson/3" },
  { id: 9, title: "Review f & j", completed: false, route: "/lesson/4" },
  { id: 10, title: "Keys d & k", completed: false, route: "/lesson/5" },
  
];

const Lesson = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="text-2xl font-bold text- mb-4 text-center sm:text-left">
        Welcome, Student
      </div>
      <div className="text-gray-600 mb-6 text-center sm:text-left">
        <span>0% progress | 0 stars | 2,000 points</span>
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center sm:text-left">
          Home Row
        </h2>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => navigate(lesson.route)}
              className={`p-4 rounded-md shadow-md cursor-pointer ${
                lesson.completed ? "bg-green-100" : "bg-gray-100"
              } hover:shadow-lg`}
            >
              <div className="text-center">
                <div className="text-gray-800 text-xl font-semibold">{lesson.id}</div>
                <div className="mt-2 text-sm text-gray-600">{lesson.title}</div>
                <div className="mt-2">
                  {lesson.completed ? (
                    <span className="text-green-600 font-bold">✓ Completed</span>
                  ) : (
                    <span className="text-gray-500">Locked</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
