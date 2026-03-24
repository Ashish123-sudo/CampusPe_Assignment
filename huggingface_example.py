import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://router.huggingface.co/models/google/flan-t5-large"

headers = {
    "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}",
    "Content-Type": "application/json"
}

def query_huggingface(prompt):
    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json={
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 100
                }
            }
        )

        print("STATUS CODE:", response.status_code)
        print("RAW RESPONSE:", response.text)

        # Handle non-JSON safely
        try:
            data = response.json()
        except:
            return f"Invalid JSON response: {response.text}"

        if isinstance(data, dict) and "error" in data:
            return f"API Error: {data['error']}"

        return data[0]["generated_text"]

    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    print("API KEY:", os.getenv("HUGGINGFACE_API_KEY"))

    user_input = input("Enter your prompt: ")
    print("\nQuerying Hugging Face...\n")

    result = query_huggingface(user_input)

    print("\nFinal Output:\n")
    print(result)