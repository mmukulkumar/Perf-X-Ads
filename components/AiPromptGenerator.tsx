import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Bot, Sparkles, Copy, Check, RefreshCw, Image, Code, Video, Brain, Zap } from 'lucide-react';

const AiPromptGenerator = () => {
  const [task, setTask] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [promptType, setPromptType] = useState('general');
  const [framework, setFramework] = useState('general');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const promptTypes = [
    { value: 'general', label: 'General', icon: Bot },
    { value: 'image', label: 'Image Generation', icon: Image },
    { value: 'coding', label: 'Code Generation', icon: Code },
    { value: 'video', label: 'Video Generation', icon: Video },
    { value: 'agentic', label: 'Agentic AI', icon: Brain },
    { value: 'prompt', label: 'Prompt Engineering', icon: Zap }
  ];

  const frameworks = [
    { value: 'general', label: 'General Structure' },
    { value: 'ape', label: 'APE (Action, Purpose, Expectation)' },
    { value: 'race', label: 'RACE (Role, Action, Context, Expectation)' },
    { value: 'create', label: 'CREATE (Context, Role, Expectation, Action, Tone, Examples)' },
    { value: 'spark', label: 'SPARK (Situation, Problem, Action, Result, Key)' }
  ];

  const generatePrompt = () => {
    if (!task.trim()) return;

    let prompt = '';

    switch (framework) {
      case 'ape':
        prompt = generateAPE();
        break;
      case 'race':
        prompt = generateRACE();
        break;
      case 'create':
        prompt = generateCREATE();
        break;
      case 'spark':
        prompt = generateSPARK();
        break;
      default:
        prompt = generateGeneral();
    }

    setGeneratedPrompt(prompt);
  };

  const generateGeneral = () => {
    const toneDescriptions = {
      professional: 'professional and formal',
      casual: 'casual and friendly',
      creative: 'creative and imaginative',
      technical: 'technical and detailed',
      persuasive: 'persuasive and convincing'
    };

    const lengthDescriptions = {
      short: 'brief and concise',
      medium: 'moderately detailed',
      long: 'comprehensive and thorough'
    };

    let prompt = `Please ${task}`;

    if (context.trim()) {
      prompt += ` in the context of: ${context}`;
    }

    prompt += `. Provide a ${toneDescriptions[tone as keyof typeof toneDescriptions]} response that is ${lengthDescriptions[length as keyof typeof lengthDescriptions]}.`;

    if (tone === 'technical') {
      prompt += ' Include relevant technical details and explanations.';
    } else if (tone === 'creative') {
      prompt += ' Be innovative and think outside the box.';
    } else if (tone === 'persuasive') {
      prompt += ' Focus on benefits and compelling arguments.';
    }

    return prompt;
  };

  const generateAPE = () => {
    // APE: Action, Purpose, Expectation
    let prompt = `**Action:** ${task}\n\n`;

    if (context.trim()) {
      prompt += `**Purpose:** ${context}\n\n`;
    } else {
      prompt += `**Purpose:** To achieve the desired outcome effectively\n\n`;
    }

    const expectationMap = {
      short: 'Provide a concise, focused response',
      medium: 'Provide a detailed, comprehensive response',
      long: 'Provide an exhaustive, in-depth analysis'
    };

    prompt += `**Expectation:** ${expectationMap[length as keyof typeof expectationMap]}`;

    if (promptType === 'image') {
      prompt += ' with high-quality visual details, artistic style, and composition guidance.';
    } else if (promptType === 'coding') {
      prompt += ' with clean, efficient, and well-documented code.';
    } else if (promptType === 'video') {
      prompt += ' with dynamic storytelling, visual effects, and engaging narrative.';
    } else if (promptType === 'agentic') {
      prompt += ' with autonomous decision-making capabilities and goal-oriented behavior.';
    } else if (promptType === 'prompt') {
      prompt += ' with optimized prompt engineering techniques and best practices.';
    }

    return prompt;
  };

  const generateRACE = () => {
    // RACE: Role, Action, Context, Expectation
    const roleMap = {
      general: 'an expert assistant',
      image: 'a professional digital artist and image generator',
      coding: 'an experienced software developer',
      video: 'a creative video producer and director',
      agentic: 'an autonomous AI agent',
      prompt: 'a prompt engineering specialist'
    };

    let prompt = `**Role:** You are ${roleMap[promptType as keyof typeof roleMap]}.\n\n`;
    prompt += `**Action:** ${task}\n\n`;

    if (context.trim()) {
      prompt += `**Context:** ${context}\n\n`;
    } else {
      prompt += `**Context:** Working in a professional environment with high standards.\n\n`;
    }

    const expectationMap = {
      short: 'Deliver a concise, actionable result',
      medium: 'Provide a well-structured, detailed response',
      long: 'Create a comprehensive solution with thorough analysis'
    };

    prompt += `**Expectation:** ${expectationMap[length as keyof typeof expectationMap]}`;

    return prompt;
  };

  const generateCREATE = () => {
    // CREATE: Context, Role, Expectation, Action, Tone, Examples
    let prompt = '';

    if (context.trim()) {
      prompt += `**Context:** ${context}\n\n`;
    } else {
      prompt += `**Context:** Professional environment requiring high-quality output\n\n`;
    }

    const roleMap = {
      general: 'versatile AI assistant',
      image: 'professional digital artist',
      coding: 'experienced software engineer',
      video: 'creative video producer',
      agentic: 'autonomous AI agent',
      prompt: 'prompt engineering expert'
    };

    prompt += `**Role:** You are a ${roleMap[promptType as keyof typeof roleMap]}.\n\n`;

    const expectationMap = {
      short: 'Deliver focused, efficient results',
      medium: 'Provide comprehensive, well-structured output',
      long: 'Create detailed, exhaustive solutions with analysis'
    };

    prompt += `**Expectation:** ${expectationMap[length as keyof typeof expectationMap]}\n\n`;
    prompt += `**Action:** ${task}\n\n`;

    const toneMap = {
      professional: 'Maintain a professional, clear communication style',
      casual: 'Use a friendly, approachable tone',
      creative: 'Be innovative and imaginative in approach',
      technical: 'Focus on technical accuracy and detail',
      persuasive: 'Emphasize benefits and compelling arguments'
    };

    prompt += `**Tone:** ${toneMap[tone as keyof typeof toneMap]}\n\n`;
    prompt += `**Examples:** Provide relevant examples to illustrate key points and demonstrate best practices.`;

    return prompt;
  };

  const generateSPARK = () => {
    // SPARK: Situation, Problem, Action, Result, Key
    let prompt = '';

    if (context.trim()) {
      prompt += `**Situation:** ${context}\n\n`;
    } else {
      prompt += `**Situation:** Working on an important project requiring expert assistance\n\n`;
    }

    prompt += `**Problem:** ${task}\n\n`;
    prompt += `**Action:** Provide a comprehensive solution addressing the problem\n\n`;

    const resultMap = {
      short: 'Achieve a quick, effective resolution',
      medium: 'Deliver a well-balanced, practical solution',
      long: 'Create an optimal, thoroughly validated outcome'
    };

    prompt += `**Result:** ${resultMap[length as keyof typeof resultMap]}\n\n`;
    prompt += `**Key:** Focus on quality, efficiency, and practical implementation.`;

    if (promptType === 'image') {
      prompt += ' Emphasize visual composition, color theory, and artistic elements.';
    } else if (promptType === 'coding') {
      prompt += ' Prioritize code quality, performance, and maintainability.';
    } else if (promptType === 'video') {
      prompt += ' Focus on storytelling, pacing, and visual impact.';
    } else if (promptType === 'agentic') {
      prompt += ' Emphasize autonomy, decision-making, and goal achievement.';
    } else if (promptType === 'prompt') {
      prompt += ' Focus on prompt optimization, clarity, and effectiveness.';
    }

    return prompt;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setTask('');
    setContext('');
    setTone('professional');
    setLength('medium');
    setPromptType('general');
    setFramework('general');
    setGeneratedPrompt('');
    setCopied(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="AI Prompt Generator"
        description="Create high-quality AI prompts with proven frameworks like APE, RACE, CREATE, and SPARK. Generate professional prompts that deliver better results from ChatGPT, Claude, and other AI models."
        icon={Bot}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Prompt Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Type</label>
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {promptTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {frameworks.map(fw => (
                  <option key={fw.value} value={fw.value}>
                    {fw.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task or Request</label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={`Describe what you want the AI to do (e.g., ${promptType === 'image' ? "'create a realistic portrait of a cyberpunk character'" : promptType === 'coding' ? "'write a React component for a todo list'" : promptType === 'video' ? "'create a promotional video script'" : promptType === 'agentic' ? "'design an AI agent for customer support'" : promptType === 'prompt' ? "'optimize this prompt for better results'" : "'write a blog post about SEO best practices'"})`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Context (Optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={`Provide additional context or background information${promptType === 'image' ? ' (e.g., style, mood, specific details)' : promptType === 'coding' ? ' (e.g., programming language, framework, requirements)' : promptType === 'video' ? ' (e.g., target audience, duration, platform)' : promptType === 'agentic' ? ' (e.g., goals, constraints, environment)' : promptType === 'prompt' ? ' (e.g., target AI model, use case, constraints)' : ' (e.g., industry, audience, constraints)'}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generatePrompt}
                disabled={!task.trim()}
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Prompt
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
            <h3 className="text-lg font-semibold">Generated Prompt</h3>
            {generatedPrompt && (
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
            {generatedPrompt ? (
              <div className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {generatedPrompt}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Configure your prompt settings and click "Generate Prompt" to see the result here.
              </div>
            )}
          </div>
          {generatedPrompt && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Copy this prompt and paste it into your preferred AI tool (ChatGPT, Claude, DALL-E, etc.) for better results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPromptGenerator;