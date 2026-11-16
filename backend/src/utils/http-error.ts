export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly headers: Record<string, string> = {}
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message = "Нэвтрэх шаардлагатай.") =>
  new HttpError(401, message);
export const forbidden = (message = "Админ эрх шаардлагатай.") =>
  new HttpError(403, message);
export const notFound = (message = "Олдсонгүй.") =>
  new HttpError(404, message);
export const conflict = (message: string, headers?: Record<string, string>) =>
  new HttpError(409, message, headers);
export const internal = (message = "Серверийн алдаа гарлаа.") =>
  new HttpError(500, message);
export const serviceUnavailable = (message: string) =>
  new HttpError(503, message);
