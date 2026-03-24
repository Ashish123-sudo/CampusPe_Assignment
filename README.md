>Assignment 2
done all question excluding Q9
Got logic errors hence could not finish ATM simulator

--------------------------------------------------------------------------

>Assignment 3

Project description:
This project demonstrates integration of multiple Generative AI APIs into a single Python application.  
It allows users to choose between different AI providers and generate responses dynamically.

Setup Instructions:
1)Install Python: Ensure Python 3.10+ is installed
2) Install dependencies "pip install -r requirements.txt"

 How to obtain each API key:
->OpenAI: Sign up at platform.openai.com.
->Groq: Obtain a key from console.groq.com.
->Ollama: Download the software locally from ollama.ai.
->Hugging Face: Create a token at huggingface.co/settings/tokens.
->Google Gemini: Generate a key at makersuite.google.com.
->Cohere: Sign up at dashboard.cohere.com.

How to run each program:
1) Create python file(openai_example.py)
2)Write code:
( Code structure:
import library_name
import os

api_key = os.getenv("API_KEY_NAME")
client = initialize_client(api_key)
def query_api(prompt):

 try:
 response = client.generate(
 prompt=prompt,
 max_tokens=500,
 temperature=0.7
 )
 return response.text
 except Exception as e:
 return f"Error: {str(e)}"
# Main execution
if __name__ == "__main__":
 user_prompt = input("Enter your prompt: ")
 print("Querying API...")
 result = query_api(user_prompt)
 print("Response:")

3) Save your API key as envirnoment user variable
4) Run program


ERRORS FACED:

Openai : Required payment for working api
Hugging face: Faced multiple errors of 401, Model not supported etc
