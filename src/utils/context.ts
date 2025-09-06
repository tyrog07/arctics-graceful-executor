export function handleContext(
  error: unknown,
  options: { context?: Record<string, any> } = {},
) {
  if (options.context) {
    console.error('Error context:', options.context);
  }
}
