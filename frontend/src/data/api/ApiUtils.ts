export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleJsonResponse<T>(res: Promise<Response>): Promise<T> {
  return res.then(async e => {
    if (e.status === 200) {
      return await e.json();
    }
    throw new ApiError(e.status, 'Api error ' + e.status + ': ' + await e.text());
  });
}