import type { HelloResponse } from '../types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getHello(): Promise<HelloResponse> {
  let response: Response;
  try {
    response = await fetch('/api/hello', {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new ApiError('Não foi possível ligar à API.', 0);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
        ? body.error
        : `A API respondeu com o estado ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('message' in body) ||
    typeof body.message !== 'string' ||
    !('studyGroups' in body) ||
    typeof body.studyGroups !== 'number'
  ) {
    throw new ApiError('A resposta da API não corresponde ao contrato de /api/hello.', response.status);
  }

  return body as HelloResponse;
}
