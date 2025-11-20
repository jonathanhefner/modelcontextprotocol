/* JSON-RPC types */

/**
 * Refers to any valid JSON-RPC object that can be decoded off the wire, or encoded to be sent.
 *
 * @category JSON-RPC
 */
export type JSONRPCMessage =
  | JSONRPCRequest
  | JSONRPCNotification
  | JSONRPCResponse
  | JSONRPCError;

/** @internal */
export const LATEST_PROTOCOL_VERSION = "DRAFT-2025-v3";
/** @internal */
export const JSONRPC_VERSION = "2.0";

/**
 * Common params for any request.
 *
 * @internal
 */
export interface RequestParams {
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: {
    [key: string]: unknown;
  };
}

/** @internal */
export interface Request {
  method: string;
  // Allow unofficial extensions of `Request.params` without impacting `RequestParams`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: { [key: string]: any };
}

/** @internal */
export interface NotificationParams {
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/** @internal */
export interface Notification {
  method: string;
  // Allow unofficial extensions of `Notification.params` without impacting `NotificationParams`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: { [key: string]: any };
}

/**
 * @category Common Types
 */
export interface Result {
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
  [key: string]: unknown;
}

/**
 * @category Common Types
 */
export interface Error {
  /**
   * The error type that occurred.
   */
  code: number;
  /**
   * A short description of the error. The message SHOULD be limited to a concise single sentence.
   */
  message: string;
  /**
   * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
   */
  data?: unknown;
}

/**
 * A uniquely identifying ID for a request in JSON-RPC.
 *
 * @category Common Types
 */
export type RequestId = string | number;

/**
 * A request that expects a response.
 *
 * @category JSON-RPC
 */
export interface JSONRPCRequest extends Request {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
}

/**
 * A notification which does not expect a response.
 *
 * @category JSON-RPC
 */
export interface JSONRPCNotification extends Notification {
  jsonrpc: typeof JSONRPC_VERSION;
}

/**
 * A successful (non-error) response to a request.
 *
 * @category JSON-RPC
 */
export interface JSONRPCResponse {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
  result: Result;
}

// Standard JSON-RPC error codes
export const PARSE_ERROR = -32700;
export const INVALID_REQUEST = -32600;
export const METHOD_NOT_FOUND = -32601;
export const INVALID_PARAMS = -32602;
export const INTERNAL_ERROR = -32603;

/**
 * A response to a request that indicates an error occurred.
 *
 * @category JSON-RPC
 */
export interface JSONRPCError {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
  error: Error;
}

/**
 * Base interface for metadata with name (identifier) and title (display name) properties.
 *
 * @internal
 */
export interface BaseMetadata {
  /**
   * Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn't present).
   */
  name: string;

  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display.
   */
  title?: string;
}

/**
 * The sender or recipient of messages and data in a conversation.
 *
 * @category Common Types
 */
export type Role = "user" | "assistant";

/**
 * Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
 *
 * @category Common Types
 */
export interface Annotations {
  /**
   * Describes who the intended customer of this object or data is.
   *
   * It can include multiple entries to indicate content useful for multiple audiences (e.g., `["user", "assistant"]`).
   */
  audience?: Role[];

  /**
   * The moment the resource was last modified, as an ISO 8601 formatted string.
   *
   * Should be an ISO 8601 formatted string (e.g., "2025-01-12T15:00:58Z").
   *
   * Examples: last activity timestamp in an open file, timestamp when the resource
   * was attached, etc.
   */
  lastModified?: string;
}

/**
 * The contents of a specific resource or sub-resource.
 *
 * @internal
 */
export interface ResourceContents {
  /**
   * The URI of this resource.
   *
   * @format uri
   */
  uri: string;
  /**
   * The MIME type of this resource, if known.
   */
  mimeType?: string;

  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/**
 * @category Content
 */
export interface TextResourceContents extends ResourceContents {
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: string;
}

/**
 * @category Content
 */
export interface BlobResourceContents extends ResourceContents {
  /**
   * A base64-encoded string representing the binary data of the item.
   *
   * @format byte
   */
  blob: string;
}

/**
 * A known resource that the server is capable of reading.
 *
 * @category `resources/list`
 */
export interface Resource extends BaseMetadata {
  /**
   * The URI of this resource.
   *
   * @format uri
   */
  uri: string;

  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description?: string;

  /**
   * The MIME type of this resource, if known.
   */
  mimeType?: string;

  /**
   * Optional annotations for the client.
   */
  annotations?: Annotations;

  /**
   * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
   *
   * This can be used by Hosts to display file sizes and estimate context window usage.
   */
  size?: number;

  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/**
 * The contents of a resource, embedded into a prompt or tool call result.
 *
 * It is up to the client how best to render embedded resources for the benefit
 * of the LLM and/or the user.
 *
 * @category Content
 */
export interface EmbeddedResource {
  type: "resource";
  resource: TextResourceContents | BlobResourceContents;

