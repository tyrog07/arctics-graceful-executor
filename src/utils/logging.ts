export function logExecution(error: unknown, result?: any) {
  if (error) {
    console.error('Execution failed:', error);
  } else {
    console.log('Execution succeeded:', result);
  }
}
