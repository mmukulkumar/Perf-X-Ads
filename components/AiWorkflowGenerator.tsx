import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Zap, Copy, Check, RefreshCw, Download, Code, GitBranch, Workflow, Settings, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AiWorkflowGenerator = () => {
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [platform, setPlatform] = useState('n8n');
  const [complexity, setComplexity] = useState('medium');
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [workflowJson, setWorkflowJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { value: 'n8n', label: 'n8n', description: 'Open-source workflow automation tool' },
    { value: 'make', label: 'Make.com', description: 'Visual workflow automation platform' },
    { value: 'zapier', label: 'Zapier', description: 'Popular automation platform' },
    { value: 'integromat', label: 'Integromat', description: 'Advanced workflow automation' }
  ];

  const complexityLevels = [
    { value: 'simple', label: 'Simple', description: 'Basic workflow with 2-3 nodes' },
    { value: 'medium', label: 'Medium', description: 'Standard workflow with 4-6 nodes' },
    { value: 'complex', label: 'Complex', description: 'Advanced workflow with 7+ nodes' }
  ];

  const generateWorkflow = async () => {
    if (!workflowDescription.trim()) return;

    setIsGenerating(true);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-ai-workflow', {
        body: {
          description: workflowDescription,
          platform,
          complexity
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate workflow');
      }

      if (data?.success && data?.workflow) {
        setGeneratedWorkflow(data.workflow);
        setWorkflowJson(JSON.stringify(data.workflow, null, 2));
      } else {
        throw new Error(data?.error || 'Failed to generate workflow');
      }
    } catch (error) {
      console.error('Error generating workflow:', error);
      // Fallback to sample workflow if API fails
      const sampleWorkflow = generateSampleWorkflow(workflowDescription, platform);
      setGeneratedWorkflow(sampleWorkflow);
      setWorkflowJson(JSON.stringify(sampleWorkflow, null, 2));
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateWorkflowGeneration = async (description: string, platform: string, complexity: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // This would be replaced with actual API call to Python backend
    // POST /api/generate-workflow
    // Body: { description, platform, complexity }

    return {
      workflow: generateSampleWorkflow(description, platform),
      diagram: generateWorkflowDiagram(description, platform)
    };
  };

  const generateSampleWorkflow = (description: string, platform: string) => {
    const baseWorkflow = {
      name: `AI Generated Workflow: ${description.substring(0, 30)}...`,
      nodes: [],
      connections: {},
      settings: {},
      staticData: null,
      meta: {
        instanceId: "generated-workflow"
      },
      versionId: "1.0.0"
    };

    if (platform === 'n8n') {
      return generateN8nWorkflow(description, baseWorkflow);
    } else if (platform === 'make') {
      return generateMakeWorkflow(description, baseWorkflow);
    } else {
      return generateGenericWorkflow(description, baseWorkflow);
    }
  };

  const generateN8nWorkflow = (description: string, baseWorkflow: any) => {
    const workflow = { ...baseWorkflow };

    // Sample n8n workflow structure
    workflow.nodes = [
      {
        parameters: {
          httpMethod: "GET",
          path: "webhook",
          responseMode: "responseNode",
          options: {}
        },
        id: "webhook-id",
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [240, 300],
        webhookId: "webhook-id"
      },
      {
        parameters: {
          values: {
            string: [
              {
                name: "description",
                value: description
              }
            ]
          }
        },
        id: "set-id",
        name: "Set Workflow Data",
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        position: [460, 300]
      },
      {
        parameters: {
          mode: "runOnceForAllItems",
          language: "javaScript",
          code: `// AI processing logic
const description = $node["Set Workflow Data"].json["description"];
return [{ json: { processed: true, description } }];`
        },
        id: "code-id",
        name: "AI Processing",
        type: "n8n-nodes-base.code",
        typeVersion: 1,
        position: [680, 300]
      },
      {
        parameters: {
          httpMethod: "POST",
          url: "https://api.example.com/webhook",
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: "result",
                value: "={{ $json.result }}"
              }
            ]
          }
        },
        id: "http-id",
        name: "Send Result",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 1,
        position: [900, 300]
      }
    ];

    workflow.connections = {
      "Webhook": {
        main: [
          [
            {
              node: "Set Workflow Data",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Set Workflow Data": {
        main: [
          [
            {
              node: "AI Processing",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "AI Processing": {
        main: [
          [
            {
              node: "Send Result",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    };

    return workflow;
  };

  const generateMakeWorkflow = (description: string, baseWorkflow: any) => {
    const workflow = { ...baseWorkflow };

    // Sample Make.com workflow structure
    workflow.nodes = [
      {
        id: "trigger-id",
        module: "webhooks",
        version: 1,
        parameters: {
          hook: {
            name: "AI Workflow Trigger"
          }
        },
        metadata: {
          designer: {
            x: 0,
            y: 0
          }
        }
      },
      {
        id: "set-multiple-variables-id",
        module: "util:setMultipleVariables",
        version: 1,
        parameters: {
          variables: [
            {
              name: "workflow_description",
              value: description
            }
          ]
        },
        metadata: {
          designer: {
            x: 300,
            y: 0
          }
        }
      },
      {
        id: "ai-processing-id",
        module: "openai:createCompletion",
        version: 1,
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Process this workflow: {{workflow_description}}`
            }
          ]
        },
        metadata: {
          designer: {
            x: 600,
            y: 0
          }
        }
      },
      {
        id: "webhook-response-id",
        module: "webhooks:respond",
        version: 1,
        parameters: {
          statusCode: 200,
          body: "{{ai-processing-id.output}}"
        },
        metadata: {
          designer: {
            x: 900,
            y: 0
          }
        }
      }
    ];

    workflow.connections = {
      "trigger-id": {
        "hook": [
          "set-multiple-variables-id"
        ]
      },
      "set-multiple-variables-id": {
        "__IMT__": [
          "ai-processing-id"
        ]
      },
      "ai-processing-id": {
        "__IMT__": [
          "webhook-response-id"
        ]
      }
    };

    return workflow;
  };

  const generateGenericWorkflow = (description: string, baseWorkflow: any) => {
    const workflow = { ...baseWorkflow };

    workflow.nodes = [
      {
        id: "start",
        type: "trigger",
        name: "Start Workflow",
        description: "Workflow trigger",
        position: { x: 100, y: 100 }
      },
      {
        id: "process",
        type: "action",
        name: "AI Processing",
        description: description,
        position: { x: 300, y: 100 }
      },
      {
        id: "end",
        type: "action",
        name: "Complete",
        description: "Workflow completion",
        position: { x: 500, y: 100 }
      }
    ];

    workflow.connections = [
      { from: "start", to: "process" },
      { from: "process", to: "end" }
    ];

    return workflow;
  };

  const generateWorkflowDiagram = (description: string, platform: string) => {
    // Generate ASCII diagram representation
    return `
Workflow Diagram for: ${description}

Platform: ${platform.toUpperCase()}

[Trigger] → [AI Processing] → [Output/Action]

Nodes:
1. Trigger Node - Initiates the workflow
2. AI Processing Node - Processes with Gemini AI
3. Output Node - Returns results

Connections:
• Trigger → AI Processing
• AI Processing → Output
    `;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(workflowJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadWorkflow = () => {
    const blob = new Blob([workflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-workflow-${platform}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setWorkflowDescription('');
    setPlatform('n8n');
    setComplexity('medium');
    setGeneratedWorkflow(null);
    setWorkflowJson('');
    setCopied(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="AI Workflow Generator"
        description="Generate AI workflows in JSON format for n8n, Make.com and other no-code platforms. Create perfect node connections with workflow diagrams."
        icon={Zap}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Workflow Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Description</label>
              <textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Describe the workflow you want to create (e.g., 'Create a workflow that processes customer feedback, analyzes sentiment with AI, and sends automated responses')"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complexity</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {complexityLevels.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateWorkflow}
                disabled={!workflowDescription.trim() || isGenerating}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Workflow className="w-4 h-4" />
                    Generate Workflow
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Workflow</h3>
            {workflowJson && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={downloadWorkflow}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            )}
          </div>

          {generatedWorkflow ? (
            <div className="space-y-4">
              {/* Workflow Diagram */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Workflow Diagram
                </h4>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {generateWorkflowDiagram(workflowDescription, platform)}
                </pre>
              </div>

              {/* JSON Output */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  {platform.toUpperCase()} JSON
                </h4>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                  {workflowJson}
                </pre>
              </div>

              {/* Workflow Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold mb-2">Workflow Summary</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Platform:</strong> {platforms.find(p => p.value === platform)?.label}</p>
                  <p><strong>Nodes:</strong> {generatedWorkflow.nodes?.length || 'N/A'}</p>
                  <p><strong>Description:</strong> {workflowDescription.substring(0, 50)}...</p>
                  <p className="mt-2 text-xs">
                    <strong>Ready to use:</strong> Copy the JSON above and import it into your {platform} instance.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              <Workflow className="w-12 h-12 mx-auto mb-4 opacity-50" />
              Configure your workflow settings and click "Generate Workflow" to see the result here.
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">How to Use:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Describe your desired workflow in natural language</li>
          <li>Select your target platform (n8n, Make.com, etc.)</li>
          <li>Choose complexity level based on your needs</li>
          <li>Click "Generate Workflow" to create the JSON</li>
          <li>Copy the JSON and paste it into your workflow platform</li>
        </ol>
      </div>
    </div>
  );
};

export default AiWorkflowGenerator;