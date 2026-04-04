export interface ToolDefinition {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
    execute?: (...args: unknown[]) => unknown | Promise<unknown>;
}

export interface SkillDefinition {
    id?: string;
    name?: string;
    description?: string;
    content?: string;
}

export interface AgentSpecDefinition {
    id?: string;
    name?: string;
    description?: string;
    model?: string | null;
    allowedTools?: string[];
}

export interface SessionMessage {
    role: string;
    content?: string | null;
    tool_calls?: unknown[];
    [key: string]: unknown;
}

export interface RuntimeMessage {
    sessionId?: string;
    sessionKey?: string;
    role?: string;
    content?: string;
    replyToId?: string | number;
    metadata?: Record<string, unknown>;
    file?: {
        path?: string;
        caption?: string;
        name?: string;
        mimeType?: string;
        metadata?: Record<string, unknown>;
    };
}

export interface RuntimeEvent {
    [key: string]: unknown;
}

export interface LlmToolDefinition {
    type: 'function';
    function: {
        name: string;
        description?: string;
        parameters?: Record<string, unknown>;
    };
}

export interface LlmChatUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface LlmChatResponse {
    content?: string | null;
    tool_calls?: unknown[];
    finish_reason?: string | null;
    usage?: LlmChatUsage;
}

export interface LlmLike {
    chat(
        messages: SessionMessage[],
        tools?: LlmToolDefinition[],
        model?: string | null
    ): Promise<LlmChatResponse>;
}

export interface ForgeOptions {
    rootDir?: string;
    workspaceDir?: string | null;
    agentsDir?: string | null;
    promptsDir?: string | null;
    skillsDir?: string | null;
    toolsDir?: string | null;
    sessionsDir?: string | null;
    cronsDir?: string | null;
    logsDir?: string | null;
    llm?: LlmLike | null;
    model?: string | null;
    appName?: string | null;
    logLevel?: string | null;
    maxRuntimeMs?: number;
    wrapUpThresholdMs?: number;
    maxMessagesPerSession?: number;
    sessionTtlMs?: number;
    llmChatMaxRetries?: number;
    pollTimeoutMs?: number;
    timeoutMessage?: string | null;
}

export interface AgentRunResult {
    response: string | null;
    finishReason?: string | null;
    timedOut?: boolean;
}

export interface AgentSendResult {
    agentId: string;
    sessionId: string;
    response: string | null;
    finishReason?: string | null;
    timedOut?: boolean;
    messages: SessionMessage[];
}

export interface SubagentLaunchResult {
    [key: string]: unknown;
}

export interface LogFiles {
    appName: string;
    logsDir: string;
    logFilePath: string;
    errorLogFilePath: string;
}

export interface LoggerFacade {
    debug(message: string, meta?: unknown): unknown;
    info(message: string, meta?: unknown): unknown;
    warn(message: string, meta?: unknown): unknown;
    error(message: string, meta?: unknown): unknown;
}

export interface Agent {
    readonly id: string;
    readonly sessionId: string;
    readonly name: string;
    readonly prompt: string;
    readonly model: string | null;
    readonly status: string;
    readonly result: unknown;
    readonly error: unknown;
    onMessage(handler: (receiveMessage: (message: RuntimeMessage) => unknown) => unknown): this;
    sendMessage(handler: (message: RuntimeMessage) => unknown | Promise<unknown>): this;
    on(eventId: string, handler: (event: RuntimeEvent) => unknown): () => void;
    start(): Promise<this>;
    stop(): Promise<unknown>;
    getMessages(): SessionMessage[];
    appendMessage(message: SessionMessage): SessionMessage;
    getToolDefinitions(): LlmToolDefinition[];
    ensureSession(): unknown;
    send(content: string, options?: { role?: string }): Promise<AgentSendResult>;
    run(input?: string | null, options?: { role?: string }): Promise<AgentRunResult | AgentSendResult>;
    complete(result?: unknown): this;
    fail(error: unknown): this;
    getTool(name: string): ToolDefinition | null;
    listTools(): Array<ToolDefinition | null>;
    spawnSubagent(type: string, options?: { prompt?: string }): Promise<Agent>;
    launchSubagent(type: string, prompt?: string): Promise<SubagentLaunchResult>;
    askMainAgent(question: string): Promise<unknown>;
    chatSubagent(subagentId: string, message: string): Promise<unknown>;
    listActiveSubagents(): unknown[];
    findById(agentId: string): Agent | null;
    findBySessionId(sessionId: string): Agent | null;
}

export interface OpenRouterLlmOptions {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
    maxTokens?: number;
    temperature?: number;
    toolChoice?: string;
}

export class OpenRouterLlm implements LlmLike {
    constructor(options: OpenRouterLlmOptions);
    client: unknown;
    maxTokens: number;
    temperature: number;
    toolChoice: string;
    chat(
        messages: SessionMessage[],
        tools?: LlmToolDefinition[],
        model?: string | null
    ): Promise<LlmChatResponse>;
}

export function forge(options?: ForgeOptions): Promise<Agent>;

export const logger: LoggerFacade;

export function resolveLogFiles(options?: {
    rootDir?: string;
    logsDir?: string | null;
    appName?: string | null;
}): LogFiles;

export function readLogTail(options: { filePath: string; lines?: number }): string;

export const SQUADFORGE_NAME: string;
export const SQUADFORGE_ROOT_DIR: string;
export const DEFAULT_AGENTS_DIR_NAME: string;
export const DEFAULT_PROMPTS_DIR_NAME: string;
export const DEFAULT_SKILLS_DIR_NAME: string;
export const DEFAULT_TOOLS_DIR_NAME: string;
export const DEFAULT_SESSIONS_DIR_NAME: string;
export const DEFAULT_CRONS_DIR_NAME: string;
export const DEFAULT_LOGS_DIR_NAME: string;
export const MARKDOWN_EXTENSION: string;
export const SUPPORTED_TOOL_EXTENSIONS: string[];
export const TOOLS_FILE_NAME: string;
export const SKILLS_FILE_NAME: string;
export const SUBAGENTS_FILE_NAME: string;
export const SUBAGENT_FILE_NAME: string;
export const SKILL_FILE_NAME: string;
export const LEADER_FILE_NAME: string;
export const LEADER_SPEC_ID: string;
export const DEFAULT_LEADER_SESSION_ID: string;
export const DEFAULT_MAX_RUNTIME_MS: number;
export const DEFAULT_WRAP_UP_THRESHOLD_MS: number;
export const DEFAULT_MAX_MESSAGES_PER_SESSION: number;
export const DEFAULT_SESSION_TTL_MS: number;
export const DEFAULT_LLM_CHAT_MAX_RETRIES: number;
export const RUNNING_STATUS: string;
export const IDLE_STATUS: string;
export const DONE_STATUS: string;
export const FAILED_STATUS: string;
export const SUBAGENT_QUESTION_TIMEOUT_MS: number;
export const DEFAULT_RUNTIME_POLL_TIMEOUT_MS: number;
export const DEFAULT_RUNTIME_TIMEOUT_MESSAGE: string;
export const DEFAULT_LOG_LEVEL: string;
export const DEFAULT_LOG_TIMESTAMP_FORMAT: string;
export const DEFAULT_LOG_MAX_SIZE: number;
export const DEFAULT_ERROR_LOG_MAX_SIZE: number;
export const DEFAULT_REQUEST_TIMEOUT_MS: number;
export const DEFAULT_MAX_TOKENS: number;
export const DEFAULT_TEMPERATURE: number;
export const DEFAULT_TOOL_CHOICE: string;