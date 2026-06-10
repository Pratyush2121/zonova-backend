import serverless from 'serverless-http';
import serverModule from '../server.js';

// Safely handle ESM/CommonJS default export wrapping by bundlers
const app = (serverModule && serverModule.default) ? serverModule.default : serverModule;
const initApp = (serverModule && serverModule.initApp) ? serverModule.initApp : ((app && app.initApp) ? app.initApp : null);

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Ensure db connection is initialized on first call
  if (typeof initApp === 'function') {
    await initApp();
  }
  return serverlessHandler(event, context);
};
