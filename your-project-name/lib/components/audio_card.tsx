import { AudioCourse } from "../types/audiocourse";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { FC } from "react";
import { format } from "date-fns"; // Import date-fns for formatting

// Construct Sanity image URL from _ref string
function getSanityImageUrl(ref: string): string {
  if (!ref) return '';
  const [_, imageId, dimensions, formatType] = ref.split('-');
  return `https://cdn.sanity.io/images/p0xh3i3l/production/${imageId}-${dimensions}.${formatType}`;
}

// Define the CourseCard component with typed props
const CourseCard: FC<AudioCourse> = ({ _id, name, image, _createdAt, _updatedAt }) => {
  const imageUrl = getSanityImageUrl(image.asset._ref);
  const createdAt = format(new Date(_createdAt as string), "MMM d, yyyy");
  const updatedAt = format(new Date(_updatedAt as string), "MMM d, yyyy");

  return (
    <div
      key={_id}
      className="flex flex-col gap-2 w-80 bg-white rounded-2xl border border-black shadow-xl shadow-gray-500"
    >
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          width={320}
          height={192}
          className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 flex-1 p-6 space-y-4">
        <h2 className="flex justify-center text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300">
          {name}
        </h2>
        <p className="text-sm text-gray-500 flex flex-col gap-2 justify-center items-center">
          <span>Created: <strong>{createdAt}</strong></span>
          <span>Updated: <strong>{updatedAt}</strong></span>
        </p>
        <Link href={`/app-demo/protected/exploreaudiocourse/${_id}`}>
          <button className="mt-auto w-full py-2 bg-indigo-600 text-black rounded-lg shadow hover:bg-indigo-700 transition-colors duration-300">
            View Audios
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;