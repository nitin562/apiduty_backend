import path from "path"
import { Worker } from '@temporalio/worker';
import * as cloudinaryActivities from './activities/cloudinary.activities.js';
import { fileURLToPath } from 'url';
import { TemporalConfig } from "../config.js";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const worker = await Worker.create({
    // include all workflows you want to run
    workflowsPath: path.join(__dirname, './workflow'),
    activities: {
      ...cloudinaryActivities,
    },
    taskQueue: TemporalConfig.taskQueue,
  });

  console.log('Worker running');
  await worker.run();
}

run().catch(console.error);
