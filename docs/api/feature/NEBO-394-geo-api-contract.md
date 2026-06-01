# NEBO-394 - Geo API Contract

## Endpoint

```http
GET /api/geo/coordinates?plz={postcode}
```

## Success Response

```json
{
  "latitude": 52.5321914,
  "longitude": 13.3845571
}
```

### Example

```http
GET /api/geo/coordinates?plz=10115
```

## Error Response

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "request": "Ungültige Postleitzahl."
  }
}
```

### Example

```http
GET /api/geo/coordinates?plz=00000
```

## External Service

OpenStreetMap Nominatim API

Used to convert German postal codes (PLZ) into geographic coordinates (latitude and longitude).
