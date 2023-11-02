export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciais inválidas. E-mail ou senha incorretos.")
  }
}