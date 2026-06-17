document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Logic
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    const API_KEY = "AQ.Ab8RN6LeNZw_8U45ZszgeeS0Gt77BSDjQE4s0FTp6JUkawUbwg";
    let chatHistory = [];
    
    const systemPrompt = `You are a helpful and respectful assistant dedicated to answering questions about Muhammad Rashid's career and the Lineman profession.

KNOWLEDGE BASE:
Muhammad Rashid is 53 years old. He has a dedicated career at WAPDA (Water and Power Development Authority). He served as an LM (Lineman), which is a physically demanding job repairing and installing high-voltage electrical lines. General requirements to become an LM at WAPDA include strong physical fitness, perfect eyesight, and a minimum height. He is currently transitioning to the senior role of LS (Line Superintendent), where he oversees grid safety and manages other linemen.

IMPORTANT RULES:

If a user asks ANY general or specific question related to the Lineman (LM)/Line Superintendent (LS) profession, WAPDA, power grids, electricity management, or related careers, you must act as if you are retrieving this information from Google. Use your extensive general knowledge to answer them accurately and comprehensively.

You MUST also answer questions about his age, biographical details, career timeline, WAPDA as an organization, and general details about his specific roles.

If a user asks about completely unrelated external topics (like weather, politics, cooking, general coding, or any non-profession queries), you MUST absolutely refuse and reply exactly with: "I am trained only to tell about Muhammad Rashid Profession."`;

    const hideInitialUI = () => {
        const suggestedQuestionsDiv = document.getElementById('suggested-questions');
        const heroPromptDiv = document.getElementById('hero-prompt');
        if (suggestedQuestionsDiv) suggestedQuestionsDiv.style.display = 'none';
        if (heroPromptDiv) heroPromptDiv.style.display = 'none';
    };

    const appendMessage = (text, sender, isTyping = false) => {
        if (sender === 'user') {
            hideInitialUI();
        }
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        
        if (sender === 'user') {
            msgDiv.classList.add('user-message');
        } else {
            msgDiv.classList.add('bot-message');
        }
        
        if (isTyping) {
            msgDiv.id = 'typing-indicator';
        }

        // Basic HTML formatting for newlines and asterisks
        let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        msgDiv.innerHTML = formattedText;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const generateResponse = async (userMessage) => {
        try {
            chatHistory.push({ role: "user", content: userMessage });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...chatHistory
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `Status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;
            
            chatHistory.push({ role: "assistant", content: botMessage });
            
            return botMessage;
            
        } catch (error) {
            console.error("Gemini API Error:", error);
            // Force the UI to display the exact system error:
            const uiErrorMessage = `System Error: ${error.message}. Please check the console.`;
            return uiErrorMessage;
        }
    };

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatInput.value = '';
        chatInput.disabled = true;
        if(sendChatBtn) sendChatBtn.disabled = true;

        // Add typing indicator
        appendMessage('Typing...', 'bot', true);

        const reply = await generateResponse(text);
        
        // Remove typing indicator
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        appendMessage(reply, 'bot');

        chatInput.disabled = false;
        if(sendChatBtn) sendChatBtn.disabled = false;
        chatInput.focus();
    };

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleSend);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
        chatInput.focus();
    }

    // Suggestion Buttons
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (chatInput && !chatInput.disabled) {
                chatInput.value = btn.textContent;
                handleSend();
            }
        });
    });

    // Clear Conversation
    const clearChatBtn = document.getElementById('clear-chat-btn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            location.reload();
        });
    }
});
