function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message; // Extract the message from an Error object
  }
  return String(error); // Convert other types (e.g., string, number) to string
}

export {getErrorMessage}