import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>404 - Seite nicht gefunden</h1>
      <p>Die angeforderte Seite existiert nicht.</p>
      <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
        Zurück zur Startseite
      </Link>
    </div>
  )
}
