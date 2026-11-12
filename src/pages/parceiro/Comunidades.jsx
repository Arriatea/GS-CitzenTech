import { useState } from 'react'
import {
  PiCaretRightBold,
  PiDropFill,
  PiDropSlashFill,
  PiSunFill,
  PiCloudFill,
  PiVideoCameraFill,
  PiWarningCircleFill,
  PiWarningFill,
  PiWrenchFill,
} from 'react-icons/pi'
import CaixaDagua from '../../components/CaixaDagua.jsx'
import { useDescricao } from '../../lib/AudioDescricao.jsx'
import { alertasDa, bomba, dias, litros, numero, situacaoDa, tomDaCaixa, tons } from './situacao.js'

const iconeAlerta = { caixa: PiDropFill, bomba: PiWrenchFill, agua: PiDropSlashFill, camera: PiVideoCameraFill }
const iconeBomba = { ligada: PiSunFill, 'sem-sol': PiCloudFill, falha: PiWarningFill }

function Selo({ tom, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-base font-bold whitespace-nowrap ${tons[tom].selo}`}>
      {children ?? tons[tom].rotulo}
    </span>
  )
}

function CartaoComunidade({ c, abrir }) {
  const situacao = situacaoDa(c)
  const camsAlerta = c.cameras.filter((cam) => cam.estado !== 'saudavel').length
  const IconeBomba = iconeBomba[c.bomba.estado]
  const tomCaixa = tomDaCaixa(c.caixa.nivelPct)

  return (
    <li>
      <button
        type="button"
        onClick={abrir}
        className={`apertar flex h-full w-full flex-col border-4 bg-white p-5 text-left ${tons[situacao].borda}`}
      >
        <span className="self-start">
          <Selo tom={situacao} />
        </span>
        <span className="mt-2 block font-titulo text-2xl leading-tight font-bold">{c.nome}</span>
        <span className="text-base text-texto/75">
          {c.municipio !== '—' ? `${c.municipio}, ` : ''}
          {c.familias} famílias
        </span>

        <span className="mt-4 flex items-center gap-4">
          <CaixaDagua pct={c.caixa.nivelPct} corAgua={tomCaixa === 'grave' ? '#e0352f' : '#1f6fe0'} className="h-20 w-auto shrink-0" />
          <span>
            <span className="block font-titulo text-4xl leading-none font-extrabold tabular-nums">{c.caixa.nivelPct}%</span>
            <span className="block text-base text-texto/80">
              {numero(litros(c))} de {numero(c.caixa.capacidadeL)} L
            </span>
            <span className="block text-base font-bold">{dias(c.caixa.diasParaBeber)} de água para beber</span>
          </span>
        </span>

        <span className="mt-4 grid w-full gap-2 border-t-2 border-nuvem pt-3 text-base">
          <span className="flex items-center gap-2">
            <IconeBomba aria-hidden="true" className={`size-5 shrink-0 ${c.bomba.estado === 'falha' ? 'text-vermelho' : ''}`} />
            Bomba: <strong className="font-bold">{bomba[c.bomba.estado].texto}</strong>
          </span>
          <span className="flex items-center gap-2">
            {c.qualidade.boa ? (
              <PiDropFill aria-hidden="true" className="size-5 shrink-0 text-azul" />
            ) : (
              <PiDropSlashFill aria-hidden="true" className="size-5 shrink-0 text-vermelho" />
            )}
            Água: <strong className="font-bold">{c.qualidade.boa ? 'boa para beber' : 'precisa de cuidado'}</strong>
          </span>
          <span className="flex items-center gap-2">
            <PiVideoCameraFill aria-hidden="true" className={`size-5 shrink-0 ${camsAlerta ? 'text-vermelho' : ''}`} />
            Câmeras:{' '}
            <strong className="font-bold">
              {camsAlerta ? `${camsAlerta} com alerta, de ${c.cameras.length}` : `${c.cameras.length} sem problemas`}
            </strong>
          </span>
        </span>

        <span className="mt-auto flex w-full items-center justify-between pt-4 text-base text-texto/70">
          Atualizado {c.atualizado}
          <span className="inline-flex items-center gap-1 font-bold text-texto">
            Abrir
            <PiCaretRightBold aria-hidden="true" className="size-5" />
          </span>
        </span>
      </button>
    </li>
  )
}

const filtros = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'grave', rotulo: 'Precisam de visita' },
  { id: 'atencao', rotulo: 'Atenção' },
  { id: 'ok', rotulo: 'Tudo certo' },
]

export default function Comunidades({ ong, comunidades, abrir }) {
  const [filtro, setFiltro] = useState('todas')
  const peso = { grave: 0, atencao: 1, ok: 2 }

  // As que precisam de visita vêm primeiro.
  const ordenadas = [...comunidades].sort((a, b) => peso[situacaoDa(a)] - peso[situacaoDa(b)])
  const visiveis = filtro === 'todas' ? ordenadas : ordenadas.filter((c) => situacaoDa(c) === filtro)
  const contagem = (id) => (id === 'todas' ? comunidades.length : comunidades.filter((c) => situacaoDa(c) === id).length)

  const alertas = ordenadas.flatMap((c) => alertasDa(c).map((a) => ({ ...a, comunidade: c })))
  alertas.sort((a, b) => (a.tom === b.tom ? 0 : a.tom === 'grave' ? -1 : 1))

  useDescricao(
    `Comunidades da ${ong.nome}. Dados simulados. ${comunidades.length} comunidades. ${
      alertas.length ? `${alertas.length} alertas agora. ${alertas.map((a) => `${a.comunidade.nome}: ${a.texto}`).join(' ')}` : 'Nenhum alerta agora.'
    } Abaixo, um cartão por comunidade com a caixa d'água, a bomba, a água e as câmeras. Toque num cartão para abrir.`,
    `ong-${ong.id}`,
  )

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-5xl font-extrabold">Comunidades</h1>
          <p className="mt-1 text-xl text-texto/80">Caixa d'água, bomba solar, qualidade da água e câmeras da horta.</p>
        </div>
        <span className="rounded-full border-3 border-amarelo bg-amarelo/25 px-3 py-0.5 text-base font-bold">Dados simulados</span>
      </div>

      {/* Alertas primeiro: é o que a ONG precisa resolver hoje. */}
      <section aria-labelledby="titulo-alertas" className="cartao mt-6 p-5">
        <h2 id="titulo-alertas" className="text-3xl font-extrabold">
          {alertas.length ? `${alertas.length} alertas agora` : 'Nenhum alerta agora'}
        </h2>
        {alertas.length > 0 && (
          <ul className="mt-3 divide-y-2 divide-nuvem">
            {alertas.map((a, i) => {
              const Icone = iconeAlerta[a.tipo] ?? PiWarningCircleFill
              return (
                <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                  <Icone aria-hidden="true" className={`size-7 shrink-0 ${a.tom === 'grave' ? 'text-vermelho' : 'text-texto/70'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold">{a.texto}</span>
                    <span className="text-base text-texto/75">{a.comunidade.nome}</span>
                  </span>
                  <Selo tom={a.tom}>{a.tom === 'grave' ? 'Urgente' : 'Atenção'}</Selo>
                  <button
                    type="button"
                    onClick={() => abrir(a.comunidade.id)}
                    className="inline-flex min-h-12 items-center gap-1 rounded-xl px-3 text-base font-bold underline underline-offset-4 hover:bg-nuvem"
                  >
                    Ver comunidade
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div role="group" aria-label="Filtrar comunidades" className="mt-8 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className={`min-h-12 rounded-full border-3 px-4 text-base font-bold ${
              filtro === f.id ? 'border-texto bg-texto text-white' : 'border-nuvem bg-white'
            }`}
          >
            {f.rotulo} <span className="tabular-nums">({contagem(f.id)})</span>
          </button>
        ))}
      </div>

      {visiveis.length ? (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((c) => (
            <CartaoComunidade key={c.id} c={c} abrir={() => abrir(c.id)} />
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-2xl bg-nuvem px-4 py-3 text-lg">
          Nenhuma comunidade nesta situação. Toque em Todas para ver as outras.
        </p>
      )}
    </>
  )
}
