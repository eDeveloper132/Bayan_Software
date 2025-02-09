"use server";

import client from "@/lib/mongodb";

interface ConnectionTestResult {
  success: boolean;
  timestamp: Date;
  message: string;
  error?: unknown;
}

/**
 * A generic retry function to re-attempt an asynchronous operation.
 *
 * @param operation - The async function to retry.
 * @param retries - Number of retries before failing.
 * @param delay - Delay in milliseconds between retries.
 * @returns The result of the operation if successful.
 * @throws The last encountered error if all retries fail.
 */
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
    // Attempt to connect to MongoDB using the retry mechanism
    const mongoClient = await withRetry(() => client.connect(), 3, 1000);
    const db = mongoClient.db("admin");

    // Use a retryable ping command to verify the connection
    const pingResult = await withRetry(() => db.command({ ping: 1 }), 3, 1000);

    if (pingResult.ok === 1) {
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
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
  } finally {
    // Optionally, if you're not leveraging connection pooling, you can close the connection:
    await client.close();
  }
}
