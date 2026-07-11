import { handleEnquiryOptions, handleEnquiryPost } from './functions/api/enquiry-handler.js';

export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);

    if (url.pathname === '/api/enquiry') {
      if (request.method === 'OPTIONS') {
        return handleEnquiryOptions(request);
      }

      if (request.method === 'POST') {
        return handleEnquiryPost(request);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
