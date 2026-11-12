import { PiArrowLeftBold, PiBuildingsFill } from 'react-icons/pi'
import { comunidadesOng, ong } from '../data/mock.js'
import Comunidade from './parceiro/Comunidade.jsx'
import Comunidades from './parceiro/Comunidades.jsx'

/*
 * Área da ONG que acompanha as comunidades (público técnico, pode ter números).
 * O app atende uma ONG só: não há escolha nem troca de ONG.
 * #parceiro          → comunidades da ONG
 * #parceiro/angelica → detalhe de uma comunidade (se não for da ONG, volta para a lista)
 */
export default function Parceiro({ ir, detalhe }) {
  const aberta = comunidadesOng.find((c) => c.id === detalhe)

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-36">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-4 border-nuvem pb-3">
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            ir('inicio')
          }}
          className="inline-flex min-h-12 items-center gap-2 text-base font-bold underline underline-offset-4"
        >
          <PiArrowLeftBold aria-hidden="true" className="size-5" />
          App da comunidade
        </a>
        <span className="inline-flex items-center gap-2 text-base font-bold">
          <PiBuildingsFill aria-hidden="true" className="size-6 text-azul" />
          {ong.nome}
        </span>
      </div>

      <div className="mt-6">
        {aberta ? (
          <Comunidade c={aberta} voltar={() => ir('parceiro')} />
        ) : (
          <Comunidades ong={ong} comunidades={comunidadesOng} abrir={(id) => ir('parceiro', id)} />
        )}
      </div>
    </div>
  )
}
