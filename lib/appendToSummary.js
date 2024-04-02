const { manageFile } = require("./manageFile");
const fs = require('fs').promises;
const path = require("path");
const { getOpenAIResponse } = require("./getOpenAIResponse");

// Function to append message userMessage to summary.txt file
async function appendToSummary(userMessage, borgbotResponse) {
    const summaryFilePath = path.join(__dirname, "..", "data", "summary.txt");
    const memories = await fetchTextFile(summaryFilePath);
    // Read the current userMessages of summary.txt
    manageFile("look", summaryFilePath, null, (exists) => {
        // Check if summary.txt exists
        if (!exists) {
            console.log("summary.txt does not exist. Creating...");
            // Create summary.txt and write the response from OpenAI to it
            writeResponseToSummary(summaryFilePath, userMessage);
        } else {
            // summary.txt exists
            // Set the prompt to include the new userMessage
            const prompt = `Summarize the following messages you received as concisely as possible: ${memories} \n + ${userMessage}`;
            
            // Call getOpenAIResponse with the prompt
            getOpenAIResponse("You are an AI assistant named Borgbot accepting messages via discord.", prompt)
                .then((response) => {
                    // Write the response from OpenAI to summary.txt
                  manageFile("write", summaryFilePath, response + "\n and borgbot's last response was: \n" + borgbotResponse, (err) => {
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

async function fetchTextFile(filePath) {
  return fs.readFile(filePath, 'utf-8');
}

module.exports = { appendToSummary };
