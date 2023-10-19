import dotenv from 'dotenv';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from "langchain/chains";
import logger from '../helpers/logger';
dotenv.config();
import { prompts } from '../config/prompts';
import { ChatOpenAI } from "langchain/chat_models/openai";

// Inicializar el modelo y la plantilla del prompt
const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: process.env.OPENAI_API_MODEL
});

const promptTemplate = PromptTemplate.fromTemplate(prompts.documentadorTemplateUserStories);

export async function generateDocUserStory(data: any): Promise<string> {
    try {
        const chain = new LLMChain({
            llm: model,
            prompt: promptTemplate,
            verbose: false
        });

        const result = await chain.call({
            InputJSONUserStories: prompts.InputJSONUserStories,
            UserStoryJSON: JSON.stringify(data),
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
        logger.error(`Error generating user story document. Error: ${error}`);
        throw new Error('Error generating user story document');
    }
}
export default generateDocUserStory;

