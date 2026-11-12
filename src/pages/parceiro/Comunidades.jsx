import { PiCaretRightBold, PiWarningCircleFill } from 'react-icons/pi'
import { useDescricao } from '../../lib/AudioDescricao.jsx'
import Indicadores, { Ponto } from './Indicadores.jsx'
import { alertasDa, situacaoDa } from './situacao.js'

/* As comunidades aparecem agrupadas pela situação: primeiro as que precisam de visita. */
const grupos = [
  { tom: 'grave', titulo: 'Precisam de visita', resumo: (n) => `${n} ${n === 1 ? 'precisa' : 'precisam'} de visita` },
  { tom: 'atencao', titulo: 'Atenção', resumo: (n) => `${n} em atenção` },
  { tom: 'ok', titulo: 'Tudo certo', resumo: (n) => `${n} com tudo certo` },
]

function LinhaComunidade({ c, abrir }) {
  const alertas = alertasDa(c)

  return (
    <li>
      <button
        type="button"
        onClick={abrir}
        className="cartao block w-full p-4 text-left transition-colors hover:border-texto/25 md:p-5"
      >
        <span className="grid items-start gap-4 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto] md:gap-6">
          <span className="block">
            <span className="block font-titulo text-2xl leading-tight font-bold">{c.nome}</span>
            <span className="mt-1 block text-sm text-texto/70">
              {c.municipio !== '—' ? `${c.municipio}. ` : ''}
              {c.familias} famílias. Atualizado {c.atualizado}.
            </span>
          </span>

          <Indicadores c={c} />

          <PiCaretRightBold aria-hidden="true" className="hidden size-6 self-center text-texto/60 md:block" />
        </span>

        {alertas.length > 0 && (
          <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-nuvem pt-3">
            <span className="text-sm font-bold text-texto/70">Resolver:</span>
            {alertas.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-base">
                <PiWarningCircleFill aria-hidden="true" className={`size-5 shrink-0 ${a.tom === 'grave' ? 'text-vermelho' : 'text-texto/55'}`} />
                {a.curto}
              </span>
            ))}
          </span>
        )}
      </button>
    </li>
  )
}

export default function Comunidades({ ong, comunidades, abrir }) {
  const porGrupo = grupos.map((g) => ({ ...g, lista: comunidades.filter((c) => situacaoDa(c) === g.tom) }))
  const resumo = porGrupo
    .filter((g) => g.lista.length)
    .map((g) => g.resumo(g.lista.length))
    .join(', ')

  useDescricao(
    `Comunidades da ${ong.nome}. Dados simulados. ${comunidades.length} comunidades: ${resumo}. ${porGrupo
      .filter((g) => g.lista.length)
      .map(
        (g) =>
          `${g.titulo}: ${g.lista
            .map((c) => {
              const alertas = alertasDa(c)
              return `${c.nome}${alertas.length ? `, resolver: ${alertas.map((a) => a.curto).join(', ')}` : ''}`
            })
            .join('. ')}.`,
      )
      .join(' ')} Toque numa comunidade para abrir.`,
    `ong-${ong.id}`,
  )

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-5xl font-extrabold">Comunidades</h1>
          <p className="mt-1 text-xl text-texto/80">
            {comunidades.length} comunidades: {resumo}.
          </p>
        </div>
        <span className="rounded-full border-3 border-amarelo bg-amarelo/25 px-3 py-0.5 text-base font-bold">Dados simulados</span>
      </div>

      {porGrupo.map(
        (g) =>
          g.lista.length > 0 && (
            <section key={g.tom} aria-labelledby={`grupo-${g.tom}`} className="mt-8">
              <h2 id={`grupo-${g.tom}`} className="flex items-center gap-2.5 text-2xl font-extrabold">
                <Ponto tom={g.tom} className="size-4" />
                {g.titulo}
                <span className="font-corpo text-lg font-semibold text-texto/60">({g.lista.length})</span>
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {g.lista.map((c) => (
                  <LinhaComunidade key={c.id} c={c} abrir={() => abrir(c.id)} />
                ))}
              </ul>
            </section>
          ),
      )}
    </>
  )
}
