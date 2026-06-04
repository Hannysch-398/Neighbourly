# NEBO-152 - API Contract für Bildverwaltung

## Ziel

Dieser Contract definiert die API-Struktur für die Bildverwaltung von Posts, damit Frontend und Backend parallel arbeiten können.

---

## Image Object

```json
{
  "id": 1,
  "url": "https://example.com/images/post-1.jpg",
  "altText": "Bildbeschreibung",
  "orderIndex": 0,
  "createdAt": "2026-06-01T12:00:00"
}
```

### Felder

| Feld       | Typ           | Beschreibung                            |
| ---------- | ------------- | --------------------------------------- |
| id         | number        | Eindeutige ID des Bildes                |
| url        | string        | URL des Bildes                          |
| altText    | string | null | Alternativtext für Barrierefreiheit     |
| orderIndex | number        | Position des Bildes innerhalb des Posts |
| createdAt  | string        | Erstellungszeitpunkt im ISO-Format      |

---

## POST /api/posts/{id}/images

Lädt ein neues Bild für einen Post hoch.

### Request

```http
POST /api/posts/{id}/images
Content-Type: multipart/form-data
```

### Form Data

| Feld    | Typ    | Pflichtfeld | Beschreibung   |
| ------- | ------ | ----------- | -------------- |
| file    | File   | ja          | Bilddatei      |
| altText | string | nein        | Alternativtext |

### Success Response 201

```json
{
  "id": 1,
  "url": "https://example.com/images/post-1.jpg",
  "altText": "Bildbeschreibung",
  "orderIndex": 0,
  "createdAt": "2026-06-01T12:00:00"
}
```

---

## DELETE /api/posts/{postId}/images/{imageId}

Löscht ein Bild aus einem Post.

### Success Response 204

Kein Response Body.

---

## PATCH /api/posts/{postId}/images/{imageId}

Aktualisiert Metadaten eines Bildes, z. B. den Alternativtext.

### Request Body

```json
{
  "altText": "Neue Bildbeschreibung"
}
```

### Success Response 200

```json
{
  "id": 1,
  "url": "https://example.com/images/post-1.jpg",
  "altText": "Neue Bildbeschreibung",
  "orderIndex": 0,
  "createdAt": "2026-06-01T12:00:00"
}
```

---

## PUT /api/posts/{id}/images/order

Aktualisiert die Reihenfolge der Bilder eines Posts.

### Request Body

```json
{
  "imageIds": [3, 1, 2]
}
```

Die Reihenfolge der IDs entspricht der neuen Sortierung.

### Success Response 200

```json
[
  {
    "id": 3,
    "url": "https://example.com/images/post-3.jpg",
    "altText": "Drittes Bild",
    "orderIndex": 0,
    "createdAt": "2026-06-01T12:10:00"
  },
  {
    "id": 1,
    "url": "https://example.com/images/post-1.jpg",
    "altText": "Erstes Bild",
    "orderIndex": 1,
    "createdAt": "2026-06-01T12:00:00"
  }
]
```

---

## Fehlerformat

Das bestehende Fehlerformat des Projekts wird verwendet.

### Beispiel 400

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "file": "Bilddatei ist erforderlich."
  }
}
```

### Beispiel 404

```json
{
  "status": 404,
  "message": "Not found",
  "errors": {
    "image": "Bild wurde nicht gefunden."
  }
}
```
