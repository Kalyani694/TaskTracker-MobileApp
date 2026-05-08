import { Platform } from "react-native";
import type { AuthResponse, Task } from "../types";

const DEV_MACHINE_IP = "192.168.1.110";
const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : `http://${DEV_MACHINE_IP}:5000`;

const jsonHeaders = {
  "Content-Type": "application/json"
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(errorBody.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
};

export const signupRequest = (payload: { name: string; email: string; password: string }) => {
  return fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  }).then((res) => parseResponse<AuthResponse>(res));
};

export const loginRequest = (payload: { email: string; password: string }) => {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  }).then((res) => parseResponse<AuthResponse>(res));
};

export const fetchTasksRequest = (token: string) => {
  return fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => parseResponse<Task[]>(res));
};

export const createTaskRequest = (token: string, payload: { title: string; description?: string }) => {
  return fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  }).then((res) => parseResponse<Task>(res));
};

export const updateTaskRequest = (
  token: string,
  id: string,
  payload: { title?: string; description?: string; completed?: boolean }
) => {
  return fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  }).then((res) => parseResponse<Task>(res));
};

export const deleteTaskRequest = (token: string, id: string) => {
  return fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => parseResponse<void>(res));
};
