# Create Post – Type Specific Details API Contract

## Decision

Type specific details are created together with the post in a single request.

Endpoint:

```http
POST /api/posts
```

No separate `/details` endpoint is used.

---

# Base Request Structure

```json
{
  "title": "string",
  "description": "string",
  "type": "EVENT | SKILL | PRODUCT | HOUSING",
  "postMode": "OFFER | REQUEST",
  "isUrgent": false,
  "urgentUntil": null,
  "location": {
    "lat": 53.0793,
    "lng": 8.8017,
    "precision": "APPROXIMATE",
    "radius_m": 500
  },
  "details": {}
}
```

The `details` object depends on the selected post type.

The `detailType` field is required for polymorphic backend deserialization.

---

# EVENT Example

```json
{
  "title": "Community dinner",
  "description": "Dinner with neighbours",
  "type": "EVENT",
  "postMode": "OFFER",
  "isUrgent": false,
  "urgentUntil": null,
  "location": {
    "lat": 53.0793,
    "lng": 8.8017,
    "precision": "APPROXIMATE",
    "radius_m": 500
  },
  "details": {
    "detailType": "EVENT",
    "startDate": "2026-06-01T18:00:00",
    "endDate": "2026-06-01T20:00:00",
    "venue": "Community Center"
  }
}
```

---

# SKILL Example

```json
{
  "title": "German tutoring",
  "description": "Helping with German homework",
  "type": "SKILL",
  "postMode": "OFFER",
  "isUrgent": false,
  "urgentUntil": null,
  "location": {
    "lat": 53.0793,
    "lng": 8.8017,
    "precision": "APPROXIMATE",
    "radius_m": 500
  },
  "details": {
    "detailType": "SKILL",
    "skillName": "German",
    "experienceLevel": "ADVANCED"
  }
}
```

---

# PRODUCT Example

```json
{
  "title": "Selling bicycle",
  "description": "Used city bike in good condition",
  "type": "PRODUCT",
  "postMode": "OFFER",
  "isUrgent": false,
  "urgentUntil": null,
  "location": {
    "lat": 53.0793,
    "lng": 8.8017,
    "precision": "APPROXIMATE",
    "radius_m": 500
  },
  "details": {
    "detailType": "PRODUCT",
    "productName": "City Bike",
    "price": 150
  }
}
```

---

# HOUSING Example

```json
{
  "title": "Apartment search",
  "description": "Looking for a small apartment",
  "type": "HOUSING",
  "postMode": "REQUEST",
  "isUrgent": false,
  "urgentUntil": null,
  "location": {
    "lat": 53.0793,
    "lng": 8.8017,
    "precision": "APPROXIMATE",
    "radius_m": 500
  },
  "details": {
    "detailType": "HOUSING",
    "housingType": "APARTMENT",
    "rent": 900
  }
}
```

---

# Frontend Notes

Frontend should dynamically render form fields based on the selected `type`.

The `details` payload must match the selected post type.

The `type` field and `details.detailType` must contain the same value.