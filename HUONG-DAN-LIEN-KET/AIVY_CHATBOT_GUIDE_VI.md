# 🤖 Aivy Chatbot - Hướng Dẫn Sử Dụng & Tích Hợp

**Mục Đích:** Hướng dẫn chi tiết cách tích hợp Aivy chatbot vào ứng dụng  
**Ngôn Ngữ:** Tiếng Việt  
**Trạng Thái:** ✅ Hoàn thành

---

## 📋 MỤC LỤC

1. [Aivy là gì?](#aivy-là-gì)
2. [Cấu Trúc API](#cấu-trúc-api)
3. [Web Integration](#web-integration)
4. [Mobile Integration](#mobile-integration)
5. [Zalo Integration](#zalo-integration)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Aivy Là Gì?

**Aivy** là AI Assistant thông minh hỗ trợ học tiếng Anh:

| Tính Năng | Chi Tiết |
|----------|---------|
| 💬 **Chat** | Trò chuyện tự do, hỏi câu hỏi, giải thích |
| 📖 **Giáo Dục** | Giải thích ngữ pháp, từ vựng, phát âm |
| ✍️ **Tạo Bài Tập** | Tự động tạo quiz, bài tập, bài đối thoại |
| 🎮 **Tương Tác** | Cá nhân hóa theo trình độ, sở thích |
| 🌐 **Đa Ngôn Ngữ** | Tiếng Việt & Tiếng Anh |

### Models Được Hỗ Trợ
- ✅ **Gemini** (Google) - Miễn phí, nhanh
- ✅ **GPT-4** (OpenAI) - Chính xác cao
- ✅ **Claude** (Anthropic) - Phân tích sâu
- ✅ **Grok** (xAI) - Thông tin real-time
- ✅ **DeepSeek** - Giá rẻ nhất
- ✅ **Ollama** - Tự host, offline

---

## 🏗️ Cấu Trúc API

### Endpoint Chính
```
POST /api/ai-router
```

### Request Format

```json
{
  "task": "admin_override_check",
  "data": {
    "userId": "user-123",
    "action": "chat_message_here"
  },
  "model_preference": "gemini"
}
```

### Parameters

| Parameter | Kiểu | Bắt Buộc | Ví Dụ | Mô Tả |
|-----------|-----|---------|-------|-------|
| `task` | string | ✅ | `"admin_override_check"` | Task cần thực hiện |
| `data.userId` | string | ✅ | `"user-123"` | ID user trong Firebase |
| `data.action` | string | ✅ | `"chat: What is present simple?"` | Hành động/message |
| `model_preference` | string | ❌ | `"gemini"` | Model AI ưu tiên (default: gemini) |

### Response Format

```json
{
  "canOverride": true,
  "modelUsed": "gemini",
  "response": {
    "message": "...",
    "suggestions": [],
    "context": {}
  }
}
```

---

## 💻 Web Integration

### Bước 1: Cài Đặt Dependencies

```bash
npm install firebase axios react-hook-form zod
```

### Bước 2: Tạo API Hook

```typescript
// src/hooks/useAivy.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export const useAivy = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, modelPreference = 'gemini') => {
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Thêm user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post('/ai-router', {
          task: 'admin_override_check',
          data: {
            userId: user.uid,
            action: `chat: ${content}`,
          },
          model_preference: modelPreference,
        });

        // Thêm assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response?.message || 'Xin lỗi, tôi không hiểu.',
          timestamp: new Date(),
          model: response.data.modelUsed,
        };
        setMessages(prev => [...prev, assistantMessage]);

        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Aivy error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};
```

### Bước 3: Tạo Chat Component

```typescript
// src/components/AivyChat.tsx
import { useState, useRef, useEffect } from 'react';
import { useAivy } from '@/hooks/useAivy';
import styles from './AivyChat.module.css';

interface AivyChatProps {
  title?: string;
  models?: string[];
}

export const AivyChat = ({
  title = 'Aivy - AI Assistant',
  models = ['gemini', 'openai', 'claude'],
}: AivyChatProps) => {
  const { messages, loading, error, sendMessage } = useAivy();
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    await sendMessage(input, selectedModel);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.modelSelector}>
          <label>Model:</label>
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
            {models.map(model => (
              <option key={model} value={model}>
                {model.charAt(0).toUpperCase() + model.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <p>👋 Xin chào! Tôi là Aivy.</p>
            <p>Hỏi tôi bất kỳ câu hỏi gì về tiếng Anh!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.avatar}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={styles.content}>
                <p>{msg.content}</p>
                {msg.model && (
                  <small className={styles.model}>{msg.model}</small>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className={styles.message + ' ' + styles.assistant}>
            <div className={styles.avatar}>🤖</div>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Hỏi Aivy..."
          disabled={loading}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Gửi...' : 'Gửi'}
        </button>
      </form>
    </div>
  );
};
```

### Bước 4: CSS Styling

```css
/* src/components/AivyChat.module.css */
.container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 20px;
}

.modelSelector {
  display: flex;
  gap: 8px;
  align-items: center;
}

.modelSelector select {
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
}

.error {
  padding: 12px;
  background: #fee;
  color: #c33;
  border-bottom: 1px solid #fcc;
}

.messagesContainer {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.message {
  display: flex;
  gap: 12px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  font-size: 24px;
  flex-shrink: 0;
}

.content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
}

.message.user .content {
  background: #667eea;
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.message.assistant .content {
  background: #f0f0f0;
  color: #333;
  border-radius: 18px 18px 18px 4px;
}

.model {
  font-size: 12px;
  opacity: 0.7;
  display: block;
  margin-top: 4px;
}

.typing {
  display: flex;
  gap: 4px;
  padding: 12px;
}

.typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: blink 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 60%, 100% {
    opacity: 0.5;
  }
  30% {
    opacity: 1;
  }
}

.inputForm {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.button:hover:not(:disabled) {
  background: #764ba2;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Bước 5: Sử Dụng trong Page

```typescript
// src/pages/chat.tsx
import { AivyChat } from '@/components/AivyChat';

export default function ChatPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Chat với Aivy</h1>
      <AivyChat 
        title="Aivy - Trợ Lý AI Học Tiếng Anh"
        models={['gemini', 'openai', 'claude', 'grok', 'deepseek']}
      />
    </div>
  );
}
```

---

## 📱 Mobile Integration

### Flutter Chat Widget

```dart
// lib/widgets/aivy_chat_widget.dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AivyChatWidget extends StatefulWidget {
  @override
  State<AivyChatWidget> createState() => _AivyChatWidgetState();
}

class _AivyChatWidgetState extends State<AivyChatWidget> {
  final ApiService _apiService = ApiService();
  final TextEditingController _controller = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;
  String _selectedModel = 'gemini';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _sendMessage() async {
    if (_controller.text.isEmpty) return;

    final userMessage = ChatMessage(
      text: _controller.text,
      isUser: true,
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMessage);
      _isLoading = true;
    });

    _controller.clear();

    try {
      final response = await _apiService.sendMessage(
        userId: 'user-id', // Get from Firebase
        message: userMessage.text,
        modelPreference: _selectedModel,
      );

      final assistantMessage = ChatMessage(
        text: response['response']['message'] ?? 'Xin lỗi, tôi không hiểu.',
        isUser: false,
        model: response['modelUsed'],
        timestamp: DateTime.now(),
      );

      setState(() {
        _messages.add(assistantMessage);
      });
    } catch (e) {
      setState(() {
        _messages.add(ChatMessage(
          text: 'Lỗi: ${e.toString()}',
          isUser: false,
          timestamp: DateTime.now(),
        ));
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF667eea), Color(0xFF764ba2)],
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Aivy',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              DropdownButton<String>(
                value: _selectedModel,
                dropdownColor: Colors.white,
                style: TextStyle(color: Colors.white),
                items: ['gemini', 'openai', 'claude', 'grok', 'deepseek']
                    .map(
                      (model) => DropdownMenuItem(
                        value: model,
                        child: Text(
                          model,
                          style: TextStyle(color: Colors.black),
                        ),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() => _selectedModel = value ?? 'gemini');
                },
              ),
            ],
          ),
        ),
        
        // Messages
        Expanded(
          child: _messages.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('👋', style: TextStyle(fontSize: 48)),
                      SizedBox(height: 16),
                      Text(
                        'Xin chào! Tôi là Aivy.',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      SizedBox(height: 8),
                      Text('Hỏi tôi về tiếng Anh!'),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: EdgeInsets.all(12),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final message = _messages[index];
                    return ChatBubble(message: message);
                  },
                ),
        ),
        
        // Input
        Padding(
          padding: EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  enabled: !_isLoading,
                  decoration: InputDecoration(
                    hintText: 'Hỏi Aivy...',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 8),
              FloatingActionButton(
                onPressed: _isLoading ? null : _sendMessage,
                child: Icon(_isLoading ? Icons.hourglass_top : Icons.send),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class ChatMessage {
  final String text;
  final bool isUser;
  final String? model;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    this.model,
    required this.timestamp,
  });
}

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:
          message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Container(
          constraints: BoxConstraints(maxWidth: 250),
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: message.isUser ? Color(0xFF667eea) : Colors.grey[200],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: message.isUser
                ? CrossAxisAlignment.end
                : CrossAxisAlignment.start,
            children: [
              Text(
                message.text,
                style: TextStyle(
                  color: message.isUser ? Colors.white : Colors.black,
                ),
              ),
              if (message.model != null)
                Text(
                  message.model!,
                  style: TextStyle(fontSize: 10, opacity: 0.7),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
```

---

## 💬 Zalo Integration

Aivy tự động trả lời messages trên Zalo OA:

**Webhook URL:**
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/zalo/webhook
```

**Cấu hình trong Zalo:**
1. Vào **Settings → Webhook**
2. Nhập URL trên
3. Backend tự động xử lý messages

---

## 🚀 Advanced Features

### 1. Context Management
```typescript
const sendMessage = async (content: string, context?: any) => {
  return await apiClient.post('/ai-router', {
    task: 'admin_override_check',
    data: {
      userId,
      action: content,
      context: {
        previousMessages: messages,
        userLevel: 'intermediate',
        preferences: context,
      },
    },
  });
};
```

### 2. Content Generation
```typescript
const generateContent = async (topic: string) => {
  return await apiClient.post('/ai-router', {
    task: 'generate_content',
    data: {
      topic,
      vocabulary: ['word1', 'word2'],
      grammar: 'Present Simple',
    },
  });
};
```

### 3. Model Fallback
```typescript
try {
  return await sendMessage(content, 'openai');
} catch {
  // Tự động fallback
  return await sendMessage(content, 'gemini');
}
```

---

## ❌ Troubleshooting

### Problem: "Unauthorized" Error
```
Giải pháp:
1. Kiểm tra Firebase token
2. Refresh token: await user.getIdToken(true)
3. Kiểm tra user roles
```

### Problem: Timeout
```
Giải pháp:
1. Tăng timeout: apiClient.defaults.timeout = 60000
2. Kiểm tra network
3. Thử model khác (DeepSeek ít stable hơn)
```

### Problem: "Model not configured"
```
Giải pháp:
1. Kiểm tra /api/models endpoint
2. Xem danh sách models configured
3. Thêm API key cho model đó
```

---

**Happy Chatting with Aivy! 🎉**
