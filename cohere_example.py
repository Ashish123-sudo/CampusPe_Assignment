import cohere
import os

co = cohere.Client(os.getenv("CO_API_KEY"))

def query_cohere(prompt):
    try:
        response = co.chat(
            model="command-r-08-2024",   # ✅ latest working
            message=prompt
        )
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying Cohere...\n")
    result = query_cohere(user_prompt)
    print("Response:\n", result)