function getToken(): string | null {
  return localStorage.getItem("agrivet_token");
}

function getHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || "Request failed");
  }
  return res.json();
}

export const apiClient = {
  get: (url: string) =>
    fetch(url, { headers: getHeaders() }).then(handleResponse),

  post: (url: string, body: unknown) =>
    fetch(url, { method: "POST", headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  postForm: (url: string, formData: FormData) =>
    fetch(url, { method: "POST", headers: getHeaders(true), body: formData }).then(handleResponse),

  put: (url: string, body: unknown) =>
    fetch(url, { method: "PUT", headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  delete: (url: string) =>
    fetch(url, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
};
