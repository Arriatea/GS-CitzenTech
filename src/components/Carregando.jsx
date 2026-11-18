export default function Carregando({ texto = 'Carregando…' }) {
  return (
    <p role="status" className="grade py-10 text-2xl font-bold text-texto/70">
      {texto}
    </p>
  )
}
