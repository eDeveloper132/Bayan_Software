import { AudioCourse } from "@/lib/types/audiocourse"; // Adjust path as needed
import { fetchAudioCourses } from "@/lib/api"; // Adjust path
import AudioCard from "../../../../lib/components/audio_card";
export default async function CoursesPage() {
  const courses: AudioCourse[] = (await fetchAudioCourses()) || [];
  return (
    <main className="container mx-auto px-10 py-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Available Audio Playlists
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {courses.map(course => (
            <AudioCard key={course._id} {...course} />
        ))}
      </div>
    </main>
  );
}
