'use client'

export default function Error({ error, reset }) {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Etwas ist schiefgelaufen!</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <button onClick={() => reset()} className="btn btn-primary">
        Erneut versuchen
      </button>
    </div>
  )
}
