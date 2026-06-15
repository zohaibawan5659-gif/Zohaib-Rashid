document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Logic
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    const API_KEY = "AQ.Ab8RN6KG9jdGNo0hjhAseFfMHsIwdlF-8Sk9yD-Byg3Ou__fFw";
    
    const systemPrompt = "You are a respectful assistant answering questions about Muhammad Rashid's career. He works at WAPDA. He currently serves as an LM (Lineman), repairing high-voltage electrical lines, and is transitioning to an LS (Line Superintendent) role, overseeing grid safety.";

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
            // NOTE: Using gemini-2.5-flash because 1.5-flash is no longer available on this tier and returns 404
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt + "\n\nUser Question: " + userMessage
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `Status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text;
            
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
