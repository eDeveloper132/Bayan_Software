import { AudioCourse } from "./types/audiocourse";
import { Course } from "./types/course";
import { Introduction } from "./types/introduction";


// Backend API base URL (adjust for production)
const API_BASE_URL = 'http://localhost:3001';

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: Cache strategy for Next.js
      // cache: 'no-store', // Uncomment for fresh data
      // next: { revalidate: 10 }, // Uncomment for ISR-like behavior
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as Course[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}
export async function fetchAudioCourses(): Promise<AudioCourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/audiocourses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: Cache strategy for Next.js
      // cache: 'no-store', // Uncomment for fresh data
      // next: { revalidate: 10 }, // Uncomment for ISR-like behavior
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as AudioCourse[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}
// Fetch introduction paragraph
export async function fetchIntro(): Promise<Introduction | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/introduction`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: Cache strategy
      // cache: 'no-store',
      // next: { revalidate: 10 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data)
    return data as Introduction | null;
  } catch (error) {
    console.error('Error fetching introduction:', error);
    return null;
  }
}