import express from 'express';
import dotenv from 'dotenv';
import authRouter from './src/routes/authRoutes.js';
import todoRouter from './src/routes/todoRouter.js';
import connectDB from './src/database/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Enable CORS for all routes




dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: '*',         // allow all origins for testing
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));


// Routes
app.use('/api/auth', authRouter); // better route naming
app.use('/api/todos', todoRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Planzee!');
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to DB:", err.message);
});
