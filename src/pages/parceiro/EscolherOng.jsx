import { PiArrowLeftBold, PiBuildingsFill, PiCaretRightBold } from 'react-icons/pi'
import { ongs } from '../../data/mock.js'
import { useDescricao } from '../../lib/AudioDescricao.jsx'

/* Acesso simulado: no app de verdade, aqui entra o login da ONG. */
export default function EscolherOng({ ir, escolher }) {
  useDescricao(
    `Área das ONGs parceiras. Cada ONG vê só as comunidades que acompanha. Escolha a sua: ${ongs
      .map((o) => o.nome)
      .join(' ou ')}.`,
    'escolher-ong',
  )

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-36">
      <a
        href="#inicio"
        onClick={(e) => {
          e.preventDefault()
          ir('inicio')
        }}
        className="inline-flex min-h-12 items-center gap-2 text-lg font-bold underline underline-offset-4"
      >
        <PiArrowLeftBold aria-hidden="true" className="size-5" />
        Voltar para o app da comunidade
      </a>

      <h1 className="mt-6 text-5xl font-extrabold">Entrar como ONG</h1>
      <p className="mt-2 text-xl text-texto/80">Cada ONG vê só as comunidades que ela acompanha.</p>

      <ul className="mt-8 flex flex-col gap-4">
        {ongs.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => escolher(o.id)}
              className="apertar flex min-h-20 w-full items-center gap-4 border-4 border-nuvem bg-white p-4 text-left"
            >
              <PiBuildingsFill aria-hidden="true" className="size-10 shrink-0 text-azul" />
              <span className="flex-1">
                <span className="block font-titulo text-2xl leading-tight font-bold">{o.nome}</span>
                <span className="text-lg text-texto/80">
                  {o.comunidades.length} {o.comunidades.length === 1 ? 'comunidade' : 'comunidades'}
                </span>
              </span>
              <PiCaretRightBold aria-hidden="true" className="size-6 shrink-0" />
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-2xl bg-nuvem px-4 py-3 text-base">
        Acesso simulado para o protótipo. No app de verdade, cada ONG entra com o próprio login.
      </p>
    </div>
  )
}
