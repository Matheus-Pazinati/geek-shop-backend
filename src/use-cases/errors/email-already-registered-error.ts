export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email já cadastrado.")
  }
}