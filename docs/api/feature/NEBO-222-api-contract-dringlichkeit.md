# Urgency API Contract

## Decision

Urgency is represented by the `isUrgent` flag and optional `urgentUntil` field.

Urgency is not a separate post type.

## Relevant Response Fields

```json
{
  "isUrgent": true,
  "urgentUntil": "2026-05-10T18:00:00",
  "createdAt": "2026-05-05T11:30:00"
}
```

## Interpretation

* `isUrgent = true` marks a post as urgent.
* `isUrgent = false` means the post is not urgent.
* `urgentUntil` is optional and may be `null`.
* The expiration logic for `urgentUntil` is defined separately.
* `createdAt` can be used for display and sorting.

## Urgent Post Response Example

```json
{
  "id": 1,
  "title": "Hilfe beim Umzug",
  "description": "Ich brauche Hilfe beim Tragen von Möbeln.",
  "type": "SKILL",
  "postMode": "REQUEST",
  "isUrgent": true,
  "urgentUntil": "2026-05-10T18:00:00",
  "createdAt": "2026-05-05T11:30:00",
  "status": "ACTIVE",
  "updatedAt": "2026-05-05T11:30:00"
}
```

## Non-Urgent Post Response Example

```json
{
  "id": 2,
  "title": "Kinderfahrrad abzugeben",
  "description": "Gut erhaltenes Fahrrad für Kinder.",
  "type": "PRODUCT",
  "postMode": "OFFER",
  "isUrgent": false,
  "urgentUntil": null,
  "createdAt": "2026-05-04T16:15:00",
  "status": "ACTIVE",
  "updatedAt": "2026-05-04T16:15:00"
}
```

## Frontend Notes

Frontend models should contain:

* `isUrgent`
* `urgentUntil`
* `createdAt`

Mock data should include:

* urgent posts
* non-urgent posts

UI highlighting should be based on `isUrgent`.