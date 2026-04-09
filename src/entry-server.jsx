/**
 * Entry Server: SSR entry point
 * Used during server-side rendering to render React app
 * 
 * This file is compiled separately and used by server.js
 */

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export default function AppSSR({ pathname, pageData }) {
  return (
    <HelmetProvider>
      <StaticRouter location={pathname}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
}

export { HelmetProvider };
