// Shared context for step definitions

export class TestContext {
  constructor() {
    this.client = null;
  }
  
  getClient() {
    if (!this.client) {
      throw new Error('Client not initialized. Navigate to a page first.');
    }
    return this.client;
  }
  
  hasClient() {
    return this.client !== null;
  }
  
  getClientSafe() {
    return this.client;
  }
  
  setClient(client) {
    this.client = client;
  }
  
  clearClient() {
    this.client = null;
  }
}

// Global instance
export const testContext = new TestContext();
