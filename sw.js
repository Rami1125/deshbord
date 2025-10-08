/**
 * This is the code for your Cloudflare Worker.
 * It acts as a proxy between your app and Google Apps Script to solve CORS issues.
 */

// IMPORTANT: Paste the URL of your Google Apps Script Web App here.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHszyq4YxLLQmGSATggvW4YxNWAP5JMtgEEQ46zidkC1KqP-xAmIET-nDD0BhD7KQx/exec';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // This block handles pre-flight OPTIONS requests which browsers send for CORS checks.
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Only proxy requests that start with /api
    if (url.pathname.startsWith('/api')) {
      // Construct the new URL to fetch from Google Apps Script
      const newUrl = new URL(APPS_SCRIPT_URL);
      newUrl.search = url.search; // Pass along any query parameters like ?action=getAllData

      // Create a new request to the Google Apps Script URL
      const newRequest = new Request(newUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow'
      });

      try {
        const response = await fetch(newRequest);
        
        // Create a new response that is mutable so we can add CORS headers
        const newResponse = new Response(response.body, response);

        // Add CORS headers to the response returned to the browser
        // This allows your frontend to access the data from the worker
        newResponse.headers.set('Access-Control-Allow-Origin', '*'); // Or your specific domain for better security
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return newResponse;

      } catch (e) {
        return new Response(JSON.stringify({ error: true, details: 'Failed to connect to Google Script' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
        });
      }
    }

    // For all other requests, let Cloudflare Pages handle them as usual
    return env.ASSETS.fetch(request);
  },
};

// Function to handle OPTIONS pre-flight requests
function handleOptions(request) {
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    let respHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    return new Response(null, { headers: respHeaders });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: "GET, POST, OPTIONS",
      },
    });
  }
}

