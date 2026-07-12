/**
 * Alice Chat Service
 * Handles communication between frontend and Alice local engine
 */

export interface AliceMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface AliceChatSession {
  messages: AliceMessage[];
  addMessage(role: 'user' | 'assistant', text: string): void;
  getResponse(userMessage: string): Promise<string>;
  clearHistory(): void;
  exportHistory(): AliceMessage[];
}

export function createAliceSession(): AliceChatSession {
  const messages: AliceMessage[] = [];

  return {
    messages,

    addMessage(role: 'user' | 'assistant', text: string) {
      messages.push({
        role,
        text,
        timestamp: Date.now(),
      });
    },

    async getResponse(userMessage: string): Promise<string> {
      // Add user message
      this.addMessage('user', userMessage);

      try {
        // Call local API endpoint (no external API)
        const response = await fetch('/api/alice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages.filter(m => m !== messages[messages.length - 1]),
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantResponse = data.text || 'Desculpe, tive um breve desvio de intuição astral. Poderia repetir?';

        // Add assistant response
        this.addMessage('assistant', assistantResponse);

        return assistantResponse;
      } catch (error) {
        console.error('Erro ao chamar Alice:', error);
        const errorResponse = 'Desculpe, tive um breve desvio de intuição astral devido a uma falha interna. Tente novamente em instantes! 🔮';
        this.addMessage('assistant', errorResponse);
        return errorResponse;
      }
    },

    clearHistory() {
      messages.length = 0;
    },

    exportHistory() {
      return [...messages];
    },
  };
}
