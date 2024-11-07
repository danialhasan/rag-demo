import OpenAI from 'openai';
import { getRelevantContext } from '../services/knowledge.service.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const createChatCompletion = async (context, query) => {
    return openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant. Use the following context to answer questions: ${context}`
            },
            {
                role: "user",
                content: query
            }
        ],
        stream: true
    });
};

const streamResponse = async (stream, res) => {
    try {
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        throw new Error('Error streaming response');
    }
};

const setStreamHeaders = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
};

const processRagQuery = async (req, res) => {
    const { query } = req.body;
    
    try {
        setStreamHeaders(res);
        const context = getRelevantContext(query);
        const stream = await createChatCompletion(context, query);
        await streamResponse(stream, res);
    } catch (error) {
        console.error('Error processing RAG query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { processRagQuery }; 