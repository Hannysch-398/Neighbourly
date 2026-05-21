# Update & Delete Post API Contract

## Update Post

### Endpoint

PUT /api/posts/{id}

### Beschreibung

Aktualisiert einen bestehenden Beitrag des eingeloggten Nutzers.

### Request Body

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "isUrgent": true,
  "urgentUntil": "2026-06-01T18:00:00"
}
Felder
Feld	Typ	Pflicht	Beschreibung
title	string	ja	Titel des Beitrags
description	string	ja	Beschreibung des Beitrags
isUrgent	boolean	nein	Markiert Beitrag als dringend
urgentUntil	datetime	nein	Nur erlaubt wenn isUrgent=true
Erfolgreiche Response

Status:

200 OK

Response:

{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "type": "PRODUCT",
  "postMode": "OFFER",
  "isUrgent": true,
  "urgentUntil": "2026-06-01T18:00:00",
  "createdAt": "2026-05-21T12:00:00",
  "status": "ACTIVE",
  "updatedAt": "2026-05-21T14:00:00"
}
Fehlerfälle
Status	Bedeutung
400 Bad Request	Ungültige Eingabedaten
401 Unauthorized	Nutzer nicht eingeloggt
403 Forbidden	Nutzer darf Beitrag nicht bearbeiten
404 Not Found	Beitrag nicht gefunden
Delete Post
Endpoint

DELETE /api/posts/{id}

Beschreibung

Löscht einen Beitrag per Soft Delete.

Verhalten

Der Beitrag wird nicht physisch gelöscht.

Stattdessen wird:

status = DELETED

gesetzt.

Erfolgreiche Response

Status:

204 No Content
Fehlerfälle
Status	Bedeutung
401 Unauthorized	Nutzer nicht eingeloggt
403 Forbidden	Nutzer darf Beitrag nicht löschen
404 Not Found	Beitrag nicht gefunden