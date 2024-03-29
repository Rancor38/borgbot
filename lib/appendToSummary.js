const { manageFile } = require("./index");

// Function to append message content to summary.txt file
function appendToSummary(content) {
    const summaryFilePath = path.join(__dirname, "..", "data", "summary.txt");
    
    // Read the current contents of summary.txt
    manageFile("read", summaryFilePath, null, (currentContent) => {
        // Set the prompt to include the current content and the new content
        const prompt = `Summarize the following as concisely as possible: ${currentContent + content + "\n"}`;
        
        // Call getOpenAIResponse with the prompt
        getOpenAIResponse(prompt)
            .then((response) => {
                // Write the response from OpenAI to summary.txt
                manageFile("write", summaryFilePath, response, (err) => {
                    if (err) {
                        console.error("Error writing to summary.txt:", err);
                    } else {
                        console.log("OpenAI response written to summary.txt:", response);
                    }
                });
            })
            .catch((error) => {
                console.error("Error from OpenAI:", error);
            });
    });
}

module.exports = { appendToSummary };
