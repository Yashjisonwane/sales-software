// ============================================================
// NOTIFICATION SERVICE — Mock Email, SMS, App Notifications
// ============================================================

/**
 * Mock Email Notification
 * In production: replace with nodemailer / SendGrid API call
 */
const sendEmail = async ({ to, subject, body }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
            console.log(`[EMAIL] Body: ${body}`);
            resolve({ success: true, channel: 'email', to });
        }, 50);
    });
};

/**
 * Mock SMS Notification
 * In production: replace with Twilio / AWS SNS API call
 */
const sendSMS = async ({ to, message }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[SMS] To: ${to} | Message: ${message}`);
            resolve({ success: true, channel: 'sms', to });
        }, 50);
    });
};

/**
 * Mock In-App Push Notification
 * In production: replace with Firebase FCM / OneSignal
 */
const sendAppNotification = async ({ userId, title, body, data }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[APP NOTIFICATION] User: ${userId} | ${title}: ${body}`);
            resolve({ success: true, channel: 'app', userId });
        }, 50);
    });
};

/**
 * Send all notifications for a new lead assignment to a professional.
 * Respects the professional's own notification preferences.
 *
 * @param {Object} professional - The professional object
 * @param {Object} lead - The lead object
 * @returns {Object} Results of each notification channel
 */
export const notifyProfessional = async (professional, lead) => {
    const prefs = professional.notificationPrefs || { email: true, sms: true, app: true };
    const results = {};

    const subject = `New ${lead.serviceCategory} Lead Available — Act Fast!`;
    const emailBody = `
Hi ${professional.name},

A new service request matching your specialty has just come in!

📋 Service: ${lead.serviceCategory}
📍 Location: ${lead.location}
👤 Customer: ${lead.customerName}
💰 Budget: ${lead.budget}
⚡ Urgency: ${lead.urgency}

Description: ${lead.description}

Log in to your dashboard to accept or reject this lead within 24 hours.
`;

    const smsMessage = `New ${lead.serviceCategory} lead in ${lead.location}! Budget: ${lead.budget}. Log in to LeadMarket to accept.`;

    if (prefs.email) {
        results.email = await sendEmail({ to: professional.email, subject, body: emailBody });
    }

    if (prefs.sms) {
        results.sms = await sendSMS({ to: professional.phone, message: smsMessage });
    }

    if (prefs.app) {
        results.app = await sendAppNotification({
            userId: professional.id,
            title: `New Lead: ${lead.serviceCategory}`,
            body: `Customer in ${lead.location} needs help. Tap to view.`,
            data: { leadId: lead.id, category: lead.serviceCategory },
        });
    }

    return results;
};

/**
 * Send a confirmation notification to the customer after a lead is submitted.
 * @param {Object} lead - The submitted lead object
 * @param {number} professionalCount - How many professionals were notified
 */
export const notifyCustomer = async (lead, professionalCount) => {
    const subject = `Your Service Request Has Been Received!`;
    const body = `
Hi ${lead.customerName},

Your ${lead.serviceCategory} service request has been submitted successfully!

We have notified ${professionalCount} nearby professional(s) about your request. You will receive contact from them shortly.

📋 Request ID: ${lead.id}
📍 Address: ${lead.location}
⚡ Urgency: ${lead.urgency}

Thank you for using LeadMarket!
`;

    console.log(`[EMAIL] Confirmation sent to customer: ${lead.customerEmail}`);
    return sendEmail({ to: lead.customerEmail, subject, body });
};

export default { notifyProfessional, notifyCustomer };
