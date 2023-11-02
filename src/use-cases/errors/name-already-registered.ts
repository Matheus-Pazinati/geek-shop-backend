export class NameAlreadyRegisteredError extends Error {
  constructor() {
    super("Nome do produto já cadastrado.")
  }
}