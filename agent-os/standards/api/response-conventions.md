# API Response Conventions

**GET** - Return data directly:
```js
return NextResponse.json(data)        // single or array
```

**POST** - Return created resource with 201:
```js
return NextResponse.json(data, { status: 201 })
```

**PUT** - Return updated resource:
```js
return NextResponse.json(data)
```

**DELETE** - Return success confirmation:
```js
return NextResponse.json({ success: true })
```

- Always use `.select()` after insert/update to return the resource
- Use `.single()` when expecting one result
