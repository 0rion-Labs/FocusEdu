'use client';

interface StarredCourse {
  id: string;
  title: string;
}

interface StarredListProps {
  courses: StarredCourse[];
  onRemove: (id: string) => void;
}

export default function StarredList({ courses, onRemove }: StarredListProps) {
  if (courses.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
        No starred courses yet.
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="font-semibold mb-3">Starred Courses</h2>
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="text-sm">{course.title}</span>
            <button
              onClick={() => onRemove(course.id)}
              className="text-red-500 hover:text-red-700 text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