  /**
   * Optional annotations for the client.
   */
  annotations?: Annotations;

  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/**
 * Text provided to or from an LLM.
 *
 * @category Content
 */
export interface TextContent {
  type: "text";

  /**
   * The text content of the message.
   */
  text: string;

  /**
   * Optional annotations for the client.
   */
  annotations?: Annotations;

  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/**
 * @category Content
 */
export type ContentBlock =
  | TextContent
  | EmbeddedResource;

/* Initialization */

/**
 * Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
 *
 * @category `initialize`
 */
export interface ClientCapabilities {
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental?: { [key: string]: object };
}

/**
 * Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
 *
 * @category `initialize`
 */
export interface ServerCapabilities {
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental?: { [key: string]: object };
  /**
   * Present if the server offers any tools to call.
   */
  tools?: object;
}

/**
 * Describes the MCP implementation.
 *
 * @category `initialize`
 */
export interface Implementation extends BaseMetadata {
  version: string;

  /**
   * An optional human-readable description of what this implementation does.
   *
   * This can be used by clients or servers to provide context about their purpose
   * and capabilities. For example, a server might describe the types of resources
   * or tools it provides, while a client might describe its intended use case.
   */
  description?: string;

  /**
   * An optional URL of the website for this implementation.
   *
   * @format uri
   */
  websiteUrl?: string;
}

/**
 * Parameters for an `initialize` request.
 *
 * @category `initialize`
 */
export interface InitializeRequestParams extends RequestParams {
  /**
   * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
   */
  protocolVersion: string;
  capabilities: ClientCapabilities;
  clientInfo: Implementation;
}

/**
 * This request is sent from the client to the server when it first connects, asking it to begin initialization.
 *
 * @category `initialize`
 */
export interface InitializeRequest extends JSONRPCRequest {
  method: "initialize";
  params: InitializeRequestParams;
}

/**
 * After receiving an initialize request from the client, the server sends this response.
 *
 * @category `initialize`
 */
export interface InitializeResult extends Result {
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: string;
  capabilities: ServerCapabilities;
  serverInfo: Implementation;

  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions?: string;
}

/* Tools */

/**
 * Additional properties describing a Tool to clients.
 *
 * NOTE: all properties in ToolAnnotations are **hints**.
 * They are not guaranteed to provide a faithful description of
 * tool behavior.
 *
 * Clients should never make tool use decisions based on ToolAnnotations
 * received from untrusted servers.
 *
 * @category `tools/list`
 */
export interface ToolAnnotations {
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint?: boolean;

  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint?: boolean;

  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint?: boolean;

  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint?: boolean;
}

/**
 * Definition for a tool the client can call.
 *
 * @category `tools/list`
 */
export interface Tool extends BaseMetadata {
  /**
   * A human-readable description of the tool.
   *
   * This can be used by clients to improve the LLM's understanding of available tools. It can be thought of like a "hint" to the model.
   */
  description?: string;

  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: {
    $schema?: string;
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
  };

  /**
   * An optional JSON Schema object defining the structure of the tool's output returned in
   * the structuredContent field of a CallToolResult.
   *
   * Defaults to JSON Schema 2020-12 when no explicit $schema is provided.
   * Currently restricted to type: "object" at the root level.
   */
  outputSchema?: {
    $schema?: string;
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
  };

  /**
   * Optional additional tool information.
   */
  annotations?: ToolAnnotations;

  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

/**
 * Sent from the client to request a list of tools the server has.
 *
 * @category `tools/list`
 */
export interface ListToolsRequest extends JSONRPCRequest {
  method: "tools/list";
  params?: RequestParams;
}

/**
 * The server's response to a tools/list request from the client.
 *
 * @category `tools/list`
 */
export interface ListToolsResult extends Result {
  tools: Tool[];
}

/**
 * Parameters for a `tools/call` request.
 *
 * @category `tools/call`
 */
export interface CallToolRequestParams extends RequestParams {
  /**
   * The name of the tool.
   */
  name: string;
  /**
   * Arguments to use for the tool call.
   */
  arguments?: { [key: string]: unknown };
}

/**
 * Used by the client to invoke a tool provided by the server.
 *
 * @category `tools/call`
 */
export interface CallToolRequest extends JSONRPCRequest {
  method: "tools/call";
  params: CallToolRequestParams;
}

/**
 * The server's response to a tool call.
 *
 * @category `tools/call`
 */
export interface CallToolResult extends Result {
  /**
   * A list of content objects that represent the unstructured result of the tool call.
   */
  content: ContentBlock[];

  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError?: boolean;
}

/* Client messages */
/** @internal */
export type ClientRequest =
  | InitializeRequest
  | CallToolRequest
  | ListToolsRequest;

/** @internal */
export type ClientNotification = unknown;

/** @internal */
export type ClientResult = unknown;

/* Server messages */
/** @internal */
export type ServerRequest = unknown;

/** @internal */
export type ServerNotification = unknown;

/** @internal */
export type ServerResult =
  | InitializeResult
  | CallToolResult
  | ListToolsResult;
