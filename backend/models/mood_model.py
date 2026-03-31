import cloudinary
import cloudinary.uploader
import requests
import os
import json
import base64
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def analyze_image(base64_image):
    try:
        # 1. Upload to Cloudinary
        # Handle potential data:image/jpeg;base64, prefix
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]
            
        upload_result = cloudinary.uploader.upload(
            f"data:image/jpeg;base64,{base64_image}", 
            folder="neurolearn/moods"
        )
        image_url = upload_result.get("secure_url")
        
        # 2. Call Featherless AI (Qwen-VL)
        api_key = os.getenv("LLM_API_KEY")
        base_url = os.getenv("LLM_BASE_URL")
        model = os.getenv("LLM_MODEL")
        
        prompt = """Analyze the person's facial expression and body language in this image. 
        Determine the primary emotion (Happy, Sad, Angry, Anxious, Neutral). 
        Provide a short reasoning and a sensory-friendly activity suggestion.
        Return ONLY valid JSON in this format:
        {
            "primary_emotion": "string",
            "reasoning": "string",
            "suggested_activity": "string"
        }"""
        
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ]
                }
            ],
            "response_format": {"type": "json_object"}
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload)
        response_data = response.json()
        
        ai_content = response_data['choices'][0]['message']['content']
        result = json.loads(ai_content)
        
        # Add basic confidence and metadata
        result["image_url"] = image_url
        result["confidences"] = {result["primary_emotion"]: 0.95} # Mock confidence for UI compat
        
        return result

    except Exception as e:
        print(f"AI Analysis Error: {e}")
        # Fallback to mock logic if AI fails
        return {
            "primary_emotion": "Neutral",
            "reasoning": "The AI analysis encountered an error, falling back to neutral assessment.",
            "suggested_activity": "Take a deep breath and listen to some calm music.",
            "confidences": {"Neutral": 1.0}
        }
