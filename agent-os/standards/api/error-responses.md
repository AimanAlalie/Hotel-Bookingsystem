# API Error Responses

All errors return `{ error: message }` with appropriate HTTP status:

```js
// 400 - Validation error
return NextResponse.json({ error: 'Name and city are required' }, { status: 400 })

// 401 - Unauthorized
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// 404 - Not found
return NextResponse.json({ error: error.message }, { status: 404 })

// 500 - Server error
return NextResponse.json({ error: error.message }, { status: 500 })
```

- Frontend checks `response.error` for consistent error handling
- Use English for technical errors, German for user-facing validation
