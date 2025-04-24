import { fetchCourses } from "@/lib/api";
import { Course } from "@/lib/types/course";

// Build video URL from Sanity ref
function getSanityVideoUrl(ref: string | undefined | null): string {
  if (!ref || typeof ref !== "string") return "";
  const parts = ref.split("-");
  if (parts.length < 3 || parts[0] !== "file") return "";
  const videoId = parts[1];
  const format = parts[parts.length - 1];
  return `https://cdn.sanity.io/files/p0xh3i3l/production/${videoId}.${format}`;
}

export default async function CourseVideosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const courses: Course[] = (await fetchCourses()) || [];
  const { id } = await params;
  const matchedCourse = courses.find((course) => course._id === id);

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
              const videoUrl = getSanityVideoUrl(lesson.video.asset._ref);
              return (
                <div
                  key={index}
                  className="lesson-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
                  data-video={videoUrl}
                >
                  <div className="aspect-video bg-gray-900 relative">
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p>Video not available</p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
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
                    <p className="text-sm text-gray-600 mt-1">{lesson.publishedDate}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900">No Lessons Found</h2>
            </div>
          )}
        </div>
      </main>

      {/* Modal Popup */}
      <div
        id="videoModal"
        className="hidden fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative">
          <button
            id="closeModal"
            className="absolute top-2 right-2 text-black text-xl font-bold"
          >
            ✕
          </button>
          <video
            id="videoFrame"
            src=""
            controls
            autoPlay
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Manual DOM script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("DOMContentLoaded", function () {
              const cards = document.querySelectorAll(".lesson-card");
              const modal = document.getElementById("videoModal");
              const video = document.getElementById("videoFrame");
              const close = document.getElementById("closeModal");

              cards.forEach((card) => {
                card.addEventListener("click", () => {
                  const videoUrl = card.getAttribute("data-video");
                  if (videoUrl) {
                    video.src = videoUrl;
                    modal.classList.remove("hidden");
                    video.play();
                  }
                });
              });

              close.addEventListener("click", () => {
                video.pause();
                video.src = "";
                modal.classList.add("hidden");
              });
            });
          `,
        }}
      />
    </>
  );
}
