import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import logger from './helpers/logger';
import generatorRoutes from "./routes/generatorRoutes";
import generatorDocumentationRoutes from "./routes/generatorDocumentationRoutes";
import ping from "./routes/ping";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Express Server
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
logger.info(`Initializing Express server on port ${port}`)

//Apply security measures to express server
app.use(helmet());
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 100, // 100 requests,
	message: '{"status" : 409, "title": "Too many request from this IP'
});
//app.use(limiter); 
app.use(cors());


// Initialize routes
app.use('/', generatorRoutes);
app.use('/', ping);
app.use('/', generatorDocumentationRoutes);
logger.debug("Initializing routes");

// Start Express server
app.listen(port, () => {
	logger.info(`Testator listening at port ${port}`);
});