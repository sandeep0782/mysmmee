import { Worker } from "bullmq";
import { listingQueue, connection } from "./listing.queue";
import { processListing } from "../services/listingService";
import Listing from "../models/Listing";
import connectDB from "../config/dbConfig";

// Start the worker
const startWorker = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log("🟢 Worker connected to MongoDB");

    const worker = new Worker(
      "listing-processing",
      async (job) => {
        const { listingId, userId } = job.data;
        if (!listingId) return;

        // Save job ID
        await Listing.findByIdAndUpdate(listingId, {
          bullJobId: String(job.id),
          bullJobFailed: false,
          bullJobError: "",
          status: "pending",
        });

        try {
          // Process the listing
          await processListing(listingId, userId);

          // Mark success
          await Listing.findByIdAndUpdate(listingId, { status: "success" });
        } catch (err: any) {
          // Mark failed
          await Listing.findByIdAndUpdate(listingId, {
            status: "failed",
            bullJobFailed: true,
            bullJobError: err.message,
          });
        }
      },
      { connection },
    );

    // Handle failed events globally
    worker.on("failed", async (job, err) => {
      if (job?.data?.listingId) {
        await Listing.findByIdAndUpdate(job.data.listingId, {
          status: "failed",
          bullJobFailed: true,
          bullJobError: err?.message || "Unknown error",
        });
      }
    });

    console.log("🟢 Listing worker READY and waiting for jobs");
  } catch (err) {
    console.error("❌ Worker failed to start:", err);
  }
};

startWorker();
