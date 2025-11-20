import React, { useState, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';

interface ApiExplorerProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requiresAuth?: boolean;
  pathParams?: { name: string; description: string; example: string }[];
  queryParams?: { name: string; description: string; required?: boolean; example?: string }[];
  bodyExample?: object;
}

export default function ApiExplorer({
  endpoint,
  method,
  description,
  requiresAuth = true,
  pathParams = [],
  queryParams = [],
  bodyExample
}: ApiExplorerProps) {
  const { colorMode } = useColorMode();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState(bodyExample ? JSON.stringify(bodyExample, null, 2) : '');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize path values
  useEffect(() => {
    const initialPathValues: Record<string, string> = {};
    pathParams.forEach(param => {
      initialPathValues[param.name] = param.example || '';
    });
    setPathValues(initialPathValues);
  }, [pathParams]);

  // Build final URL
  const buildUrl = () => {
    let url = `https://cloud.mybox.pro/admin-panel/v1${endpoint}`;
    
    // Replace path parameters
    pathParams.forEach(param => {
      url = url.replace(`{${param.name}}`, pathValues[param.name] || `{${param.name}}`);
    });

    // Add query parameters
    const queryString = Object.entries(queryValues)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  };

  // Execute API request
  const executeRequest = async () => {
    if (requiresAuth && (!apiKey || !apiSecret)) {
      setError('Prosím zadejte API Key a API Secret');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (requiresAuth) {
        headers['Authorization'] = 'Basic ' + btoa(`${apiKey}:${apiSecret}`);
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(buildUrl(), options);
      const data = await res.json();

      if (!res.ok) {
        setError(`Error ${res.status}: ${res.statusText}`);
      }
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba při volání API');
    } finally {
      setLoading(false);
    }
  };

  // Generate curl command
  const generateCurl = () => {
    let curl = `curl -X ${method} "${buildUrl()}"`;
    
    if (requiresAuth) {
      curl += ` \\\n  -u "YOUR_API_KEY:YOUR_API_SECRET"`;
    }
    
    curl += ` \\\n  -H "Accept: application/json"`;
    
    if (method !== 'GET' && requestBody) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${requestBody}'`;
    }
    
    return curl;
  };

  const methodColors = {
    GET: '#10B981',
    POST: '#3B82F6',
    PUT: '#F59E0B',
    DELETE: '#EF4444',
    PATCH: '#8B5CF6'
  };

  return (
    <div className="api-explorer" style={{
      backgroundColor: colorMode === 'dark' ? '#161B22' : '#ffffff',
      border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#E5E7EB'}`,
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{
            backgroundColor: methodColors[method],
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}>
            {method}
          </span>
          <code style={{ fontSize: '1rem' }}>{endpoint}</code>
        </div>
        {description && <p style={{ margin: '0.5rem 0', color: colorMode === 'dark' ? '#8B949E' : '#6B7280' }}>{description}</p>}
      </div>

      {/* Authentication */}
      {requiresAuth && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>🔑 Autentizace</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#D1D5DB'}`,
                backgroundColor: colorMode === 'dark' ? '#0D1117' : '#F9FAFB'
              }}
            />
            <input
              type="password"
              placeholder="API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#D1D5DB'}`,
                backgroundColor: colorMode === 'dark' ? '#0D1117' : '#F9FAFB'
              }}
            />
          </div>
        </div>
      )}

      {/* Path Parameters */}
      {pathParams.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>📍 Path Parametry</h4>
          {pathParams.map(param => (
            <div key={param.name} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                {param.name} - {param.description}
              </label>
              <input
                type="text"
                placeholder={param.example}
                value={pathValues[param.name] || ''}
                onChange={(e) => setPathValues({ ...pathValues, [param.name]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#D1D5DB'}`,
                  backgroundColor: colorMode === 'dark' ? '#0D1117' : '#F9FAFB'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Query Parameters */}
      {queryParams.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>❓ Query Parametry</h4>
          {queryParams.map(param => (
            <div key={param.name} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                {param.name} {param.required && <span style={{ color: '#EF4444' }}>*</span>} - {param.description}
              </label>
              <input
                type="text"
                placeholder={param.example || 'volitelné'}
                value={queryValues[param.name] || ''}
                onChange={(e) => setQueryValues({ ...queryValues, [param.name]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#D1D5DB'}`,
                  backgroundColor: colorMode === 'dark' ? '#0D1117' : '#F9FAFB'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Request Body */}
      {method !== 'GET' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>📝 Request Body</h4>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${colorMode === 'dark' ? '#30363D' : '#D1D5DB'}`,
              backgroundColor: colorMode === 'dark' ? '#0D1117' : '#F9FAFB',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          />
        </div>
      )}

      {/* Execute Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={executeRequest}
          disabled={loading}
          style={{
            backgroundColor: '#00A651',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Načítání...' : '▶️ Spustit Request'}
        </button>
      </div>

      {/* cURL Command */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>🔧 cURL příkaz</h4>
        <CodeBlock language="bash">{generateCurl()}</CodeBlock>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <strong>❌ Chyba:</strong> {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div>
          <h4>📨 Odpověď</h4>
          <div style={{
            backgroundColor: response.status >= 200 && response.status < 300 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${response.status >= 200 && response.status < 300 ? '#10B981' : '#EF4444'}`,
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem'
          }}>
            <strong>Status:</strong> {response.status} {response.statusText}
          </div>
          <CodeBlock language="json">
            {JSON.stringify(response.data, null, 2)}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}