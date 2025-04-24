// app/course/[id]/page.tsx
import { fetchAudioCourses } from "@/lib/api";
import { AudioCourse } from "@/lib/types/audiocourse";
import Script from "next/script"; // ← Make sure this is imported

// Convert Sanity `_ref` → CDN URL
function getSanityAudioUrl(ref: string | undefined | null): string {
  if (!ref || typeof ref !== "string") return "";
  const parts = ref.split("-");
  if (parts.length < 3 || parts[0] !== "file") {
    console.warn("Invalid audio ref format:", ref);
    return "";
  }
  const audioId = parts[1];
  const ext = parts[parts.length - 1];
  return `https://cdn.sanity.io/files/p0xh3i3l/production/${audioId}.${ext}`;
}

export default async function CourseAudiosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params so TS is happy
  const { id } = await params;

  // Fetch and pick the course
  const courses: AudioCourse[] = (await fetchAudioCourses()) || [];
  const matchedCourse = courses.find((c) => c._id === id);

  return (
    <>
      <main className="container mx-auto px-10 py-16">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          {matchedCourse?.name || "Course Not Found"}
        </h1>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          id="lessonGrid"
        >
          {matchedCourse?.lessons?.length ? (
            matchedCourse.lessons.map((lesson, index) => {
              const audioUrl = getSanityAudioUrl(lesson.audio.asset._ref);
              return (
                <div
                  key={index}
                  className="lesson-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
                  data-audio={audioUrl}
                >
                  <div className="aspect-square bg-gray-900 relative flex items-center justify-center">
                    {audioUrl ? (
                      <div className="text-white text-6xl">🎵</div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p>Audio not available</p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3l10 7-10 7V3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {lesson.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {lesson.publishedDate}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                No Lessons Found
              </h2>
            </div>
          )}
        </div>
      </main>

      {/* Popup Modal */}
      <div
        id="audioModal"
        className="hidden fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative">
          <button
            id="closeModal"
            className="absolute top-2 right-2 text-black text-xl font-bold"
          >
            ✕
          </button>
          <audio
            id="audioPlayer"
            src=""
            controls
            autoPlay
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Client-side script: now actually runs */}
      <Script id="audio-script" strategy="afterInteractive">
        {`
          // Bind click handlers to each lesson-card
          document.querySelectorAll(".lesson-card").forEach(card => {
            card.addEventListener("click", () => {
              const url = card.getAttribute("data-audio");
              const modal = document.getElementById("audioModal");
              const player = document.getElementById("audioPlayer");
              if (!url || !modal || !player) return;
              console.log("🟢 Playing:", url);
              player.src = url;
              modal.classList.remove("hidden");
            });
          });

          // Close button
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
