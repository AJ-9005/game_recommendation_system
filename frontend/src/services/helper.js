function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export async function fetchAPI(endpoint, options = {}) {
  const token = getCookie('token');

  // Build headers dynamically
  const headers = {
    ...options.headers,
  };

  // Only set application/json if Content-Type wasn't explicitly provided
  if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach token if present
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:8000${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 204 No Content responses cleanly
  if (response.status === 204) {
    return true;
  }

  const data = await response.json();

  if (!response.ok) {
    // Throw the parsed backend JSON so catch blocks receive err.detail
    throw data;
  }

  return data;
}