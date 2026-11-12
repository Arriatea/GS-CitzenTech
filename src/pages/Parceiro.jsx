import { useState } from 'react'
import { PiArrowLeftBold, PiArrowsLeftRightBold, PiBuildingsFill } from 'react-icons/pi'
import { comunidadesOng, ongs } from '../data/mock.js'
import { gravar, ler } from '../lib/guardar.js'
import Comunidade from './parceiro/Comunidade.jsx'
import Comunidades from './parceiro/Comunidades.jsx'
import EscolherOng from './parceiro/EscolherOng.jsx'

/*
 * Área das ONGs que acompanham as comunidades (público técnico, pode ter números).
 * #parceiro          → escolher a ONG (se ainda não escolheu) ou ver as comunidades dela
 * #parceiro/angelica → detalhe de uma comunidade (só se for da ONG escolhida)
 */
export default function Parceiro({ ir, detalhe }) {
  const [ongId, setOngId] = useState(() => ler('ong', null))
  const ong = ongs.find((o) => o.id === ongId)

  function escolher(id) {
    gravar('ong', id)
    setOngId(id)
    window.scrollTo(0, 0)
  }

  function trocarOng() {
    gravar('ong', null)
    setOngId(null)
    ir('parceiro')
  }

  if (!ong) return <EscolherOng ir={ir} escolher={escolher} />

  // Cada ONG só enxerga as comunidades dela.
  const comunidades = comunidadesOng.filter((c) => ong.comunidades.includes(c.id))
  const aberta = comunidades.find((c) => c.id === detalhe)

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
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-base font-bold">
            <PiBuildingsFill aria-hidden="true" className="size-6 text-azul" />
            {ong.nome}
          </span>
          <button
            type="button"
            onClick={trocarOng}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border-3 border-nuvem bg-white px-3 text-base font-bold"
          >
            <PiArrowsLeftRightBold aria-hidden="true" className="size-5" />
            Trocar de ONG
          </button>
        </div>
      </div>

      <div className="mt-6">
        {aberta ? (
          <Comunidade c={aberta} voltar={() => ir('parceiro')} />
        ) : (
          <Comunidades ong={ong} comunidades={comunidades} abrir={(id) => ir('parceiro', id)} />
        )}
      </div>
    </div>
  )
}
