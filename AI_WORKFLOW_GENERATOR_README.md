# AI Workflow Generator

A powerful tool that uses Python and Google's Gemini AI to generate complete workflows for no-code automation platforms.

## Features

- **Multi-Platform Support**: Generate workflows for n8n, Make.com, Zapier, and Integromat
- **AI-Powered Generation**: Uses Google's Gemini AI to understand natural language descriptions
- **Complexity Levels**: Simple, Medium, and Complex workflow generation
- **Perfect Node Connections**: Automatically generates proper node connections and data flow
- **Workflow Diagrams**: Visual representation of the generated workflow
- **Copy & Paste Ready**: Export workflows as JSON that can be directly imported into target platforms

## How It Works

1. **Describe Your Workflow**: Enter a natural language description of what you want to automate
2. **Choose Platform**: Select your target no-code platform (n8n, Make.com, etc.)
3. **Set Complexity**: Choose the complexity level based on your needs
4. **Generate**: The AI analyzes your description and creates a complete workflow
5. **Copy & Import**: Copy the generated JSON and paste it into your workflow platform

## Example Descriptions

- "Create a workflow that monitors social media mentions and sends email notifications"
- "Build an automation that processes customer feedback, analyzes sentiment, and updates a dashboard"
- "Generate a workflow that fetches data from an API, transforms it, and stores it in a database"
- "Create an automation that handles form submissions, validates data, and creates tasks"

## Supported Platforms

### n8n
- Open-source workflow automation tool
- Supports webhooks, HTTP requests, databases, and 300+ integrations
- Generated workflows include proper node connections and configurations

### Make.com
- Visual workflow automation platform
- Supports modules for various services and APIs
- Generated workflows follow Make.com's module structure

### Zapier
- Popular automation platform with 5000+ app integrations
- Generated workflows include triggers, actions, and searches

### Integromat (now Make.com)
- Advanced workflow automation with complex logic support
- Generated workflows include routers, filters, and aggregators

## Technical Implementation

### Frontend (React/TypeScript)
- Interactive form for workflow description and configuration
- Real-time workflow preview and JSON export
- Copy-to-clipboard functionality
- Download workflows as JSON files

### Backend (Supabase Edge Functions)
- TypeScript/Deno runtime for serverless execution
- RESTful API for workflow generation requests
- Error handling and fallback mechanisms

### AI Integration (Python + Gemini)
- Python script using Google's Generative AI SDK
- Natural language processing for workflow understanding
- Platform-specific workflow structure generation
- Validation and error correction

## API Usage

```typescript
// Frontend API call
const { data, error } = await supabase.functions.invoke('generate-ai-workflow', {
  body: {
    description: "Process customer feedback and send responses",
    platform: "n8n",
    complexity: "medium"
  }
});
```

## Python Usage

```bash
# Set your Google API key
export GOOGLE_API_KEY="your-api-key-here"

# Generate a workflow
python generate_workflow.py "Create a workflow that processes customer feedback" n8n medium
```

## Workflow Structure

Generated workflows include:
- **Nodes**: Individual workflow steps with proper configurations
- **Connections**: Data flow between nodes with correct mapping
- **Settings**: Platform-specific configuration options
- **Metadata**: Workflow metadata and versioning information

## Error Handling

- Automatic fallback to sample workflows if AI generation fails
- Input validation and sanitization
- Platform-specific validation rules
- User-friendly error messages

## Future Enhancements

- Support for additional platforms (Microsoft Power Automate, etc.)
- Workflow testing and validation
- Template library for common use cases
- Advanced AI features (workflow optimization, error prediction)
- Integration with existing workflow platforms

## Contributing

To extend the AI Workflow Generator:

1. Add new platform support in the backend function
2. Update the frontend platform selection
3. Add platform-specific validation rules
4. Test with various workflow descriptions
5. Update documentation

## License

This tool is part of the Perf-X-Ads suite. See main project license for details.