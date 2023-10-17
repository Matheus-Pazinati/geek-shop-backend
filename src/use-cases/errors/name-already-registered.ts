export class NameAlreadyRegisteredError extends Error {
  constructor() {
    super("Name already registered.")
  }
}