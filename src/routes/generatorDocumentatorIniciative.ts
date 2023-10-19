import dotenv from 'dotenv';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from "langchain/chains";
import logger from '../helpers/logger';
dotenv.config();
import { prompts } from '../config/prompts';
import { ChatOpenAI } from "langchain/chat_models/openai";

// Inicializar el modelo y la plantilla del prompt
const model = new ChatOpenAI({
    temperature: 0,
    modelName: process.env.OPENAI_API_MODEL
});

const promptTemplate = PromptTemplate.fromTemplate(prompts.documentatorTemplateIniciative);

export async function generateDocIniciative(data: any): Promise<string> {
    try {
        const chain = new LLMChain({
            llm: model,
            prompt: promptTemplate,
            verbose: false
        });

        const result = await chain.call({
            iniciativeJSON: data,
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
        logger.error(`Error generating initiative document. Error: ${error}`);
        throw new Error('Error generating initiative document');
    }
}

export default generateDocIniciative;

