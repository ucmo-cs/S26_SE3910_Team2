
## API Usage

Base URL:

```text
http://localhost:8080
```

All endpoints return JSON.

### 1) Get Topics

- Method: `GET`
- Endpoint: `/api/topics`

Example request:

```bash
curl http://localhost:8080/api/topics
```

Example response:

```json
[
	{
		"id": 1,
		"name": "Loans",
		"description": "Support for personal, auto, and home loan questions.",
		"branches": [
			{
				"id": 1,
				"name": "Downtown Branch",
				"address": "123 Main St",
				"city": "Kansas City",
				"state": "MO",
				"zip": "64105"
			}
		]
	}
]
```

### 2) Get Branches for a Topic

- Method: `GET`
- Endpoint: `/api/branches`
- Query params:
	- `topicId` (required, number)

Example request:

```bash
curl "http://localhost:8080/api/branches?topicId=1"
```

Example response:

```json
[
	{
		"id": 1,
		"name": "Downtown Branch",
		"address": "123 Main St",
		"city": "Kansas City",
		"state": "MO",
		"zip": "64105"
	},
	{
		"id": 2,
		"name": "South Branch",
		"address": "456 Oak Ave",
		"city": "Kansas City",
		"state": "MO",
		"zip": "64131"
	}
]
```

### 3) Get Available Time Slots

- Method: `GET`
- Endpoint: `/api/availability`
- Query params:
	- `branchId` (required, number)
	- `date` (required, `YYYY-MM-DD`)

Example request:

```bash
curl "http://localhost:8080/api/availability?branchId=1&date=2026-04-01"
```

Example response:

```json
[
	"09:00",
	"09:30",
	"10:00",
	"10:30"
]
```

### 4) Create an Appointment

- Method: `POST`
- Endpoint: `/api/appointments`
- Content type: `application/json`

Request body fields:

- `name` (string, required)
- `email` (string, required)
- `topicId` (number, required)
- `branchId` (number, required)
- `startISO` (string, required, ISO-8601 date-time)
- `reason` (string, optional)

Example request:

```bash
curl -X POST http://localhost:8080/api/appointments \
	-H "Content-Type: application/json" \
	-d '{
		"name": "Jane Doe",
		"email": "jane.doe@example.com",
		"topicId": 1,
		"branchId": 1,
		"startISO": "2026-04-01T09:00:00",
		"reason": "Need help with a personal loan"
	}'
```

Example success response (`200 OK`):

```json
{
	"id": 15,
	"fullName": "Jane Doe",
	"email": "jane.doe@example.com",
	"appointmentDate": "2026-04-01",
	"appointmentTime": "09:00:00",
	"notes": "Need help with a personal loan",
	"topic": {
		"id": 1,
		"name": "Loans",
		"description": "Support for personal, auto, and home loan questions."
	},
	"branch": {
		"id": 1,
		"name": "Downtown Branch",
		"address": "123 Main St",
		"city": "Kansas City",
		"state": "MO",
		"zip": "64105"
	}
}
```

Example conflict response (`409 Conflict`):

```text
No body
```

Returned when the same branch/date/time slot is already booked.

### 5) Get Appointment by ID

- Method: `GET`
- Endpoint: `/api/appointments/{id}`

Example request:

```bash
curl http://localhost:8080/api/appointments/15
```

Example response:

```json
{
	"id": 15,
	"fullName": "Jane Doe",
	"email": "jane.doe@example.com",
	"appointmentDate": "2026-04-01",
	"appointmentTime": "09:00:00",
	"notes": "Need help with a personal loan",
	"topic": {
		"id": 1,
		"name": "Loans",
		"description": "Support for personal, auto, and home loan questions."
	},
	"branch": {
		"id": 1,
		"name": "Downtown Branch",
		"address": "123 Main St",
		"city": "Kansas City",
		"state": "MO",
		"zip": "64105"
	}
}
```
