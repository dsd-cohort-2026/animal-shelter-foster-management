const { GoogleGenAI } = require('@google/genai');
const { getToolDefinitions, executeTool } = require('./chat.tools');

const MODEL = 'gemini-2.5-flash-lite';
const MAX_MESSAGES = 20;
const MAX_TOOL_ITERATIONS = 1;
const FRIENDLY_PROVIDER_ERROR =
  "Sorry, I'm having trouble right now. Please try again.";
const EMPTY_REPLY_FALLBACK =
  "I can help with ShelterSync data like animals, medical logs, and supplies. Try asking about one of those.";
const LOG_PREFIX = '[chat.service]';
const PUBLIC_FAQ_CONTEXT = [
  'ShelterSync is an animal shelter foster management app.',
  'Core features: track animals, medical logs, and foster supply loans.',
  'Staff can manage users, animals, inventory, loans, and admin logs.',
  'Foster users can view their animals, their supplies, and foster logs.',
  'This public guest mode must not reveal private or live shelter records.',
  'If asked for private/live data, instruct users to sign in.',
].join(' ');

const TYPE_MAP = {
  object: 'OBJECT',
  array: 'ARRAY',
  string: 'STRING',
  integer: 'INTEGER',
  number: 'NUMBER',
  boolean: 'BOOLEAN',
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const logInfo = (message, data) => {
  if (data === undefined) {
    console.log(`${LOG_PREFIX} ${message}`);
    return;
  }
  console.log(`${LOG_PREFIX} ${message}`, data);
};

const logError = (message, error) => {
  if (error === undefined) {
    console.error(`${LOG_PREFIX} ${message}`);
    return;
  }
  console.error(`${LOG_PREFIX} ${message}`, error);
};

const toGeminiSchema = (schema) => {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const normalized = { ...schema };

  if (typeof normalized.type === 'string') {
    normalized.type = TYPE_MAP[normalized.type.toLowerCase()] || normalized.type;
  }

  if (normalized.properties && typeof normalized.properties === 'object') {
    const nextProps = {};
    for (const [key, value] of Object.entries(normalized.properties)) {
      nextProps[key] = toGeminiSchema(value);
    }
    normalized.properties = nextProps;
  }

  if (normalized.items) {
    normalized.items = toGeminiSchema(normalized.items);
  }

  return normalized;
};

const buildFunctionDeclarations = (user) => {
  return getToolDefinitions(user).map((tool) => ({
    ...tool,
    parameters: toGeminiSchema(tool.parameters || { type: 'object', properties: {} }),
  }));
};

const trimMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-MAX_MESSAGES);
};

const getLatestUserMessage = (messages) => {
  if (!Array.isArray(messages)) return '';

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message?.role === 'user' && typeof message?.content === 'string') {
      return message.content.trim();
    }
  }

  return '';
};

const detectAnimalStatusIntent = (content) => {
  if (typeof content !== 'string' || !content.trim()) return null;
  const text = content.toLowerCase();

  const statuses = [];
  if (/\badopt(ed|ion)?\b/.test(text)) statuses.push({ status: 'ADOPTED', label: 'adopted' });
  if (/\bfoster(ed|ing)?\b/.test(text)) statuses.push({ status: 'FOSTERED', label: 'fostered' });
  if (/\bshelter(ed|ing)?\b/.test(text)) statuses.push({ status: 'SHELTERED', label: 'sheltered' });

  if (statuses.length !== 1) return null;

  const talksAboutAnimals = /\banimal(s)?\b|\bpet(s)?\b/.test(text);
  if (!talksAboutAnimals && !/\blist|show|which|what|who|give|all\b/.test(text)) {
    return null;
  }

  return statuses[0];
};

const formatAnimalStatusListReply = (intent, animals) => {
  if (!intent) return null;

  const rows = Array.isArray(animals) ? animals : [];
  if (!rows.length) {
    return `There are no ${intent.label} animals right now.`;
  }

  const names = rows
    .map((animal) => (typeof animal?.name === 'string' ? animal.name.trim() : ''))
    .filter(Boolean);

  const list = names.join(', ');
  return `Here ${names.length === 1 ? 'is' : 'are'} the ${intent.label} animals (${names.length}): ${list}.`;
};

const resolveDeterministicAnimalStatusReply = async (messages, user) => {
  if (!user) return null;

  const latestUserMessage = getLatestUserMessage(messages);
  const intent = detectAnimalStatusIntent(latestUserMessage);
  if (!intent) return null;

  logInfo('Using deterministic animal status path.', {
    requestedStatus: intent.status,
    latestUserMessage,
  });

  const result = await executeTool(
    'get_animals',
    { foster_status: intent.status, page: 1, limit: 20 },
    user,
  );

  const animals = Array.isArray(result?.data) ? result.data : [];
  const strictAnimals = animals.filter((animal) => animal?.foster_status === intent.status);
  const reply = formatAnimalStatusListReply(intent, strictAnimals);
  logInfo('Deterministic animal status result.', {
    requestedStatus: intent.status,
    rawReturnedCount: animals.length,
    strictReturnedCount: strictAnimals.length,
  });
  return reply;
};

const toGeminiMessages = (messages) => {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
};

