import { handleEnquiryOptions, handleEnquiryPost } from './enquiry-handler.js';

export async function onRequestPost(context) {
  return handleEnquiryPost(context.request);
}

export async function onRequestOptions() {
  return handleEnquiryOptions();
}
