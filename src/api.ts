const API_BASE_URL = import.meta.env.VITE_API_URL || "https://unmutative-countercurrently-leopoldo.ngrok-free.dev";
// console.log("API Base URL:", API_BASE_URL);

interface LoginPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
}

interface VotePayload {
  pollId: string;
  optionId: string;
}

interface PollsQuery {
  filter: "popular" | "recent" | "new" | "mypolls";
  page?: number;
  offset?: number;
  limit?: number;
}

interface TestPayload {
  name: string;
}

export const api = {
  async test(payload: TestPayload) {
    const response = await fetch(`${API_BASE_URL}/auth/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) throw new Error("Test failed");
    const data = await response.json();
    // console.log("Test response:", data);
    return data;
  },

  async login(payload: LoginPayload) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
    const data = await response.json();
    // console.log("login response:", data);
    return data;
  },

  async signUp(payload: SignUpPayload) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0] || error.error || "Sign up failed");
    }
    const data = await response.json();
    // console.log("signup response:", data);
    return data;
  },

  async fetchPolls(query: PollsQuery) {
    let endpoint = '/poll/popular';
    if (query.filter === 'recent') endpoint = '/poll/recent';
    else if (query.filter === 'new') endpoint = '/poll/new';
    else if (query.filter === 'mypolls') endpoint = '/poll/mypolls';
    else if (query.filter === 'popular') endpoint = '/poll/popular';

    const pageParam = query.page ? `?page=${query.page}` : '';
    const response = await fetch(`${API_BASE_URL}${endpoint}${pageParam}`, {
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch polls");
    return response.json();
  },

  async submitVote(pollId: string, optionNumber: number) {
    const response = await fetch(`${API_BASE_URL}/poll/votepoll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ pollId, optionNumber }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to submit vote");
    return response.json();
  },

  async createPoll(payload: { title: string; opt1: string; opt2: string; opt3: string | null; opt4: string | null }) {
    const response = await fetch(`${API_BASE_URL}/poll/createpoll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create poll");
    }
    return response.json();
  },

  async peekPoll(pollId: string) {
    const response = await fetch(`${API_BASE_URL}/poll/${pollId}/peek`, {
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error("Failed to peek poll");
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    return response.json();
  },
};
