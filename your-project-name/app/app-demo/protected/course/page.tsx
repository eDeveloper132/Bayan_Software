import { Course } from "@/lib/types/course"; // Adjust path as needed
import { fetchCourses } from "@/lib/api"; // Adjust path
import CourseCard from "@/lib/components/course_card"; // Adjust path
export default async function CoursesPage() {
  const courses: Course[] = (await fetchCourses()) || [];
  return (
    <main className="container mx-auto px-10 py-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Available Video Playlists
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {courses.map(course => (
          <CourseCard key={course._id} {...course} />
        ))}
      </div>
    </main>
  );
}
