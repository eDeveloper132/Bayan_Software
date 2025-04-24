// app/course/[id]/page.tsx
import { fetchAudioCourses } from "@/lib/api";
import { AudioCourse } from "@/lib/types/audiocourse";
import Script from "next/script";

function getSanityAudioUrl(ref?: string): string {
  if (!ref) return "";
  const parts = ref.split("-");
  if (parts.length < 3 || parts[0] !== "file") {
    console.warn("Invalid audio ref:", ref);
    return "";
  }
  const id = parts[1];
  const ext = parts[parts.length - 1];
  return `https://cdn.sanity.io/files/p0xh3i3l/production/${id}.${ext}`;
}

export default async function CourseAudiosPage({ params }: { params: { id: string } }) {
  const courses: AudioCourse[] = (await fetchAudioCourses()) || [];
  const course = courses.find(c => c._id === params.id);

  return (
    <>
      <main className="container mx-auto px-10 py-16">
        <h1 className="text-4xl font-extrabold text-center mb-12">
          {course?.name ?? "Course Not Found"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {course?.lessons?.length ? (
            course.lessons.map((lesson, i) => {
              const url = getSanityAudioUrl(lesson.audio.asset._ref);
              return (
                <div
                  key={i}
                  className="lesson-card bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer"
                  data-audio={url}
                >
                  <div className="aspect-square bg-gray-900 flex items-center justify-center relative">
                    {url ? <div className="text-white text-6xl">🎵</div>
                         : (
                       <div className="w-full h-full flex items-center justify-center bg-gray-200">
                         <p>Audio not available</p>
                       </div>
                     )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3l10 7-10 7V3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold line-clamp-2">{lesson.name}</h2>
                    <p className="text-sm mt-1 text-gray-600">{lesson.publishedDate}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold">No Lessons Found</h2>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <div
        id="audioModal"
        className="hidden fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative">
          <button id="closeModal" className="absolute top-2 right-2 text-xl font-bold">✕</button>
          <audio id="audioPlayer" src="" controls autoPlay className="w-full" />
        </div>
      </div>

      {/* Client-side script */}
      <Script id="audio-script" strategy="afterInteractive">
        {`
          document.querySelectorAll(".lesson-card").forEach(card => {
            card.addEventListener("click", () => {
              const url = card.dataset.audio;
              const modal = document.getElementById("audioModal");
              const player = document.getElementById("audioPlayer");
              if (!url || !modal || !player) return;
              console.log("🟢 Playing:", url);
              player.src = url;
              modal.classList.remove("hidden");
            });
          });

          document.getElementById("closeModal")?.addEventListener("click", () => {
            const modal = document.getElementById("audioModal");
            const player = document.getElementById("audioPlayer");
            if (!modal || !player) return;
            player.pause();
            modal.classList.add("hidden");
          });
        `}
      </Script>
    </>
  );
}
