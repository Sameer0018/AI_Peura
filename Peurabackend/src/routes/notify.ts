import express from 'express';
import { sendApprovalEmail } from '../lib/notifier';
import Idea from '../models/Idea';
import connectDB from '../lib/mongodb';

const router = express.Router();

router.post('/success', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'ID is required' });

        await connectDB();
        const idea = await Idea.findById(id);
        if (!idea) return res.status(404).json({ error: 'Idea not found' });

        // Send email with the generated script
        const success = await sendApprovalEmail([idea]);
        
        if (success) {
            return res.json({ message: 'Notification sent successfully' });
        } else {
            // Log the error but don't break the user experience if generation was successful
            console.warn('Email notification failed, but idea was saved.');
            return res.json({ 
                message: 'AI generation complete, but email notification failed (Check your Brevo API key).',
                warning: 'EMAIL_FAILED'
            });
        }

    } catch (error: any) {
        console.error('Notification Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
