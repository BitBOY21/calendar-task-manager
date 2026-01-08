const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini Client (ensure API key is set in environment variables)
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Receives a task object (or string title) and returns a list of steps (subtasks)
 * @param {string|object} taskInput - Can be a string title OR object { title, description, priority, tags }
 * @returns {Promise<string[]>} Array of steps
 */
const generateBreakdown = async (taskInput) => {

    // --- 1. Handle Input (Object or String) ---
    // This ensures backward compatibility if other parts of the app send just a string
    const title = typeof taskInput === 'string' ? taskInput : taskInput.title;
    const description = taskInput.description || '';
    const priority = taskInput.priority || '';
    const tags = (taskInput.tags && Array.isArray(taskInput.tags)) ? taskInput.tags.join(', ') : '';

    // --- 2. Enhanced Mock Logic (Preserved) ---
    const getMockSteps = (t) => {
        const lowerTitle = t.toLowerCase();

        if (lowerTitle.includes("buy") || lowerTitle.includes("shop")) {
            return [
                `Make a list of items needed for "${t}"`,
                `Check budget and prices`,
                `Go to the store or order online`,
                `Verify all items were purchased`
            ];
        }

        if (lowerTitle.includes("meeting") || lowerTitle.includes("call")) {
            return [
                `Prepare agenda for "${t}"`,
                `Send calendar invites to participants`,
                `Gather necessary documents/reports`,
                `Write down key takeaways after the meeting`
            ];
        }

        if (lowerTitle.includes("clean") || lowerTitle.includes("wash")) {
            return [
                `Gather cleaning supplies`,
                `Clear the area for "${t}"`,
                `Perform the cleaning task`,
                `Dispose of trash and put supplies away`
            ];
        }

        if (lowerTitle.includes("study") || lowerTitle.includes("learn")) {
            return [
                `Gather study materials for "${t}"`,
                `Set a timer for focused study session`,
                `Review key concepts and take notes`,
                `Test yourself on the material`
            ];
        }

        // Default generic steps
        return [
            `Research and plan for "${t}"`,
            `Break down into smaller actions`,
            `Execute the first step`,
            `Review progress and complete`
        ];
    };

    if (!genAI) {
        console.warn("⚠️ AI SERVICE: No Gemini API Key found in .env file.");
        console.log("👉 Returning Mock Data (Generic responses)");
        return getMockSteps(title);
    }

    try {
        console.log(`🤖 AI SERVICE: Generating breakdown for "${title}"...`);
        // שינוי המודל ל-gemini-1.5-flash (המודל המהיר והחסכוני)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- 3. Updated Prompt with Context ---
        const prompt = `You are an expert productivity assistant. 
        Break down this task: "${title}".
        ${description ? `Context/Description: "${description}"` : ''}
        ${priority ? `Priority: ${priority}` : ''}
        ${tags ? `Tags: ${tags}` : ''}

        Create exactly 3 to 5 short, actionable subtasks.
        Return ONLY the subtasks as a plain list separated by newlines. 
        Do not use numbers, bullet points, or bold text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ AI SERVICE: Success! Response received.");

        // Clean and process the response into an array
        const steps = text.split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s.replace(/^[\*\-] /, '')) // Remove bullets if AI adds them
            .map(s => s.replace(/^\d+\.\s*/, '')); // Remove numbers if AI adds them

        return steps;

    } catch (error) {
        console.error("🔥 AI SERVICE ERROR:", error.message);
        console.log("👉 Falling back to Mock Data due to error.");
        // Return enhanced mock data so the user gets a good experience even without AI
        return getMockSteps(title);
    }
};

module.exports = {
    generateBreakdown
};