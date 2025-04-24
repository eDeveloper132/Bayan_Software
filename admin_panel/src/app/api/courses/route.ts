import { getCourses } from "@/lib/sanity";
import { NextResponse } from "next/server";

// CORS Headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Restrict in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const data = await getCourses();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch courses", error },
      { status: 500, headers: corsHeaders }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: corsHeaders });
}