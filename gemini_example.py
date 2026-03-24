import google.generativeai as genai
import os

# Configure API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Use latest working model
model = genai.GenerativeModel("models/gemini-2.5-flash")

def query_gemini(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying Gemini...\n")
    result = query_gemini(user_prompt)
    print("Response:\n", result)