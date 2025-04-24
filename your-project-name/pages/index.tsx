// pages/index.tsx
// import Image from "next/image";
// import Link from "next/link";
// import { Inter } from "next/font/google";
import connectToDatabase from "@/lib/mongodb";

export const getServerSideProps = async () => {
  try {
    await connectToDatabase();
    console.log("✅ MongoDB connected successfully");

    return {
      redirect: {
        destination: "/app-demo",
        permanent: false,
      },
    };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);

    return {
      props: {
        connectionError: true,
      },
    };
  }
};

export default function Home() {
  return <div>Loading...</div>;
}