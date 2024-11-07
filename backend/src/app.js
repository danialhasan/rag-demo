import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai.routes.js';

const createApp = () => {
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    
    // Routes
    app.use('/ai', aiRouter);
    
    return app;
};

const startServer = (app, port = process.env.PORT || 3000) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

const app = createApp();
startServer(app);

export { app }; 