const getSystemInstruction = (user) => {
  if (!user) {
    return [
      'You are ShelterSync Assistant in public guest mode.',
      'Only answer questions about the app itself (features, workflows, and high-level usage).',
      'Do not provide or infer live shelter data, user data, inventory values, or medical records.',
      'If asked for protected data, politely ask the user to sign in.',
      'Keep responses concise and practical.',
      PUBLIC_FAQ_CONTEXT,
    ].join(' ');
  }

  return [
    'You are ShelterSync Assistant for an animal shelter foster management app.',
    'Only answer questions related to ShelterSync data and workflows.',
    'If a request is unrelated (weather, politics, general trivia, coding help not about this app), politely refuse and redirect to ShelterSync topics.',
    'Never invent data. Use tool results only.',
    'For animal status questions (adopted, fostered, sheltered), call get_animals with foster_status set to ADOPTED/FOSTERED/SHELTERED.',
    'When listing entities, include only items present in the tool response; do not infer or add extra names.',
    'Respect role and scoped access. Do not attempt to reveal restricted data.',
    `Current user role: ${user?.role || 'UNKNOWN'}.`,
    `Current user id: ${user?.id || 'UNKNOWN'}.`,
  ].join(' ');
};

const getResponseParts = (response) => {
  const partsFromCandidates = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(partsFromCandidates)) {
    return partsFromCandidates;
  }
  return [];
};

const getFunctionCalls = (response) => {
  const fromRoot = Array.isArray(response?.functionCalls) ? response.functionCalls : [];
  const fromParts = getResponseParts(response)
    .map((part) => part.functionCall)
    .filter(Boolean);
  return [...fromRoot, ...fromParts];
};

const extractText = (response) => {
  if (typeof response?.text === 'string' && response.text.trim().length > 0) {
    return response.text.trim();
  }

  const textParts = getResponseParts(response)
    .map((part) => (typeof part?.text === 'string' ? part.text.trim() : ''))
    .filter(Boolean);

  return textParts.join('\n').trim();
};

const providerError = (error) => {
  const wrapped = new Error(error?.message || 'Gemini provider error');
  wrapped.isProviderError = true;
  wrapped.cause = error;
  return wrapped;
};

const callGemini = async (contents, user) => {
  const functionDeclarations = buildFunctionDeclarations(user);
  const config = {
    systemInstruction: getSystemInstruction(user),
  };

  if (functionDeclarations.length > 0) {
    config.tools = [
      {
        functionDeclarations,
      },
    ];
  }

  try {
    return await ai.models.generateContent({
      model: MODEL,
      contents,
      config,
    });
  } catch (error) {
    logError('Gemini API call failed.', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      details: error?.details,
    });
    throw providerError(error);
  }
};

const executeFunctionCalls = async (functionCalls, user) => {
  const results = [];

  for (const call of functionCalls) {
    const name = call?.name;
    const args = call?.args || {};

    if (!name) {
      results.push({
        functionResponse: {
          name: 'unknown_function',
          response: { error: 'Missing function name in model response.' },
        },
      });
      continue;
    }

    try {
      logInfo(`Executing tool: ${name}`, { args });
      const result = await executeTool(name, args, user);
      logInfo(`Tool succeeded: ${name}`, {
        count: Array.isArray(result?.data) ? result.data.length : undefined,
      });
      results.push({
        functionResponse: {
          name,
          response: { result },
        },
      });
    } catch (error) {
      logError(`Tool failed: ${name}`, error);
      results.push({
        functionResponse: {
          name,
          response: { error: error?.message || `Failed to execute tool: ${name}` },
        },
      });
    }
  }

  return results;
};

exports.chat = async (messages, user) => {
  logInfo('Incoming chat request', {
    userId: user?.id,
    userRole: user?.role,
    messageCount: Array.isArray(messages) ? messages.length : 0,
  });

  if (!process.env.GEMINI_API_KEY) {
    logError('GEMINI_API_KEY is missing or empty.');
    return FRIENDLY_PROVIDER_ERROR;
  }

  const trimmedMessages = trimMessages(messages);
  const conversation = toGeminiMessages(trimmedMessages);
  logInfo('Prepared conversation payload', {
    trimmedMessageCount: trimmedMessages.length,
    guestMode: !user,
  });

  try {
    const deterministicReply = await resolveDeterministicAnimalStatusReply(trimmedMessages, user);
    if (deterministicReply) {
      return deterministicReply;
    }

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i += 1) {
      logInfo(`Gemini loop iteration ${i + 1}/${MAX_TOOL_ITERATIONS}`);
      const response = await callGemini(conversation, user);
      const functionCalls = getFunctionCalls(response);
      logInfo('Gemini response summary', {
        functionCallCount: functionCalls.length,
        textLength: extractText(response)?.length || 0,
      });

      if (!functionCalls.length) {
        const text = extractText(response);
        logInfo('Returning direct Gemini text response.');
        return text || EMPTY_REPLY_FALLBACK;
      }

      conversation.push({
        role: 'model',
        parts: functionCalls.map((call) => ({ functionCall: call })),
      });

      const functionResponseParts = await executeFunctionCalls(functionCalls, user);
      logInfo('Function responses prepared for Gemini.', {
        functionResponseCount: functionResponseParts.length,
      });

      conversation.push({
        role: 'user',
        parts: functionResponseParts,
      });
    }

    logInfo('Reached max tool iterations. Requesting final response.');
    const finalResponse = await callGemini(conversation, user);
    logInfo('Returning final response after max iterations.');
    return extractText(finalResponse) || EMPTY_REPLY_FALLBACK;
  } catch (error) {
    if (error?.isProviderError) {
      logError('Returning friendly provider fallback due to provider error.', error?.cause || error);
      return FRIENDLY_PROVIDER_ERROR;
    }
    logError('Unexpected chat service error.', error);
    throw error;
  }
};
