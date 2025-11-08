# IVSLearning API Documentation

## 📋 Overview

IVSLearning API provides a comprehensive REST interface for managing courses, user learning progress, analytics, and applications.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ IVSLearning Frontend (Static HTML + JS)                     │
│ - https://ivslearning.web.app                               │
│ - index-new.html, courses.html, applications.html, etc.     │
└──────────────────────────┬──────────────────────────────────┘
                           │ API Calls (with api-services)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend App Hosting (OAuth + API Key Management)            │
│ - https://backend-studio-ivssever--ivs-159a7.us-east4...   │
│ - OAuth callback handler                                     │
│ - Secure API Key storage & distribution                     │
│ - User authentication & session management                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Returns API Credentials
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ IVSLearning Learning API (https://api.ivslearning.top/v1)  │
│ - Courses, Learning Paths, Progress, Analytics, Apps        │
│ - Protected by API Keys & Bearer Tokens                     │
└─────────────────────────────────────────────────────────────┘
```

**URLs:**
- Frontend: `https://ivslearning.web.app`
- Backend: `https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app`
- Learning API: `https://api.ivslearning.top/v1`

## 🔐 Authentication

### API Key Authentication
```javascript
// Configuration in .env
VITE_IVS_API_KEY=your-api-key
VITE_IVS_SECRET_KEY=your-secret-key
VITE_IVS_BEARER_TOKEN=your-bearer-token
```

### Headers
```
Authorization: Bearer {BEARER_TOKEN}
X-API-Key: {API_KEY}
Content-Type: application/json
```

## 🌐 API Endpoints

### Base URL
```
https://api.ivslearning.top/v1
```

### Courses API

#### Get All Courses
```
GET /courses
Query Parameters:
  - category: string (optional)
  - level: string (optional) - beginner, intermediate, advanced
  - search: string (optional)
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  "courses": [
    {
      "id": "course-123",
      "title": "React.js Basics",
      "description": "...",
      "category": "programming",
      "level": "beginner",
      "rating": 4.8,
      "students": 2500,
      "price": "free",
      "duration": 42,
      "modules": 18
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250
  }
}
```

#### Get Course Detail
```
GET /courses/{courseId}

Response:
{
  "id": "course-123",
  "title": "React.js From Basics to Advanced",
  "description": "...",
  "instructor": {
    "id": "instructor-1",
    "name": "Nguyễn Dev",
    "avatar": "..."
  },
  "modules": [
    {
      "id": "module-1",
      "title": "React Basics",
      "lessons": [...]
    }
  ],
  "rating": 4.8,
  "reviews": 2543,
  "students": 25000,
  "price": "free",
  "duration": 42
}
```

#### Get Course Modules
```
GET /courses/{courseId}/modules

Response:
{
  "modules": [
    {
      "id": "module-1",
      "title": "React Basics",
      "description": "...",
      "lessons": 4,
      "duration": 3,
      "lessons": [
        {
          "id": "lesson-1",
          "title": "What is React?",
          "type": "video",
          "duration": 45,
          "completed": true
        }
      ]
    }
  ]
}
```

### Learning Paths API

#### Get All Learning Paths
```
GET /learning-paths

Response:
{
  "paths": [
    {
      "id": "path-1",
      "title": "Full Stack Developer",
      "description": "...",
      "difficulty": "advanced",
      "courses": 8,
      "duration": 120,
      "progress": 60
    }
  ]
}
```

#### Get Learning Path Detail
```
GET /learning-paths/{pathId}

Response:
{
  "id": "path-1",
  "title": "Full Stack Developer",
  "courses": [
    {
      "id": "course-1",
      "title": "JavaScript Fundamentals",
      "order": 1,
      "completed": true
    },
    {
      "id": "course-2",
      "title": "React & Frontend",
      "order": 2,
      "completed": true
    }
  ]
}
```

### User Progress API

#### Get User Progress
```
GET /user/progress

Response:
{
  "totalHours": 128,
  "coursesEnrolled": 5,
  "coursesCompleted": 12,
  "certificates": 3,
  "learningStreak": 15,
  "currentCourses": [
    {
      "courseId": "course-123",
      "progress": 60,
      "lastAccessed": "2024-11-09T10:30:00Z"
    }
  ]
}
```

#### Get Course Progress
```
GET /user/progress/courses/{courseId}

Response:
{
  "courseId": "course-123",
  "progress": 60,
  "completedModules": 3,
  "totalModules": 5,
  "completedLessons": 12,
  "totalLessons": 18,
  "lastAccessed": "2024-11-09T10:30:00Z",
  "estimatedCompletion": "2024-11-20T15:00:00Z"
}
```

#### Update Lesson Progress
```
PUT /courses/{courseId}/modules/{moduleId}/lessons/{lessonId}/progress

Body:
{
  "watched": 50,
  "total": 100,
  "completed": false,
  "notes": "..."
}

Response:
{
  "success": true,
  "progress": 50
}
```

### Analytics API

#### Get User Statistics
```
GET /analytics/user-stats

Response:
{
  "totalLearningHours": 128,
  "averageLearningPerDay": 2.5,
  "coursesEnrolled": 5,
  "coursesCompleted": 12,
  "successRate": 95,
  "learningStreak": 15,
  "certificatesEarned": 3,
  "skillsGained": ["React", "JavaScript", "Python"],
  "recommendedNextCourses": [...]
}
```

#### Track Event
```
POST /analytics/events

Body:
{
  "event": "lesson_completed",
  "data": {
    "courseId": "course-123",
    "lessonId": "lesson-45"
  }
}

Response:
{
  "success": true
}
```

### Applications API

#### Get All Applications
```
GET /applications

Response:
{
  "applications": [
    {
      "id": "app-aivy",
      "name": "AIVY - AI Learning Assistant",
      "status": "active",
      "description": "...",
      "features": ["Question Answering", "Homework Help", "Personalized Learning"]
    }
  ]
}
```

#### Query AIVY (AI Assistant)
```
POST /applications/aivy/query

Body:
{
  "question": "How do React hooks work?",
  "context": {
    "courseId": "course-123",
    "topicId": "hooks"
  }
}

Response:
{
  "answer": "React hooks are...",
  "references": [
    {
      "type": "lesson",
      "id": "lesson-456",
      "title": "Understanding React Hooks"
    }
  ],
  "relatedTopics": ["State Management", "useEffect", "useState"]
}
```

### User Profile API

#### Get User Profile
```
GET /user/profile

Response:
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "...",
  "bio": "...",
  "joinDate": "2024-01-15",
  "timezone": "Asia/Ho_Chi_Minh",
  "preferences": {
    "language": "vi",
    "emailNotifications": true,
    "theme": "dark"
  }
}
```

#### Update User Profile
```
PUT /user/profile/update

Body:
{
  "name": "John Doe",
  "bio": "...",
  "avatar": "...",
  "preferences": {
    "language": "vi",
    "emailNotifications": true
  }
}

Response:
{
  "success": true,
  "user": {...}
}
```

## 🛠️ Usage Examples

### JavaScript/TypeScript

#### Using API Services (Recommended)
```javascript
import { apiServices } from './js/api-services.js';

// Get all courses
const courses = await apiServices.courses.getAllCourses({
  category: 'programming',
  level: 'beginner'
});

// Get user progress
const progress = await apiServices.progress.getUserProgress();

// Complete a lesson
await apiServices.progress.completeLesson(
  'course-123',
  'module-1',
  'lesson-45'
);

// Query AIVY
const answer = await apiServices.applications.queryAIVY(
  'How do React hooks work?',
  { courseId: 'course-123' }
);
```

#### Using API Client Directly
```javascript
import { apiClient } from './js/api-client.js';

// Make custom request
const courses = await apiClient.get('/courses?category=programming');

// With POST
const enrolled = await apiClient.post('/courses/123/enroll', {});
```

## ⚙️ Configuration

### Environment Variables
```bash
# API endpoint
VITE_IVS_API_URL=https://api.ivslearning.top

# Authentication
VITE_IVS_API_KEY=your-key
VITE_IVS_SECRET_KEY=your-secret
VITE_IVS_BEARER_TOKEN=your-token

# Environment
NODE_ENV=development
VITE_ENV=development
```

### API Client Configuration
```javascript
// Auto-retries: 3 attempts with exponential backoff
// Timeout: 30 seconds
// Cache: 5 minutes TTL for GET requests
// Rate Limiting: 100 requests per minute
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": true,
  "code": "COURSE_NOT_FOUND",
  "message": "Course with ID 'course-123' not found",
  "statusCode": 404,
  "timestamp": "2024-11-09T10:30:00Z"
}
```

### Common Error Codes
- `UNAUTHORIZED` - 401: Missing/invalid authentication
- `FORBIDDEN` - 403: Insufficient permissions
- `NOT_FOUND` - 404: Resource not found
- `VALIDATION_ERROR` - 400: Invalid request data
- `RATE_LIMITED` - 429: Too many requests
- `SERVER_ERROR` - 500: Internal server error

## 📊 Rate Limiting

- **Limit**: 100 requests per minute
- **Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Auto-wait**: Client automatically waits when limit exceeded

## 💾 Caching

- **Enabled for**: GET requests
- **TTL**: 5 minutes
- **Cache Clear**: Manually or on data mutation

## 🔗 Integration Examples

### React Component
```jsx
import { useEffect, useState } from 'react';
import { apiServices } from './js/api-services.js';

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServices.courses.getAllCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render courses */}</div>;
}
```

## 📞 Support

- Email: api-support@ivslearning.top
- Documentation: https://docs.ivslearning.top
- Status Page: https://status.ivslearning.top
