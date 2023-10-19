import { Router} from 'express';
import dotenv from 'dotenv';
import logger from '../helpers/logger';
dotenv.config();
import { verifyAuthToken } from '../middleware/auth';
import { generateDocFeatures } from './generatorDocumentatorFeatures';
import { generateDocIniciative } from './generatorDocumentatorIniciative';
import { generateDocUserStory } from './generatorDocumentatorUserStory';
import fs from 'fs';
import archiver from 'archiver';

const router: Router = Router();

router.post('/generateDocumentation', verifyAuthToken, async (req, res) => {
    logger.debug(`POST /generateDocumentation`);

    try {
        // Get data from the request body (assuming it's a JSON object)
        const data = req.body;
        logger.debug(`Received data from client`);

        const iniciativeData = { ...data };

        delete iniciativeData.features;

        const resultIniciative = await generateDocIniciative(iniciativeData);
        fs.writeFileSync('resultIniciative.md', resultIniciative);

        for (const feature of data.features) {
            const featureFileName = `${feature.name}.md`;
            try {
                const featureContent = await generateDocFeatures(feature);
                fs.writeFileSync(featureFileName, featureContent);
                console.log(`Generated documentation for feature: ${feature.name}`);
            } catch (error) {
                console.error(`Error generating documentation for feature ${feature.name}: ${error.message}`);
            }
    
            for (const userStory of feature.userStories) {
                const userStoryFileName = `${userStory.name}.md`;
                try {
                    const userStoryContent = await generateDocUserStory(userStory);
                    fs.writeFileSync(userStoryFileName, userStoryContent);
                    console.log(`Generated documentation for user story: ${userStory.name}`);
                } catch (error) {
                    console.error(`Error generating documentation for user story ${userStory.name}: ${error.message}`);
                }
            }
        }

        // Crear un archivo zip y agregar los archivos .md
        const output = fs.createWriteStream('output.zip');
        const archive = archiver('zip', {
            zlib: { level: 9 } // Nivel de compresión
        });
        archive.pipe(output);

        // Agregar los archivos .md al archivo zip
        archive.file('resultIniciative.md', { name: 'resultIniciative.md' });
        for (const feature of data.features) {
            const featureFileName = `${feature.name}.md`;
            archive.file(featureFileName, { name: featureFileName });

            for (const userStory of feature.userStories) {
                const userStoryFileName = `${userStory.name}.md`;
                archive.file(userStoryFileName, { name: userStoryFileName });
            }
        }

        // Finalizar y enviar el archivo zip como respuesta al usuario
        archive.finalize();

        // Enviar el archivo zip como respuesta al usuario
        output.on('close', () => {
            const zipFile = fs.readFileSync('output.zip');
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename=output.zip');
            res.send(zipFile);
        });

        logger.debug(`Received data from OpenAI`);

    } catch (error) {

        logger.error(`Error generating test. Error: ${error}`);
        return res.status(422).send({ error: 'Invalid JSON data' });
    }
});

export default router;
