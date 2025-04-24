import { client } from "@/sanity/lib/client";
import { AudioCourse } from "@/types/audiocourse";
import { Course } from "@/types/course";
import { Introduction } from "@/types/paragraph";
import { groq } from "next-sanity";

export async function getCourses(): Promise<Course[]> {
  return client.fetch(
    groq`*[_type == "course"]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      image,
      dateRange,
      lessons[]{
        name,
        video,
        publishedDate
      }
    }`
  );
}
export async function getAudioCourses(): Promise<AudioCourse[]> {
  return client.fetch(
    groq`*[_type == "audioCourse"]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      image,
      dateRange,
      lessons[]{
        name,
        audio,
        publishedDate
      }
    }`
  );
}
export async function getIntro(): Promise<Introduction | null> {
  return client.fetch(
    groq`*[_type == "introduction"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      content
    }`
  );
}