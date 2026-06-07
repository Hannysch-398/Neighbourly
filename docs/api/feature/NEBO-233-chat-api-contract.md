# NEBO-233 - Chat API Contract

## POST /api/conversations

### Request

```json
{
  "participantUserId": 5
}
```

### Success Response

```json
{
  "id": 1,
  "createdAt": "2026-06-03T10:00:00",
  "updatedAt": "2026-06-03T10:00:00",
  "participants": [
    {
      "userId": 1
    },
    {
      "userId": 5
    }
  ]
}
```

---

## GET /api/conversations

### Success Response

```json
[
  {
    "id": 1,
    "createdAt": "2026-06-03T10:00:00",
    "updatedAt": "2026-06-03T10:15:00",
    "lastMessage": {
      "id": 10,
      "content": "Hallo",
      "createdAt": "2026-06-03T10:15:00"
    }
  }
]
```

---

## GET /api/conversations/{id}/messages

### Success Response

```json
[
  {
    "id": 1,
    "conversationId": 1,
    "senderUserId": 1,
    "content": "Hallo",
    "createdAt": "2026-06-03T10:00:00"
  }
]
```

---

## POST /api/conversations/{id}/messages

### Request

```json
{
  "content": "Hallo"
}
```

### Success Response

```json
{
  "id": 2,
  "conversationId": 1,
  "senderUserId": 1,
  "content": "Hallo",
  "createdAt": "2026-06-03T10:05:00"
}
```

---

## Decision

Für Direct Messages wird ein findOrCreate-Ansatz verwendet.

Existiert bereits eine Conversation zwischen zwei Teilnehmern, wird diese zurückgegeben.
Andernfalls wird eine neue Conversation erstellt.
