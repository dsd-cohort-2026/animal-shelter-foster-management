import apiClient from '@/lib/axios';

export async function sendChatMessage(messages) {
  const response = await apiClient.post('/chat', { messages });
  return response.data.reply;
}
