const axios = require("axios")

async function getOpenAIResponse(State, userMessage) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
      const completion = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
              messages: [{ role: 'system', content: `${State.prompt}` }, { role: 'user', content: userMessage}],
              model: 'gpt-3.5-turbo',
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${openaiApiKey}`, 
              },
          }
      );

      return completion.data.choices[0].message.content; // Returning the response
  } catch (error) {
      console.error(error);
      return "Internal Server Error, I'm borked."; // Return error message
  }
}