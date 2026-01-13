// Supabase Edge Function: generate-ai-workflow
// Deploy with: supabase functions deploy generate-ai-workflow

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  description: string;
  platform: string;
  complexity: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { description, platform, complexity }: WorkflowRequest = await req.json();

    if (!description || !platform) {
      throw new Error('Description and platform are required');
    }

    // In a production environment, this would call a Python service with Gemini AI
    // For now, we'll simulate the AI generation
    const workflow = await generateWorkflowWithAI(description, platform, complexity);

    return new Response(
      JSON.stringify({
        success: true,
        workflow,
        message: 'Workflow generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating workflow:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to generate workflow'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generateWorkflowWithAI(description: string, platform: string, complexity: string) {
  // This function would typically call a Python service that uses Gemini AI
  // For demonstration, we'll simulate the AI generation

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In production, this would be:
  // 1. Call Python service with Gemini AI
  // 2. Python service analyzes the description
  // 3. Gemini AI generates appropriate workflow structure
  // 4. Return properly formatted JSON for the target platform

  const baseWorkflow = {
    name: `AI Generated Workflow: ${description.substring(0, 30)}...`,
    nodes: [],
    connections: {},
    settings: {},
    staticData: null,
    meta: {
      instanceId: "ai-generated-workflow",
      generatedBy: "gemini-ai"
    },
    versionId: "1.0.0"
  };

  if (platform === 'n8n') {
    return generateN8nWorkflow(description, complexity, baseWorkflow);
  } else if (platform === 'make') {
    return generateMakeWorkflow(description, complexity, baseWorkflow);
  } else if (platform === 'zapier') {
    return generateZapierWorkflow(description, complexity, baseWorkflow);
  } else {
    return generateGenericWorkflow(description, complexity, baseWorkflow);
  }
}

function generateN8nWorkflow(description: string, complexity: string, baseWorkflow: any) {
  const workflow = { ...baseWorkflow };

  // AI-generated n8n workflow based on description analysis
  const nodes = [
    {
      parameters: {
        httpMethod: "GET",
        path: "webhook",
        responseMode: "responseNode",
        options: {}
      },
      id: "webhook-trigger",
      name: "Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [240, 300],
      webhookId: "ai-generated-webhook"
    }
  ];

  const connections: any = {};

  // Add nodes based on complexity and description analysis
  if (description.toLowerCase().includes('email') || description.toLowerCase().includes('send')) {
    nodes.push({
      parameters: {
        fromEmail: "noreply@aiworkflow.com",
        toEmail: "{{$node[\"Webhook Trigger\"].json.email}}",
        subject: "AI Generated Response",
        text: "Your request has been processed successfully."
      },
      id: "email-node",
      name: "Send Email",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 1,
      position: [460, 300]
    });

    connections["Webhook Trigger"] = {
      main: [[{ node: "Send Email", type: "main", index: 0 }]]
    };
  }

  if (description.toLowerCase().includes('database') || description.toLowerCase().includes('store')) {
    nodes.push({
      parameters: {
        operation: "insert",
        table: "ai_workflows",
        columns: "description,data,timestamp"
      },
      id: "database-node",
      name: "Store in Database",
      type: "n8n-nodes-base.postgres",
      typeVersion: 1,
      position: [680, 300]
    });

    // Connect to previous node
    const lastNode = nodes[nodes.length - 2];
    connections[lastNode.name] = {
      main: [[{ node: "Store in Database", type: "main", index: 0 }]]
    };
  }

  if (description.toLowerCase().includes('ai') || description.toLowerCase().includes('analyze') || description.toLowerCase().includes('process')) {
    nodes.push({
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that processes workflow data."
          },
          {
            role: "user",
            content: `Process this data: {{JSON.stringify($node["Webhook Trigger"].json)}}`
          }
        ]
      },
      id: "ai-processing",
      name: "AI Processing",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1,
      position: [900, 300]
    });

    // Connect to previous node
    const lastNode = nodes[nodes.length - 2];
    connections[lastNode.name] = {
      main: [[{ node: "AI Processing", type: "main", index: 0 }]]
    };
  }

  workflow.nodes = nodes;
  workflow.connections = connections;

  return workflow;
}

function generateMakeWorkflow(description: string, complexity: string, baseWorkflow: any) {
  const workflow = { ...baseWorkflow };

  // AI-generated Make.com workflow
  workflow.nodes = [
    {
      id: "webhook-trigger",
      module: "webhooks",
      version: 1,
      parameters: {
        hook: {
          name: "AI Generated Webhook"
        }
      },
      metadata: {
        designer: { x: 0, y: 0 }
      }
    }
  ];

  const connections: any = {};

  // Add modules based on description analysis
  if (description.toLowerCase().includes('email')) {
    workflow.nodes.push({
      id: "gmail-send",
      module: "gmail:sendEmail",
      version: 1,
      parameters: {
        to: "{{webhook-trigger.data.email}}",
        subject: "AI Workflow Result",
        message: "Your workflow has been processed."
      },
      metadata: {
        designer: { x: 300, y: 0 }
      }
    });

    connections["webhook-trigger"] = {
      "hook": ["gmail-send"]
    };
  }

  if (description.toLowerCase().includes('google sheets') || description.toLowerCase().includes('spreadsheet')) {
    workflow.nodes.push({
      id: "google-sheets-add",
      module: "googleSheets:addRow",
      version: 1,
      parameters: {
        spreadsheetId: "your-spreadsheet-id",
        sheetName: "Sheet1",
        values: ["{{webhook-trigger.data.value}}"]
      },
      metadata: {
        designer: { x: 600, y: 0 }
      }
    });

    const lastConnection = Object.keys(connections)[0];
    connections[lastConnection]["__IMT__"] = ["google-sheets-add"];
  }

  return workflow;
}

function generateZapierWorkflow(description: string, complexity: string, baseWorkflow: any) {
  const workflow = { ...baseWorkflow };

  // AI-generated Zapier zap structure
  workflow.nodes = [
    {
      id: "trigger",
      type: "webhook",
      name: "Webhook Trigger",
      description: "Catch hook",
      position: { x: 100, y: 100 }
    }
  ];

  // Add steps based on description
  if (description.toLowerCase().includes('slack')) {
    workflow.nodes.push({
      id: "slack",
      type: "action",
      name: "Send Channel Message",
      description: "Send a message to a Slack channel",
      position: { x: 300, y: 100 }
    });
  }

  workflow.connections = [
    { from: "trigger", to: workflow.nodes[1]?.id || "end" }
  ];

  return workflow;
}

function generateGenericWorkflow(description: string, complexity: string, baseWorkflow: any) {
  const workflow = { ...baseWorkflow };

  workflow.nodes = [
    {
      id: "start",
      type: "trigger",
      name: "Start",
      description: "Workflow trigger",
      position: { x: 100, y: 100 }
    },
    {
      id: "ai-process",
      type: "action",
      name: "AI Processing",
      description: description,
      position: { x: 300, y: 100 }
    },
    {
      id: "end",
      type: "action",
      name: "End",
      description: "Workflow completion",
      position: { x: 500, y: 100 }
    }
  ];

  workflow.connections = [
    { from: "start", to: "ai-process" },
    { from: "ai-process", to: "end" }
  ];

  return workflow;
}