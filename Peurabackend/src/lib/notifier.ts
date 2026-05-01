import { BrevoClient } from '@getbrevo/brevo';

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY || ''
});

export async function sendApprovalEmail(scripts: any[]) {
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY.includes('your_')) {
        console.warn('Brevo API key not set. Skipping email notification.');
        return;
    }

    const scriptCards = scripts.map(item => {
        const displaySummary = (item.description || item.summary || '').substring(0, 100);
        const displayTitle = item.title || 'New Content Idea';
        
        return `
            <div style="background: #ffffff; border-radius: 16px; margin-bottom: 30px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
                <div style="background: #000; padding: 15px 20px;">
                    <h3 style="color: #ffffff; margin: 0; font-family: sans-serif;">${displayTitle}</h3>
                </div>
                <div style="padding: 20px;">
                    <p style="color: #666; font-size: 13px;"><strong>Inspiration:</strong> ${displaySummary}...</p>
                    <div style="background: #f8fafc; border-left: 4px solid #000; padding: 15px; border-radius: 8px;">
                        <p><strong>🎬 REEL SCRIPT</strong></p>
                        <p><strong>Hook:</strong> ${item.script?.hook}</p>
                        <p><strong>Mid:</strong> ${item.script?.mid}</p>
                        <p><strong>CTA:</strong> ${item.script?.cta}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const htmlContent = `
        <html>
        <body style="background-color: #f1f5f9; padding: 40px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto;">
                <h1 style="text-align: center;">PEURA OPTICALS</h1>
                ${scriptCards}
            </div>
        </body>
        </html>
    `;

    const recipientEmails = (process.env.RECIPIENT_EMAILS || '').split(',').map(email => email.trim());
    const toRecipients = recipientEmails.map(email => ({ email }));

    try {
        await client.transactionalEmails.sendTransacEmail({
            subject: "✨ NEW: Viral Reel Scripts for Peura Opticals",
            htmlContent: htmlContent,
            sender: { name: "Peura AI", email: process.env.SENDER_EMAIL || 'info@peura.com' },
            to: toRecipients
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
