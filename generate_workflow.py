#!/usr/bin/env python3
"""
AI Workflow Generator - Python Backend with Gemini AI

This script demonstrates how to use Google's Gemini AI to generate
workflows for no-code platforms like n8n, Make.com, and Zapier.

Requirements:
- pip install google-generativeai
- Set GOOGLE_API_KEY environment variable

Usage:
python generate_workflow.py "Create a workflow that processes customer feedback and sends automated responses"
"""

import os
import json
import sys
from typing import Dict, Any, Optional
import google.generativeai as genai

# Configure Gemini AI
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY environment variable not set")
    sys.exit(1)

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def generate_workflow_with_gemini(description: str, platform: str, complexity: str) -> Dict[str, Any]:
    """
    Use Gemini AI to generate a workflow based on natural language description.

    Args:
        description: Natural language description of the desired workflow
        platform: Target platform ('n8n', 'make', 'zapier', etc.)
        complexity: Complexity level ('simple', 'medium', 'complex')

    Returns:
        Dictionary containing the generated workflow
    """

    # Create the prompt for Gemini
    prompt = f"""
You are an expert workflow automation engineer. Generate a {platform} workflow based on this description:

"{description}"

Requirements:
- Platform: {platform}
- Complexity: {complexity}
- Include proper node connections
- Use realistic API endpoints and configurations
- Follow {platform} best practices

Return a JSON object with the complete workflow structure for {platform}.
Include all necessary nodes, connections, and configurations.

For {platform} workflows, structure your response as:
{{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {{...}},
  "settings": {{...}}
}}

Make sure the workflow is functional and includes proper error handling.
"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Clean up the response (remove markdown code blocks if present)
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]

        # Parse the JSON response
        workflow = json.loads(response_text.strip())

        # Validate the workflow structure
        if not validate_workflow(workflow, platform):
            raise ValueError("Generated workflow does not match expected structure")

        return workflow

    except Exception as e:
        print(f"Error generating workflow with Gemini: {e}")
        # Return a fallback workflow
        return generate_fallback_workflow(description, platform, complexity)

def validate_workflow(workflow: Dict[str, Any], platform: str) -> bool:
    """
    Validate that the generated workflow has the required structure.
    """
    required_keys = ['name', 'nodes', 'connections']

    if platform == 'n8n':
        required_keys.extend(['settings', 'meta'])

    for key in required_keys:
        if key not in workflow:
            return False

    if not isinstance(workflow['nodes'], list):
        return False

    if not isinstance(workflow['connections'], dict):
        return False

    return True

def generate_fallback_workflow(description: str, platform: str, complexity: str) -> Dict[str, Any]:
    """
    Generate a basic fallback workflow when AI generation fails.
    """
    base_workflow = {
        "name": f"AI Generated Workflow: {description[:30]}...",
        "nodes": [
            {
                "id": "trigger",
                "name": "Trigger",
                "type": "webhook" if platform == 'n8n' else "trigger",
                "parameters": {"description": description}
            },
            {
                "id": "process",
                "name": "AI Processing",
                "type": "code" if platform == 'n8n' else "action",
                "parameters": {"code": f"// Process: {description}"}
            },
            {
                "id": "output",
                "name": "Output",
                "type": "http" if platform == 'n8n' else "webhook",
                "parameters": {"method": "POST", "url": "https://api.example.com/webhook"}
            }
        ],
        "connections": {
            "Trigger": {"main": [[{"node": "AI Processing", "type": "main", "index": 0}]]},
            "AI Processing": {"main": [[{"node": "Output", "type": "main", "index": 0}]]}
        }
    }

    if platform == 'n8n':
        base_workflow.update({
            "settings": {},
            "meta": {"instanceId": "ai-generated"},
            "versionId": "1.0.0"
        })

    return base_workflow

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_workflow.py \"workflow description\" [platform] [complexity]")
        sys.exit(1)

    description = sys.argv[1]
    platform = sys.argv[2] if len(sys.argv) > 2 else 'n8n'
    complexity = sys.argv[3] if len(sys.argv) > 3 else 'medium'

    print(f"Generating {platform} workflow for: {description}")
    print(f"Complexity: {complexity}")
    print("-" * 50)

    workflow = generate_workflow_with_gemini(description, platform, complexity)

    print("Generated Workflow:")
    print(json.dumps(workflow, indent=2))

    # Save to file
    filename = f"ai-workflow-{platform}-{complexity}.json"
    with open(filename, 'w') as f:
        json.dump(workflow, f, indent=2)

    print(f"\nWorkflow saved to: {filename}")

if __name__ == "__main__":
    main()