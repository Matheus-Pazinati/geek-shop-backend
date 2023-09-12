export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials. Incorrect e-mail or password.")
  }
}