const createMessageElement = (text, type) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    return messageDiv;
};

const appendMessage = (container, messageElement) => {
    container.appendChild(messageElement);
    container.scrollTop = container.scrollHeight;
    return messageElement;
};

const processStreamChunk = async (reader, decoder, aiMessageElement) => {
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6));
                if (data === '[DONE]') break;
                
                aiMessageElement.textContent += data.content;
            }
        }
    }
};

const sendQuery = async (query, aiMessageElement) => {
    try {
        const response = await fetch('http://localhost:3000/ai/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        await processStreamChunk(reader, decoder, aiMessageElement);
    } catch (error) {
        console.error('Error:', error);
        aiMessageElement.textContent = 'Error processing your request.';
    }
};

const initializeChatUI = () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');

    const handleSubmit = async () => {
        const query = userInput.value.trim();
        if (!query) return;

        // Add user message
        appendMessage(chatContainer, createMessageElement(query, 'user'));
        userInput.value = '';

        // Create and add AI message
        const aiMessageElement = appendMessage(chatContainer, createMessageElement('', 'ai'));
        await sendQuery(query, aiMessageElement);
    };

    submitBtn.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
    });
};

// Initialize chat UI
initializeChatUI(); 