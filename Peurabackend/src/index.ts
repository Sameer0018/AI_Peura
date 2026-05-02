import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import connectDB from './lib/mongodb';

// Connect to MongoDB
connectDB();

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello from AiPeura');
});

// Routes
import ideaRoutes from './routes/idea';
import scrapeRoutes from './routes/scrape';
import notifyRoutes from './routes/notify';
import aiRoutes from './routes/ai';
import blogRoutes from './routes/blog';
import actionPlanRoutes from './routes/actionPlan';
import faqRoutes from './routes/faq';
import visualPromptRoutes from './routes/visualPrompt';
import brandRoutes from './routes/brand';

app.use('/api/idea', ideaRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/action-plan', actionPlanRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/visual-prompt', visualPromptRoutes);
app.use('/api/brand', brandRoutes);


// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
