import serverless from 'serverless-http';
import app, { initApp } from '../server.js';

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Ensure db connection is initialized on first call
  await initApp();
  return serverlessHandler(event, context);
};
