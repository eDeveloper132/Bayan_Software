// app/actions.ts
"use server";
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

interface ConnectionTestResult {
  success: boolean;
  timestamp: Date;
  message: string;
  error?: unknown;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `Operation failed, retrying in ${delay} ms... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay);
    }
    throw error;
  }
}

export async function testDatabaseConnection(): Promise<ConnectionTestResult> {
  try {
    await connectToDatabase();
    const pingResult = await withRetry(() => mongoose.connection.db?.command({ ping: 1 }) ?? Promise.reject('DB undefined'), 3, 1000);

    if (pingResult.ok === 1) {
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return {
        success: true,
        timestamp: new Date(),
        message: "Successfully connected to MongoDB",
      };
    } else {
      console.error("Ping response not OK:", pingResult);
      return {
        success: false,
        timestamp: new Date(),
        message: "Ping response not OK",
        error: pingResult,
      };
    }
  } catch (error) {
    console.error("Error testing MongoDB connection:", error);
    return {
      success: false,
      timestamp: new Date(),
      message: "Error testing MongoDB connection",
      error,
    };
  }
}