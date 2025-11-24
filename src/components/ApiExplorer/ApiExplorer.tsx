import React, { useState, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './ApiExplorer.module.css';
import { Lock, FileText, Upload, Play, Loader2, Code2, XCircle, Download, ClipboardList } from 'lucide-react';

interface Parameter {
  name: string;
  type: 'path' | 'query' | 'header';
  required: boolean;
  description: string;
  example?: string;
  enum?: string[];
}

interface ApiExplorerProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  title?: string;
  description?: string;
  parameters?: Parameter[];
  bodyExample?: object;
  responseExample?: object;
  requiresAuth?: boolean;
  baseUrl?: string;
  defaultDeviceId?: boolean;
}

export default function ApiExplorer({
  endpoint,
  method = 'GET',
  title,
  description,
  parameters = [],
  bodyExample,
  responseExample,
  requiresAuth = true,
  baseUrl = 'https://cloud.mybox.pro/admin-panel/v1',
  defaultDeviceId = false
}: ApiExplorerProps) {
  const { colorMode } = useColorMode();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState(bodyExample ? JSON.stringify(bodyExample, null, 2) : '');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'javascript'>('curl');
  const [deviceList, setDeviceList] = useState<any[]>([]);

  // Load saved credentials from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('mybox_api_key');
      const savedSecret = localStorage.getItem('mybox_api_secret');
      if (savedKey) setApiKey(savedKey);
      if (savedSecret) setApiSecret(savedSecret);

      // Initialize parameter values with examples
      const initialValues: Record<string, string> = {};
      parameters.forEach(param => {
        if (param.example) {
          initialValues[param.name] = param.example;
        }
      });
      setParamValues(initialValues);
    }
  }, [parameters]);

  // Fetch device list if needed
  useEffect(() => {
    if (defaultDeviceId && apiKey && apiSecret) {
      fetchDeviceList();
    }
  }, [defaultDeviceId, apiKey, apiSecret]);

  const fetchDeviceList = async () => {
    try {
      const response = await fetch(`${baseUrl}/external/device`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${apiKey}:${apiSecret}`),
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDeviceList(data.data || []);

        // Auto-select first device if deviceId parameter exists
        if (data.data && data.data.length > 0) {
          const deviceIdParam = parameters.find(p => p.name === 'deviceId');
          if (deviceIdParam && !paramValues.deviceId) {
            setParamValues(prev => ({ ...prev, deviceId: data.data[0].identifier }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    }
  };

  // Build final URL
  const buildUrl = () => {
    let url = `${baseUrl}${endpoint}`;

    // Replace path parameters
    parameters.filter(p => p.type === 'path').forEach(param => {
      const value = paramValues[param.name] || `{${param.name}}`;
      url = url.replace(`{${param.name}}`, value);
    });

    // Add query parameters
    const queryParams = parameters
      .filter(p => p.type === 'query' && paramValues[p.name])
      .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name])}`)
      .join('&');

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  };

  // Generate code examples
  const generateCurl = () => {
    const url = buildUrl();
    let curl = `curl -X ${method} "${url}"`;

    if (requiresAuth) {
      curl += ` \\\n  -u "${apiKey || 'YOUR_API_KEY'}:${apiSecret || 'YOUR_API_SECRET'}"`;
    }

    curl += ` \\\n  -H "Accept: application/json"`;

    if (method !== 'GET' && requestBody) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${requestBody}'`;
    }

    return curl;
  };

  const generatePython = () => {
    const url = buildUrl();
    let code = `import requests
from requests.auth import HTTPBasicAuth

# API credentials
API_KEY = "${apiKey || 'YOUR_API_KEY'}"
API_SECRET = "${apiSecret || 'YOUR_API_SECRET'}"

# Make request
response = requests.${method.toLowerCase()}(
    "${url}",`;

    if (requiresAuth) {
      code += `\n    auth=HTTPBasicAuth(API_KEY, API_SECRET),`;
    }

    code += `\n    headers={"Accept": "application/json"}`;

    if (method !== 'GET' && requestBody) {
      code += `,\n    json=${requestBody.replace(/"/g, "'")}`;
    }

    code += `
)

# Handle response
if response.status_code == 200:
    data = response.json()
    print("Success:", data)
else:
    print(f"Error: {response.status_code}")
    print(response.text)`;

    return code;
  };

  const generateJavaScript = () => {
    const url = buildUrl();
    let code = `// Using fetch API
const API_KEY = '${apiKey || 'YOUR_API_KEY'}';
const API_SECRET = '${apiSecret || 'YOUR_API_SECRET'}';

async function callAPI() {
  try {
    const response = await fetch('${url}', {
      method: '${method}',
      headers: {`;

    if (requiresAuth) {
      code += `\n        'Authorization': 'Basic ' + btoa(\`\${API_KEY}:\${API_SECRET}\`),`;
    }

    code += `\n        'Accept': 'application/json'`;

    if (method !== 'GET' && requestBody) {
      code += `,\n        'Content-Type': 'application/json'`;
    }

    code += `\n      }`;

    if (method !== 'GET' && requestBody) {
      code += `,\n      body: JSON.stringify(${requestBody})`;
    }

    code += `
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
      return data;
    } else {
      console.error('Error:', response.status);
      const error = await response.text();
      console.error(error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Execute
callAPI();`;

    return code;
  };

  // Execute API request
  const executeRequest = async () => {
    if (requiresAuth && (!apiKey || !apiSecret)) {
      setError('Prosím zadejte API Key a API Secret');
      return;
    }

    // Save credentials to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mybox_api_key', apiKey);
      localStorage.setItem('mybox_api_secret', apiSecret);
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      if (requiresAuth) {
        headers['Authorization'] = 'Basic ' + btoa(`${apiKey}:${apiSecret}`);
      }

      if (method !== 'GET' && requestBody) {
        headers['Content-Type'] = 'application/json';
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

  const methodColors = {
    GET: '#61AFFE',
    POST: '#49CC90',
    PUT: '#FCA130',
    DELETE: '#F93E3E',
    PATCH: '#50E3C2'
  };

  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => (
        <div className={styles.apiExplorer} data-theme={colorMode}>
          {/* Header */}
          <div className={styles.header}>
            <span
              className={styles.methodBadge}
              style={{ backgroundColor: methodColors[method] }}
            >
              {method}
            </span>
            <code className={styles.endpoint}>{endpoint}</code>
          </div>

          {title && <h3>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}

          {/* Authentication */}
          {requiresAuth && (
            <div className={styles.section}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} color="var(--ifm-color-primary)" /> Autentizace
              </h4>
              <div className={styles.authInputs}>
                <input
                  type="text"
                  placeholder="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* Parameters */}
          {parameters.length > 0 && (
            <div className={styles.section}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--ifm-color-primary)" /> Parametry
              </h4>
              {parameters.map(param => (
                <div key={param.name} className={styles.parameter}>
                  <label>
                    <span className={styles.paramName}>
                      {param.name}
                      {param.required && <span className={styles.required}>*</span>}
                    </span>
                    <span className={styles.paramType}>({param.type})</span>
                    <div className={styles.paramDescription}>{param.description}</div>
                  </label>

                  {/* Special handling for deviceId with dropdown */}
                  {param.name === 'deviceId' && deviceList.length > 0 ? (
                    <select
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                      className={styles.input}
                    >
                      <option value="">Vyberte zařízení...</option>
                      {deviceList.map(device => (
                        <option key={device.identifier} value={device.identifier}>
                          {device.title || device.system_title} ({device.identifier})
                        </option>
                      ))}
                    </select>
                  ) : param.enum ? (
                    <select
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                      className={styles.input}
                    >
                      <option value="">Vyberte...</option>
                      {param.enum.map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={param.example || `Zadejte ${param.name}`}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                      className={styles.input}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Request Body */}
          {method !== 'GET' && (
            <div className={styles.section}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} color="var(--ifm-color-primary)" /> Request Body
              </h4>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className={styles.textarea}
                rows={8}
                placeholder="JSON body"
              />
            </div>
          )}

          {/* Execute Button */}
          <div className={styles.section}>
            <button
              onClick={executeRequest}
              disabled={loading}
              className={styles.executeButton}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Načítání...
                </>
              ) : (
                <>
                  <Play size={18} /> Spustit Request
                </>
              )}
            </button>
          </div>

          {/* Code Examples */}
          <div className={styles.section}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={20} color="var(--ifm-color-primary)" /> Příklady kódu
            </h4>
            <div className={styles.tabs}>
              <button
                className={selectedLang === 'curl' ? styles.activeTab : styles.tab}
                onClick={() => setSelectedLang('curl')}
              >
                cURL
              </button>
              <button
                className={selectedLang === 'python' ? styles.activeTab : styles.tab}
                onClick={() => setSelectedLang('python')}
              >
                Python
              </button>
              <button
                className={selectedLang === 'javascript' ? styles.activeTab : styles.tab}
                onClick={() => setSelectedLang('javascript')}
              >
                JavaScript
              </button>
            </div>
            <CodeBlock language={selectedLang === 'curl' ? 'bash' : selectedLang}>
              {selectedLang === 'curl' ? generateCurl() :
               selectedLang === 'python' ? generatePython() :
               generateJavaScript()}
            </CodeBlock>
          </div>

          {/* Error Display */}
          {error && (
            <div className={styles.error} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={20} color="#EF4444" />
              <span><strong>Chyba:</strong> {error}</span>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className={styles.section}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={20} color="var(--ifm-color-primary)" /> Odpověď
              </h4>
              <div className={response.status >= 200 && response.status < 300 ? styles.successStatus : styles.errorStatus}>
                <strong>Status:</strong> {response.status} {response.statusText}
              </div>
              <CodeBlock language="json">
                {JSON.stringify(response.data, null, 2)}
              </CodeBlock>
            </div>
          )}

          {/* Response Example */}
          {responseExample && !response && (
            <div className={styles.section}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={20} color="var(--ifm-color-primary)" /> Příklad odpovědi
              </h4>
              <CodeBlock language="json">
                {JSON.stringify(responseExample, null, 2)}
              </CodeBlock>
            </div>
          )}
        </div>
      )}
    </BrowserOnly>
  );
}