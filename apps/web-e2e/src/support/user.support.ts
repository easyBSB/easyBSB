import { APIRequestContext, APIResponse } from "@playwright/test";
import { User } from "../fixtures/User";

interface CreateUser {
  name: string,
  password: string,
  role: "read" | "write" | "admin"
}

export async function createUser(
  request: APIRequestContext,
  token: string,
  body: CreateUser,
): Promise<User> {
  return request
    .put(`http://localhost:3333/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: body,
    })
    .then((response: APIResponse) => {
      if (response.status() !== 200) {
        throw response.statusText();
      }
      return response.body();
    })
    .then((body) => {
      const data = JSON.parse(body.toString('utf-8'));
      return data;
    })
}

export function removeUser(request: APIRequestContext, token: string, id: User['id']): Promise<void> {
  return request
    .delete(`http://localhost:3333/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    .then((response: APIResponse) => {
      if (response.status() !== 200) {
        throw `Could not delete user with specific id ${id}`
      }
    })
  }
