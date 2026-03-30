const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_WEBSITE = 'JBLS Website <onboarding@resend.dev>';
const FROM_ORDERS  = 'JBLS Orders <onboarding@resend.dev>';
const FROM_JBLS    = 'James Brown Life Sciences <onboarding@resend.dev>';

const ADMIN  = process.env.ADMIN_EMAIL  || process.env.SMTP_USER;
const HR     = process.env.HR_EMAIL     || ADMIN;
const ORDERS = process.env.ORDERS_EMAIL || ADMIN;

// ── Contact notification ───────────────────────────────────────────────────────
const sendContactNotification = async (data) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY not configured — skipping contact email');
        return;
    }

    const typeLabels = {
        order:       '💊 Product Order / Supply',
        partner:     '🤝 Distribution Partnership',
        medical:     '🩺 Medical / Clinical Query',
        regulatory:  '📋 Regulatory & Compliance',
        pharmacovig: '⚠️  Pharmacovigilance / ADR',
        general:     '💬 General Enquiry',
    };

    // Notify admin
    await resend.emails.send({
        from:    FROM_WEBSITE,
        to:      ADMIN,
        subject: `${data.urgent ? '🚨 URGENT — ' : ''}New ${typeLabels[data.inquiryType] || 'Contact'} from ${data.firstName} ${data.lastName}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">James Brown Life Sciences</h2>
                    <p style="color:#94A3B8;margin:4px 0 0;font-size:13px">New contact form submission</p>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none">
                    ${data.urgent ? '<div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:10px 14px;margin-bottom:16px;color:#92400E;font-weight:600">⚡ Marked as URGENT by sender</div>' : ''}
                    <table style="width:100%;border-collapse:collapse;font-size:14px">
                        <tr><td style="padding:8px 0;color:#64748B;width:140px">Type</td><td style="padding:8px 0;font-weight:600">${typeLabels[data.inquiryType] || data.inquiryType}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Name</td><td style="padding:8px 0;font-weight:600">${data.firstName} ${data.lastName}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Phone</td><td style="padding:8px 0">${data.phone || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Organisation</td><td style="padding:8px 0">${data.company || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Job Title</td><td style="padding:8px 0">${data.jobTitle || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Country</td><td style="padding:8px 0">${data.country}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Subject</td><td style="padding:8px 0;font-weight:600">${data.subject}</td></tr>
                    </table>
                    <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px">
                        <p style="margin:0 0 6px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Message</p>
                        <p style="margin:0;white-space:pre-wrap;font-size:14px;color:#1E293B">${data.message}</p>
                    </div>
                    <p style="margin:16px 0 0;font-size:12px;color:#94A3B8">Submitted: ${new Date().toUTCString()}</p>
                </div>
            </div>
        `,
    });

    // Auto-reply to sender
    await resend.emails.send({
        from:    FROM_WEBSITE,
        to:      data.email,
        subject: `We received your message — James Brown Life Sciences`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">James Brown Life Sciences</h2>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
                    <p style="color:#1E293B;font-size:15px">Dear ${data.firstName},</p>
                    <p style="color:#475569;font-size:14px;line-height:1.6">Thank you for contacting James Brown Life Sciences. We have received your message and our team will respond within <strong>1–2 business days</strong>.</p>
                    <p style="color:#475569;font-size:14px;line-height:1.6">For urgent medical matters or adverse drug reactions, please call our 24/7 helpline: <strong>+91 97998 32489</strong>.</p>
                    <div style="margin:20px 0;padding:16px;background:#EFF6FF;border-left:4px solid #0EA5E9;border-radius:0 8px 8px 0">
                        <p style="margin:0;font-size:13px;color:#1E40AF">Your reference: <strong>${data.subject}</strong></p>
                    </div>
                    <p style="color:#94A3B8;font-size:12px;margin:20px 0 0">James Brown Life Sciences · Khatipura, Jaipur, Rajasthan 302012</p>
                </div>
            </div>
        `,
    });

    console.log(`📧 Contact notification sent for ${data.email}`);
};

// ── Career notification ────────────────────────────────────────────────────────
const sendCareerNotification = async (data) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY not configured — skipping career email');
        return;
    }

    // Notify HR
    await resend.emails.send({
        from:    FROM_WEBSITE,
        to:      HR,
        subject: `New Application — ${data.position} | ${data.firstName} ${data.lastName}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">New Job Application</h2>
                    <p style="color:#94A3B8;margin:4px 0 0;font-size:13px">James Brown Life Sciences — Careers Portal</p>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
                    <table style="width:100%;border-collapse:collapse;font-size:14px">
                        <tr><td style="padding:8px 0;color:#64748B;width:160px">Position</td><td style="padding:8px 0;font-weight:600;color:#0EA5E9">${data.position}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Department</td><td style="padding:8px 0">${data.department || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Name</td><td style="padding:8px 0;font-weight:600">${data.firstName} ${data.lastName}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Phone</td><td style="padding:8px 0">${data.phone}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Experience</td><td style="padding:8px 0">${data.experience || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Current Company</td><td style="padding:8px 0">${data.currentCompany || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Notice Period</td><td style="padding:8px 0">${data.noticePeriod || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Work Auth</td><td style="padding:8px 0">${data.workAuth || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Relocate?</td><td style="padding:8px 0">${data.relocate || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Source</td><td style="padding:8px 0">${data.referral || '—'}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748B">Resume</td><td style="padding:8px 0"><a href="${data.resumeLink}" target="_blank">View Resume</a></td></tr>
                        ${data.linkedIn ? `<tr><td style="padding:8px 0;color:#64748B">LinkedIn</td><td style="padding:8px 0"><a href="${data.linkedIn}" target="_blank">View Profile</a></td></tr>` : ''}
                        ${data.portfolio ? `<tr><td style="padding:8px 0;color:#64748B">Portfolio</td><td style="padding:8px 0"><a href="${data.portfolio}" target="_blank">View</a></td></tr>` : ''}
                    </table>
                    <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px">
                        <p style="margin:0 0 6px;color:#64748B;font-size:12px;text-transform:uppercase">Why JBLS?</p>
                        <p style="margin:0;font-size:14px;color:#1E293B;white-space:pre-wrap">${data.whyUs}</p>
                    </div>
                    <div style="margin-top:12px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px">
                        <p style="margin:0 0 6px;color:#64748B;font-size:12px;text-transform:uppercase">Key Achievement</p>
                        <p style="margin:0;font-size:14px;color:#1E293B;white-space:pre-wrap">${data.rightFit}</p>
                    </div>
                    <p style="margin:16px 0 0;font-size:12px;color:#94A3B8">Submitted: ${new Date().toUTCString()}</p>
                </div>
            </div>
        `,
    });

    // Auto-reply to applicant
    await resend.emails.send({
        from:    FROM_WEBSITE,
        to:      data.email,
        subject: `Application Received — ${data.position} | James Brown Life Sciences`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">Application Received</h2>
                    <p style="color:#94A3B8;margin:4px 0 0;font-size:13px">James Brown Life Sciences — Careers</p>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
                    <p style="color:#1E293B;font-size:15px">Dear ${data.firstName},</p>
                    <p style="color:#475569;font-size:14px;line-height:1.6">Thank you for applying for the <strong>${data.position}</strong> role at James Brown Life Sciences. We've received your application and our talent team will review it carefully.</p>
                    <p style="color:#475569;font-size:14px;line-height:1.6">You can expect to hear from us within <strong>5–7 business days</strong>.</p>
                    <div style="margin:20px 0;padding:16px;background:#F0FDF4;border-left:4px solid #22C55E;border-radius:0 8px 8px 0">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#15803D">What happens next</p>
                        <ol style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#166534;line-height:1.8">
                            <li>Application review by our talent team</li>
                            <li>Initial HR screening call (30 min)</li>
                            <li>Technical / panel interview</li>
                            <li>Offer & onboarding</li>
                        </ol>
                    </div>
                    <p style="color:#94A3B8;font-size:12px;margin:20px 0 0">James Brown Life Sciences · Careers Team</p>
                </div>
            </div>
        `,
    });

    console.log(`📧 Career notification sent for ${data.email} — ${data.position}`);
};

// ── Order notification ─────────────────────────────────────────────────────────
const sendOrderNotification = async (order) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY not configured — skipping order email');
        return;
    }

    const itemsHtml = order.items.map((item) => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #E2E8F0">${item.medicineName}</td>
            <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:center">${item.dosageForm || '—'}</td>
            <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right">₹${item.pricePerUnit.toLocaleString('en-IN')}</td>
            <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;font-weight:600">₹${item.subtotal.toLocaleString('en-IN')}</td>
        </tr>
    `).join('');

    // Notify company
    await resend.emails.send({
        from:    FROM_ORDERS,
        to:      ORDERS,
        subject: `🛒 New Order ${order.orderNumber} — ${order.customerName}`,
        html: `
            <div style="font-family:sans-serif;max-width:650px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">New Order Received</h2>
                    <p style="color:#94A3B8;margin:4px 0 0;font-size:13px">James Brown Life Sciences — Order Management</p>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
                    <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">
                        <div style="background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;flex:1;min-width:140px">
                            <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:.05em">Order No.</p>
                            <p style="margin:4px 0 0;font-weight:700;color:#0EA5E9;font-size:15px">${order.orderNumber}</p>
                        </div>
                        <div style="background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;flex:1;min-width:140px">
                            <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:.05em">Total</p>
                            <p style="margin:4px 0 0;font-weight:700;color:#10B981;font-size:15px">₹${order.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div style="background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;flex:1;min-width:140px">
                            <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:.05em">Status</p>
                            <p style="margin:4px 0 0;font-weight:700;color:#F59E0B;font-size:15px">Pending</p>
                        </div>
                    </div>
                    <h3 style="font-size:14px;color:#1E293B;margin:0 0 8px">Customer Details</h3>
                    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px">
                        <tr><td style="padding:6px 0;color:#64748B;width:130px">Name</td><td style="padding:6px 0;font-weight:600">${order.customerName}</td></tr>
                        <tr><td style="padding:6px 0;color:#64748B">Email</td><td style="padding:6px 0"><a href="mailto:${order.email}">${order.email}</a></td></tr>
                        <tr><td style="padding:6px 0;color:#64748B">Phone</td><td style="padding:6px 0;font-weight:600">${order.phone}</td></tr>
                        <tr><td style="padding:6px 0;color:#64748B">Delivery Address</td><td style="padding:6px 0">${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}, ${order.address.city}, ${order.address.state} ${order.address.pincode}, ${order.address.country}</td></tr>
                        ${order.notes ? `<tr><td style="padding:6px 0;color:#64748B">Notes</td><td style="padding:6px 0">${order.notes}</td></tr>` : ''}
                    </table>
                    <h3 style="font-size:14px;color:#1E293B;margin:0 0 8px">Order Items</h3>
                    <table style="width:100%;border-collapse:collapse;font-size:13px">
                        <thead><tr style="background:#F1F5F9">
                            <th style="padding:8px;text-align:left;font-weight:600;color:#475569">Medicine</th>
                            <th style="padding:8px;text-align:center;font-weight:600;color:#475569">Form</th>
                            <th style="padding:8px;text-align:center;font-weight:600;color:#475569">Qty</th>
                            <th style="padding:8px;text-align:right;font-weight:600;color:#475569">Unit Price</th>
                            <th style="padding:8px;text-align:right;font-weight:600;color:#475569">Subtotal</th>
                        </tr></thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot><tr>
                            <td colspan="4" style="padding:10px 8px;text-align:right;font-weight:700;font-size:14px">Total</td>
                            <td style="padding:10px 8px;text-align:right;font-weight:700;font-size:15px;color:#10B981">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                        </tr></tfoot>
                    </table>
                    <p style="margin:16px 0 0;font-size:12px;color:#94A3B8">Placed: ${new Date(order.createdAt).toUTCString()}</p>
                </div>
            </div>
        `,
    });

    // Confirm to customer
    await resend.emails.send({
        from:    FROM_ORDERS,
        to:      order.email,
        subject: `Order Confirmed — ${order.orderNumber} | James Brown Life Sciences`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h2 style="color:#38BDF8;margin:0;font-size:18px">Order Confirmed</h2>
                    <p style="color:#94A3B8;margin:4px 0 0">James Brown Life Sciences</p>
                </div>
                <div style="background:#F8FAFC;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
                    <p style="color:#1E293B;font-size:15px">Dear ${order.customerName},</p>
                    <p style="color:#475569;font-size:14px;line-height:1.6">Your order has been received and is being processed. Our team will contact you shortly to confirm delivery.</p>
                    <div style="background:#F0FDF4;border-left:4px solid #22C55E;border-radius:0 8px 8px 0;padding:14px 16px;margin:16px 0">
                        <p style="margin:0;font-size:13px;font-weight:700;color:#15803D">Order Reference: ${order.orderNumber}</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#166534">Total: ₹${order.totalAmount.toLocaleString('en-IN')} · ${order.items.length} item${order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <p style="color:#475569;font-size:14px;line-height:1.6">Delivering to: <strong>${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.pincode}</strong></p>
                    <p style="color:#94A3B8;font-size:12px;margin:20px 0 0">For queries: supportjamesbrown@gmail.com | +91 97998 32489</p>
                </div>
            </div>
        `,
    });

    console.log(`📧 Order notification sent for ${order.orderNumber}`);
};

// ── Welcome email ──────────────────────────────────────────────────────────────
const sendWelcomeEmail = async (user) => {
    if (!process.env.RESEND_API_KEY) return;

    await resend.emails.send({
        from:    FROM_JBLS,
        to:      user.email,
        subject: `Welcome to James Brown Life Sciences, ${user.firstName}!`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0F172A;padding:28px 32px;border-radius:16px 16px 0 0;text-align:center">
                    <h1 style="color:#38BDF8;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px">James Brown Life Sciences</h1>
                    <p style="color:#94A3B8;margin:6px 0 0;font-size:13px">Pharmaceutical Excellence</p>
                </div>
                <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px">
                    <p style="color:#1E293B;font-size:16px;font-weight:700">Welcome aboard, ${user.firstName}! 👋</p>
                    <p style="color:#475569;font-size:14px;line-height:1.7">Your account has been created successfully. You can now browse our pharmaceutical catalogue and place bulk medicine orders directly through the portal.</p>
                    <div style="background:#EFF6FF;border-left:4px solid #0EA5E9;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0">
                        <p style="margin:0;font-size:13px;color:#1E40AF;font-weight:700">What you can do now:</p>
                        <ul style="margin:8px 0 0;padding-left:18px;color:#3B82F6;font-size:13px;line-height:2">
                            <li>Browse 200+ pharmaceutical formulations</li>
                            <li>Place bulk medicine orders online</li>
                            <li>Track your order status in real time</li>
                            <li>Contact our team for partnership enquiries</li>
                        </ul>
                    </div>
                    <p style="color:#475569;font-size:14px;line-height:1.7">For any assistance, reach us at <a href="mailto:supportjamesbrown@gmail.com" style="color:#0EA5E9">supportjamesbrown@gmail.com</a> or call <strong>+91 97998 32489</strong>.</p>
                    <p style="color:#94A3B8;font-size:12px;margin:24px 0 0;border-top:1px solid #E2E8F0;padding-top:16px">James Brown Life Sciences · Khatipura, Jaipur, Rajasthan 302012 · Mon–Sat 9am–6pm IST</p>
                </div>
            </div>
        `,
    });

    console.log(`📧 Welcome email sent to ${user.email}`);
};

module.exports = { sendContactNotification, sendCareerNotification, sendOrderNotification, sendWelcomeEmail };