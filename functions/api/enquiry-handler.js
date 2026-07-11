var RESEND_API_KEY = 're_JHimvrmA_P3QgT37XGQHQvwjdDHLNyzb2';
var RESEND_FROM_EMAIL = 'onboarding@resend.dev';
var OWNER_EMAIL = 'maruthi.gowda.minimalist@gmail.com';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildLeadEmailHtml(data) {
  var submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  var sourceLabel = data.source === 'contact' ? 'Contact Page' : 'Website Enquiry';
  var service = (data.service && data.service.trim()) || 'Not specified';
  var location = (data.location && data.location.trim()) || 'Not specified';
  var name = (data.name && data.name.trim()) || 'Not provided';
  var phone = data.phone && data.phone.trim();
  var email = data.email && data.email.trim();
  var country = data.country || '+91';
  var phoneDisplay = phone ? (country + ' ' + phone).trim() : 'Not provided';
  var phoneTel = phone ? phoneDisplay.replace(/\s+/g, '') : '';
  var phoneRowValue = phone
    ? '<a href="tel:' + escapeHtml(phoneTel) + '" style="color:#1a1a1a;text-decoration:none;">' + escapeHtml(phoneDisplay) + '</a>'
    : escapeHtml(phoneDisplay);
  var emailRowValue = email
    ? '<a href="mailto:' + escapeHtml(email) + '" style="color:#1a1a1a;text-decoration:none;">' + escapeHtml(email) + '</a>'
    : 'Not provided';
  var callButton = phone
    ? '<a href="tel:' + escapeHtml(phoneTel) + '" style="display:inline-block;background:#c5a23a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;margin:0 6px 12px;border-radius:2px;">Call Lead</a>'
    : '';
  var emailButton = email
    ? '<a href="mailto:' + escapeHtml(email) + '" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;margin:0 6px 12px;border-radius:2px;">Reply by Email</a>'
    : '';

  function row(label, value, icon) {
    return (
      '<tr>' +
      '<td style="padding:16px 0;border-bottom:1px solid #eee;width:36px;vertical-align:top;font-size:18px;">' + icon + '</td>' +
      '<td style="padding:16px 0 16px 12px;border-bottom:1px solid #eee;vertical-align:top;">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c5a23a;margin-bottom:4px;">' + label + '</div>' +
      '<div style="font-size:16px;color:#1a1a1a;line-height:1.5;">' + value + '</div>' +
      '</td></tr>'
    );
  }

  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:32px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">' +
    '<tr><td style="background:#1a1a1a;padding:28px 32px;text-align:center;">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#c5a23a;margin-bottom:8px;">Space Solutions</div>' +
    '<div style="font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">New Business Lead</div>' +
    '<div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:8px;">' + escapeHtml(sourceLabel) + ' · ' + escapeHtml(submittedAt) + '</div>' +
    '</td></tr>' +
    '<tr><td style="padding:8px 32px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">' +
    row('Client Name', escapeHtml(name), '👤') +
    row('Phone', phoneRowValue, '📞') +
    row('Email', emailRowValue, '✉️') +
    row('Location', escapeHtml(location), '📍') +
    row('Service Interest', escapeHtml(service), '✨') +
    '</table></td></tr>' +
    '<tr><td style="padding:28px 32px 32px;text-align:center;">' +
    callButton +
    emailButton +
    '</td></tr>' +
    '<tr><td style="background:#fafafa;padding:16px 32px;text-align:center;border-top:1px solid #eee;">' +
    '<p style="margin:0;font-size:12px;color:#888;line-height:1.6;">Lead captured from <strong style="color:#1a1a1a;">spacesolution.in</strong><br>Respond quickly to improve conversion.</p>' +
    '</td></tr></table></td></tr></table></body></html>'
  );
}

function jsonHeaders(request) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
  };
}

export async function handleEnquiryPost(request) {
  var headers = jsonHeaders(request);

  try {
    var body = await request.json();

    var name = body.name && body.name.trim();
    var phone = body.phone && body.phone.trim();
    var email = body.email && body.email.trim();
    var country = (body.country && body.country.trim()) || '+91';
    var location = (body.location && body.location.trim()) || '';
    var service = (body.service && body.service.trim()) || '';
    var source = (body.source && body.source.trim()) || 'enquiry';

    if (!phone && !email) {
      return new Response(JSON.stringify({ error: 'Please add a phone number or email so we can reach you.' }), {
        status: 400,
        headers: headers,
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: headers,
      });
    }

    var leadData = {
      name: name || 'Not provided',
      phone: phone,
      email: email,
      country: country,
      location: location,
      service: service,
      source: source,
    };
    var serviceLabel = service || 'General Enquiry';
    var subjectName = name || phone || email || 'New Lead';
    var subject = 'New Lead: ' + serviceLabel + ' — ' + subjectName + ' | Space Solutions';

    var emailPayload = {
      from: RESEND_FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: subject,
      html: buildLeadEmailHtml(leadData),
    };

    if (email) {
      emailPayload.reply_to = email;
    }

    var resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      var errorBody = await resendResponse.text();
      console.error('Resend error:', resendResponse.status, errorBody);
      return new Response(JSON.stringify({ error: 'Failed to send email. Please try again.' }), {
        status: 502,
        headers: headers,
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Thank you! We will contact you shortly.' }), {
      status: 200,
      headers: headers,
    });
  } catch (err) {
    console.error('Enquiry handler error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: headers,
    });
  }
}

export async function handleEnquiryOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
