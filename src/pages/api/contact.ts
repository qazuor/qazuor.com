import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

interface ContactFormData {
    name: string;
    email: string;
    company?: string;
    subject: string;
    interests: string[];
    message: string;
}

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Rate limiting: simple in-memory store (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return false;
    }

    if (record.count >= RATE_LIMIT) {
        return true;
    }

    record.count++;
    return false;
}

function validateFormData(data: unknown): { valid: boolean; errors: string[]; data?: ContactFormData } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Invalid request body'] };
    }

    const formData = data as Record<string, unknown>;

    // Required fields
    if (!formData.name || typeof formData.name !== 'string' || formData.name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!formData.email || typeof formData.email !== 'string') {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Invalid email format');
    }

    if (!formData.subject || typeof formData.subject !== 'string' || formData.subject.trim().length === 0) {
        errors.push('Subject is required');
    }

    if (!formData.message || typeof formData.message !== 'string') {
        errors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return {
        valid: true,
        errors: [],
        data: {
            name: (formData.name as string).trim(),
            email: (formData.email as string).trim().toLowerCase(),
            company: formData.company ? (formData.company as string).trim() : undefined,
            subject: (formData.subject as string).trim(),
            interests: Array.isArray(formData.interests) ? formData.interests : [],
            message: (formData.message as string).trim()
        }
    };
}

// Honeypot check - if this field has value, it's a bot
function isBot(data: Record<string, unknown>): boolean {
    return Boolean(data.website || data.url || data.honeypot);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        // Check rate limit
        const ip = clientAddress || 'unknown';
        if (isRateLimited(ip)) {
            return new Response(
                JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Parse body
        const body = await request.json();

        // Honeypot check
        if (isBot(body)) {
            // Silently accept but don't process (don't let bots know they were caught)
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate
        const validation = validateFormData(body);
        if (!validation.valid || !validation.data) {
            return new Response(JSON.stringify({ success: false, errors: validation.errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { name, email, company, subject, interests, message } = validation.data;

        // Build email content
        const interestsText = interests.length > 0 ? `\n\nInterests: ${interests.join(', ')}` : '';
        const companyText = company ? `\nCompany: ${company}` : '';

        const emailHtml = `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            ${interests.length > 0 ? `<p><strong>Interests:</strong> ${interests.join(', ')}</p>` : ''}
            <hr />
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br />')}</p>
        `;

        const emailText = `
New Contact Form Submission

From: ${name} (${email})${companyText}
Subject: ${subject}${interestsText}

Message:
${message}
        `.trim();

        // Send email via Resend
        const { error } = await resend.emails.send({
            from: import.meta.env.RESEND_FROM_EMAIL || 'Contact Form <onboarding@resend.dev>',
            to: import.meta.env.CONTACT_EMAIL || 'your@email.com',
            replyTo: email,
            subject: `[Contact] ${subject}`,
            html: emailHtml,
            text: emailText
        });

        if (error) {
            console.error('Resend error:', error);
            return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Contact API error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
