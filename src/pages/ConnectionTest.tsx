import { useState, useEffect } from 'react';

interface ServerResponse {
  message: string;
}

function ConnectionTest() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/test');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }

      const data: ServerResponse = await response.json();
      setMessage(data.message);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setError('Failed to parse server response as JSON');
      } else if (err instanceof TypeError) {
        setError('Server did not return JSON');
      } else if (err instanceof Error) {
        setError(`Failed to connect to the backend: ${err.message}`);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h2>Backend Connection Test</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={testConnection}>Test Connection</button>
    </div>
  );
}

export default ConnectionTest;