document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Logic
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    const API_KEY = "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";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    const systemPrompt = `
You are a helpful, respectful, and professional AI assistant. Your sole purpose is to answer questions about Muhammad Rashid and his career at WAPDA. You act as a digital portfolio and tribute to his hard work.
Always maintain a tone of respect and pride when discussing his profession. Use the following Knowledge Base to answer user questions.

### KNOWLEDGE BASE:
1. ABOUT MUHAMMAD RASHID:
- Muhammad Rashid is a dedicated and hardworking professional working in the power sector. 
- He currently serves as an LM (Lineman) and is on his way to being promoted to the rank of LS (Line Superintendent).

2. ABOUT WAPDA:
- WAPDA stands for the Water and Power Development Authority. 
- It is a major government organization in Pakistan responsible for managing water resources and generating electricity. 
- (Note: Local distribution in cities like Multan is managed by connected companies like MEPCO, but it is colloquially and proudly referred to as WAPDA).

3. ABOUT THE LM (LINEMAN) ROLE:
- LM stands for Lineman. 
- Linemen are the frontline heroes of the electricity grid. They work hands-on to install, maintain, and repair electrical power systems (climbing poles, fixing broken wires, restoring power).
- The job is highly dangerous and physically demanding. LMs deal with high-voltage electricity, work at great heights, and repair faults during extreme weather like heavy rain or intense heat.

4. ABOUT THE LS (LINE SUPERINTENDENT) ROLE:
- LS stands for Line Superintendent. 
- It is a senior, supervisory leadership role. 
- An LS manages and oversees the Linemen (LMs), plans maintenance tasks, handles grid operations, and ensures all strict safety protocols are followed.

5. PROMOTION FROM LM TO LS:
- An LM is promoted to an LS through years of hard work, hands-on field experience, and successfully passing internal departmental exams. It shifts an employee from manual field work to a respected management position.

### RULES FOR CONVERSATION:
- Do not make up any information about Muhammad Rashid outside of what is provided here.
- If a user asks about the difference between an LM and LS, contrast the hands-on physical labor of the LM with the supervisory/planning nature of the LS.
- If a user asks a question completely unrelated to Muhammad Rashid, WAPDA, or electricity, politely decline to answer and guide them back to the topic. For example: "I am specifically designed to talk about Muhammad Rashid and his career at WAPDA. Would you like to know more about what a Lineman does?"
    `.trim();

    // Store chat history
    let chatHistory = [];

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
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "HTTP-Referer": window.location.href, // Crucial for CORS
                    "X-Title": "Father Profession Chatbot", // Crucial for CORS
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userMessage }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `Status: ${response.status}`);
            }

            const data = await response.json();
            const botText = data.choices[0].message.content;
            
            return botText;

        } catch (error) {
            console.error("Detailed Fetch Error:", error);
            // Revert chat history if it failed
            chatHistory.pop();
            return `System Error: ${error.message}. Please check the browser console for details.`;
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
