# Richardson Maturity Model Evaluation: Task Management API

This document evaluates the Task Management RESTful API built in Practical 4 against the **Richardson Maturity Model (RMM)**, which measures the RESTfulness of an API across four levels (Levels 0 through 3).

---

## Richardson Maturity Model Evaluation Table

| Level | Criterion | Does the API satisfy this? | Evidence |
| :--- | :--- | :--- | :--- |
| **Level 0** | **The Swamp of POX (Plain Old XML/JSON)**<br>Single URI (endpoint) and single HTTP method (typically POST) for all operations. Used like Remote Procedure Call (RPC). | **Yes (Upgraded)** | The API does not remain at Level 0. It uses distinct resources (URIs) and distinct HTTP methods instead of routing all calls through a single endpoint. |
| **Level 1** | **Resources**<br>Uses multiple distinct URIs to address individual resources rather than routing all calls through a single service endpoint. | **Yes** | We address the task collection at `/tasks` and individual task resources at `/tasks/:id` (e.g. `/tasks/1`, `/tasks/2`), segregating concerns by resource. |
| **Level 2** | **HTTP Verbs & Status Codes**<br>Uses correct HTTP verbs (GET, POST, PUT, DELETE) to represent operations and returns proper HTTP status codes (200, 201, 400, 404, 415, 500). | **Yes** | Our CRUD operations strictly adhere to HTTP standards:<br>- **GET `/tasks`** (Retrieve all): `200 OK`<br>- **GET `/tasks/:id`** (Retrieve single): `200 OK` or `404 Not Found`<br>- **POST `/tasks`** (Create): `201 Created` or `400 Bad Request`<br>- **PUT `/tasks/:id`** (Update): `200 OK`, `400 Bad Request`, or `404 Not Found`<br>- **DELETE `/tasks/:id`** (Delete): `200 OK` or `404 Not Found`<br>- **Content-Type Mismatch**: `415 Unsupported Media Type`<br>- **ID Format Error**: `400 Bad Request`<br>- **Internal Server Error**: `500 Internal Server Error` |
| **Level 3** | **HATEOAS (Hypermedia As The Engine Of Application State)**<br>Provides hypermedia controls (navigational links) inside resource representations, guiding the client on next possible actions. | **Conceptually / Awareness** | The current API does not dynamically inject links into the JSON payloads during database/memory returns, but we have designed the schema for it below. |

---

## HATEOAS Awareness (Level 3 RESTfulness)

To elevate this API from Level 2 to Level 3, we would embed a `_links` object inside the task representation in the response body. This lets clients dynamically discover possible state transitions without hardcoding URLs.

### Conceptual JSON Payload Example for Level 3:
If a client queries `GET /tasks/1`, the server would return:

```json
{
  "id": 1,
  "title": "Learn HTML/CSS",
  "completed": true,
  "_links": {
    "self": {
      "href": "/tasks/1",
      "method": "GET"
    },
    "update": {
      "href": "/tasks/1",
      "method": "PUT"
    },
    "delete": {
      "href": "/tasks/1",
      "method": "DELETE"
    },
    "collection": {
      "href": "/tasks",
      "method": "GET"
    }
  }
}
```

---

## Why Do Most Production APIs Stop at Level 2?

While Level 3 (HATEOAS) is the theoretical pinnacle of REST, most real-world production APIs choose to stop at **Level 2** due to the following practical reasons:

1. **Increased Payload Size & Performance Overhead**: Adding hypermedia link objects to every resource can significantly bloat the response body, especially in bulk queries (e.g., retrieving thousands of records). This leads to higher network bandwidth usage and latency.
2. **Client Complexity**: Standard web and mobile clients do not usually traverse APIs dynamically by parsing HATEOAS links. Developers writing client-side applications prefer static, predictable documentation (like OpenAPI/Swagger) and hardcode URL paths or use SDK clients rather than dynamically parsing hypermedia links.
3. **Lack of Standardization**: There is no single globally adopted standard format for implementing HATEOAS. Formats like HAL (Hypertext Application Language), JSON-LD, and Siren compete, adding to implementation decisions and client friction.
4. **Maintenance & Coupling Cost**: Generating, testing, and managing dynamic URLs on the backend adds code complexity. A change in routing requires updates to dynamic link generation, increasing the maintenance surface.
