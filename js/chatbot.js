document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Logic
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    const GEMINI_API_KEY = "AQ.Ab8RN6JcNunp66D76jT_-hvN3j4QxGgnPeOAbJQ-0bhmuQ1dAQ";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = `
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

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        if (sender === 'user') {
            msgDiv.classList.add('user-message');
        } else {
            msgDiv.classList.add('bot-message');
        }
        // Basic HTML formatting for newlines and asterisks
        let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        msgDiv.innerHTML = formattedText;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const generateResponse = async (userMessage) => {
        try {
            // Append user message to history
            chatHistory.push({
                role: "user",
                parts: [{ text: userMessage }]
            });

            const requestBody = {
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: chatHistory,
                generationConfig: {
                    temperature: 0.7,
                }
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("API Error Details:", data);
                throw new Error(data.error?.message || "Failed to fetch response");
            }

            const botText = data.candidates[0].content.parts[0].text;
            
            // Append bot message to history
            chatHistory.push({
                role: "model",
                parts: [{ text: botText }]
            });

            return botText;

        } catch (error) {
            console.error("Chatbot Error:", error);
            // Revert chat history if it failed
            chatHistory.pop();
            return "Sorry, I encountered an error connecting to my knowledge base. Please check the API key or try again later.";
        }
    };

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatInput.value = '';
        chatInput.disabled = true;
        sendChatBtn.disabled = true;
        sendChatBtn.textContent = '...';

        const reply = await generateResponse(text);
        appendMessage(reply, 'bot');

        chatInput.disabled = false;
        sendChatBtn.disabled = false;
        sendChatBtn.textContent = 'Send';
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

    // Handle Suggested Questions
    const suggestedQuestionsDiv = document.getElementById('suggested-questions');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.textContent;
            if (suggestedQuestionsDiv) {
                suggestedQuestionsDiv.style.display = 'none';
            }
            handleSend();
        });
    });
});
