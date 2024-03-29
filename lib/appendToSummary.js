const { manageFile } = require("./index");

// Function to append message content to summary.txt file
function appendToSummary(content) {
    const summaryFilePath = path.join(__dirname, "..", "data", "summary.txt");
    
    // Read the current contents of summary.txt
    manageFile("look", summaryFilePath, null, (exists) => {
        // Check if summary.txt exists
        if (!exists) {
            console.log("summary.txt does not exist. Creating...");
            // Create summary.txt and write the response from OpenAI to it
            writeResponseToSummary(summaryFilePath, content);
        } else {
            // summary.txt exists
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
        }
    });
}

// Function to write response from OpenAI to summary.txt
function writeResponseToSummary(filePath, response) {
    manageFile("write", filePath, response, (err) => {
        if (err) {
            console.error("Error writing to summary.txt:", err);
        } else {
            console.log("OpenAI response written to summary.txt:", response);
        }
    });
}

module.exports = { appendToSummary };
