export class ServerError extends Error {
  constructor() {
    super("serverError");
    this.name = "ServerError";
  }
}
