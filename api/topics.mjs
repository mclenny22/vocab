import { createTopicsHandler } from '../server/topics.mjs';

const handle = createTopicsHandler();
export const GET = handle;
export const POST = handle;
