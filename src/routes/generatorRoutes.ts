import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from "langchain/chains";
import logger from '../helpers/logger';
dotenv.config();
import { prompts } from '../config/prompts';
import { verifyAuthToken } from '../middleware/auth';
import multer from 'multer';
import xlsx from 'xlsx';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createObjectCsvWriter } from 'csv-writer';
const archiver = require('archiver');
import * as fs from 'fs';





const router: Router = Router();
const upload = multer({ dest: 'uploads/' });

// Initialize the model
const model = new ChatOpenAI({
	temperature: 0,
	modelName: process.env.OPENAI_API_MODEL
});


/**
 * This endpoint generates the features and user stories detailed from the ideas provided in the xlsx file
 * @body {xlsx} file - The file with the ideas to generate the features and user stories
 * @header {string} token - The token to authenticate the user
 * @returns {object} - The feature and user stories generated
 */
router.post('/generate', upload.single('file'), verifyAuthToken, async (req, res) => {
	logger.debug(`POST /generate`);

	// Initialize the prompt template
	const promptTemplate = PromptTemplate.fromTemplate(prompts.userStoriesTemplate);

	try{
		// Read the excel file and convert it to JSON
		const file = req.file;
		const workbook = xlsx.readFile(file.path);
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = xlsx.utils.sheet_to_json(sheet);	

		// Initialize the chain
		const chain = new LLMChain({ llm: model, prompt: promptTemplate});

		const result = await chain.call({ 
			inceptionIdeas: JSON.stringify(data), 
			outputExample: prompts.outputExample, 
			callbacks: [{
				handleLLMEnd: (output) => {
				  const { completionTokens, promptTokens, totalTokens } = output.llmOutput?.tokenUsage; 
				  logger.info(`Total tokens: ${totalTokens}. Prompt tokens: ${promptTokens} + Completion tokens: ${completionTokens}.`);
				},
			}]});

		logger.debug(`Received data from OpenAI`);
		const resultJson = JSON.parse(result.text);

		return res.status(200).send(resultJson);
		
	} catch (error) {

		logger.error(`Error generating the Features and User Sories. Error: ${error}`);
		return res.status(422).send({ error: 'Error generating the Features and User Sories'});
	}

});



/**
 * @body {object} iniciativeData - The data of the initiative to generate the documentation
 * @header {string} token - The token to authenticate the user
 * @returns {zip} - The 3 csv files generated to be imported on Rally
 */
router.post('/generate/rally', verifyAuthToken, async (req, res) => {
	logger.debug(`POST /generate/rally`);
	try{
		// Get the title, description and features from the request body
		const iniciativeData = req.body;

		// Check if the data is valid
		if (!iniciativeData.title || !iniciativeData.description || !iniciativeData.features) {
			return res.status(422).send({ error: 'Incorrect input data type' });
		}
		for (const feature of iniciativeData.features) {
			if (!feature.name || !feature.description || !feature.userStories) {
				return res.status(422).send({ error: 'Incorrect input data type' });
			}
			for (const userStory of feature.userStories) {
				if (!userStory.name || !userStory.description || !userStory.definitionOfReady || !userStory.definitionOfDone || !userStory.hours) {
					return res.status(422).send({ error: 'Incorrect input data type' });
				}
			}
		}
		///////////////////////////////
		// Generate Initiative CSV ////
		/////////////////////////////
		const initiativeCsvWriter = createObjectCsvWriter({
			path: 'initiative.csv',
			header: [
			  { id: 'name', title: 'Name' },
			  { id: 'description', title: 'Description' },
			  { id: 'portfolioItemType', title: 'Portfolio Item Type' },

			],
		  });
		  
		const initiativeRecords = [];

		initiativeRecords.push({
			name: iniciativeData.title,
			description: iniciativeData.description,
			portfolioItemType: 'Initiative',
		});
		
		await initiativeCsvWriter.writeRecords(initiativeRecords);

		///////////////////////////////
		//Generate Features CSV  //////
		///////////////////////////////
		const featuresCsvWriter = createObjectCsvWriter({
			path: 'features.csv',
			header: [
				{ id: 'parent', title: 'Parent' },
				{ id: 'name', title: 'Name' },
				{ id: 'description', title: 'Description' },
				{ id: 'portfolioItemType', title: 'Portfolio Item Type' },

			],
		  });

		const featuresRecords = [];

		for(const feature of iniciativeData.features){
			featuresRecords.push({
				parent: iniciativeData.title,
				name: feature.name,
				description: feature.description,
				portfolioItemType: 'Feature',
			});
		}
		  
		await featuresCsvWriter.writeRecords(featuresRecords);
  

		///////////////////////////////
		//Generate User Story CSV ////
		///////////////////////////////
		const userStoriesCsvWriter = createObjectCsvWriter({
			path: 'userStories.csv',
			header: [
				{ id: 'parent', title: 'Parent' },
				{ id: 'name', title: 'Name' },
				{ id: 'description', title: 'Description' },
				{ id: 'definitionOfReady', title: 'Definition of Ready' },
				{ id: 'definitionOfDone', title: 'Definition of Done' },
				{ id: 'planEstimate', title: 'Plan Estimate' },

			],
		  });
		  
		  const userStoriesRecords = [];
		  
		  for (const feature of iniciativeData.features) {
			for (const userStory of feature.userStories) {
				userStoriesRecords.push({
					parent: feature.name,
					name: userStory.name,
					description: userStory.description,
					definitionOfReady: userStory.definitionOfReady,
					definitionOfDone: userStory.definitionOfDone,
					planEstimate: userStory.hours,
			  });
			}
		  }
		await userStoriesCsvWriter.writeRecords(userStoriesRecords);


	// Create a new archive
	const zip = archiver('zip', { zlib: { level: 9 } });
	const zipName = 'output.zip';
	const zipStream = fs.createWriteStream(zipName);

	// Add the files to the zip archive
	zip.file('initiative.csv', { name: 'initiative.csv' });
	zip.file('features.csv', { name: 'features.csv' });
	zip.file('userStories.csv', { name: 'userStories.csv' });


	// Send the zip archive to the client
	zip.pipe(zipStream);
	zip.finalize();
	zipStream.on('close', () => {
		res.attachment(zipName);
		res.sendFile(zipName, { root: '.' });
	});

	} catch (error) {
		logger.error(`Error generating csv files. Error: ${error}`);
		return res.status(422).send({ error: 'Error generatinc cvs files' });
	}

});


export default router;