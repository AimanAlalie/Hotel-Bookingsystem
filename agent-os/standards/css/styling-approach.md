# Styling Approach

Use **Tailwind CSS** exclusively. Never write custom CSS.

**Utility-first:**
```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Submit
</button>
```

**Common patterns:**
- Buttons: `px-4 py-2 rounded` + color variants
- Cards: `border rounded-lg p-4 shadow-sm`
- Containers: `max-w-4xl mx-auto px-4`
- Forms: `space-y-4` for groups, `w-full p-2 border rounded` for inputs
- Error messages: `text-red-500 bg-red-50 p-3 rounded`
- Success messages: `text-green-700 bg-green-50 p-3 rounded`

**No custom CSS files** - use Tailwind for everything.
