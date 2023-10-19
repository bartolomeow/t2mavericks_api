import dotenv from 'dotenv';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from "langchain/chains";
import logger from '../helpers/logger';
dotenv.config();
import { prompts } from '../config/prompts';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { generateDocIniciative } from './generatorDocumentatorIniciative';

// Inicializar el modelo y la plantilla del prompt
const model = new ChatOpenAI({
    temperature: 0,
    modelName: process.env.OPENAI_API_MODEL
});

const promptTemplate = PromptTemplate.fromTemplate(prompts.documentatorTemplateFeatures);

export async function generateDocFeatures(data: any): Promise<string> {
    try {
        const chain = new LLMChain({
            llm: model,
            prompt: promptTemplate,
            verbose: false
        });

        const result = await chain.call({
            FeatureJSON: JSON.stringify(data),
            InputJSONFeatures: prompts.InputJSONFeatures,
            callbacks: [{
                handleLLMEnd: (output) => {
                    const { completionTokens, promptTokens, totalTokens } = output.llmOutput?.tokenUsage;
                    logger.info(`Total tokens: ${totalTokens}. Prompt tokens: ${promptTokens} + Completion tokens: ${completionTokens}.`);
                },
            }]
        });

        logger.debug(`Received data from OpenAI`);

        return result.text;
    } catch (error) {
        logger.error(`Error generating document features. Error: ${error}`);
        throw new Error('Error generating document features');
    }
}
export default generateDocFeatures;

