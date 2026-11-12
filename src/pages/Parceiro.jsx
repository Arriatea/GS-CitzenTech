import { PiArrowLeftBold, PiMapPinFill } from 'react-icons/pi'
import { comunidadesParceiras, impacto, proximasComunidades } from '../data/mock.js'
import { useDescricao } from '../lib/AudioDescricao.jsx'

/* Painel para a iniciativa parceira: público técnico, aqui pode ter números. */

const numero = (n) => n.toLocaleString('pt-BR')
const reais = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const rotuloPrioridade = {
  alta: { texto: 'Prioridade alta', classe: 'bg-vermelho text-white' },
  media: { texto: 'Prioridade média', classe: 'bg-amarelo text-texto' },
}

function GraficoColheita({ dados }) {
  const largura = 640
  const altura = 300
  const margem = { topo: 28, direita: 8, baixo: 36, esquerda: 48 }
  const maximo = 800
  const marcas = [0, 200, 400, 600, 800]
  const areaL = largura - margem.esquerda - margem.direita
  const areaA = altura - margem.topo - margem.baixo
  const faixa = areaL / dados.length
  const barra = faixa * 0.56
  const y = (v) => margem.topo + areaA - (v / maximo) * areaA

  const resumo = `Colheita por mês, em quilos: ${dados.map((d) => `${d.mes} ${d.kg}`).join(', ')}.`

  return (
    <svg viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label={resumo} className="block h-auto w-full">
      {marcas.map((m) => (
        <g key={m}>
          <line
            x1={margem.esquerda}
            x2={largura - margem.direita}
            y1={y(m)}
            y2={y(m)}
            stroke={m === 0 ? '#22264a' : '#eef1f7'}
            strokeWidth={m === 0 ? 2 : 2}
          />
          <text x={margem.esquerda - 10} y={y(m)} dy="0.35em" textAnchor="end" fontSize="17" fill="#22264a" opacity="0.7">
            {m}
          </text>
        </g>
      ))}

      {dados.map((d, i) => {
        const ultimo = i === dados.length - 1
        const x = margem.esquerda + faixa * i + (faixa - barra) / 2
        const topo = y(d.kg)
        return (
          <g key={d.mes}>
            <rect
              x={x}
              y={topo}
              width={barra}
              height={margem.topo + areaA - topo}
              rx="8"
              fill={ultimo ? '#f2661c' : '#22264a'}
              opacity={ultimo ? 1 : 0.22}
            />
            <text
              x={x + barra / 2}
              y={topo - 8}
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill={ultimo ? '#c2470b' : '#22264a'}
            >
              {d.kg}
            </text>
            <text x={x + barra / 2} y={altura - 10} textAnchor="middle" fontSize="19" fontWeight="700" fill="#22264a">
              {d.mes}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Parceiro({ ir }) {
  const meses = impacto.colheitaPorMes
  const primeiro = meses[0]
  const vezes = Math.floor(impacto.colheitaKg / primeiro.kg)

  // Cada número leva a cor da parte do app de onde ele vem.
  const numeros = [
    { valor: numero(impacto.familias), rotulo: 'famílias produzindo', borda: 'border-laranja' },
    { valor: reais(impacto.rendaReais), rotulo: `de renda em ${impacto.mesReferencia}`, borda: 'border-amarelo' },
    { valor: `${impacto.economiaAguaPct}%`, rotulo: 'menos água na irrigação', borda: 'border-azul' },
  ]

  useDescricao(
    `Painel da iniciativa parceira. Dados simulados. No alto tem o link para voltar ao app da comunidade. ${impacto.colheitaKg} quilos colhidos em ${impacto.mesReferencia}, mais de ${vezes} vezes a colheita de ${primeiro.mes}. Colheita por mês: ${meses
      .map((d) => `${d.mes}, ${d.kg} quilos`)
      .join('; ')}. ${impacto.familias} famílias produzindo. ${impacto.rendaReais} reais de renda em ${impacto.mesReferencia}. ${impacto.economiaAguaPct} por cento menos água. Onde chegar em seguida: ${proximasComunidades
      .map((c) => `${c.nome}, ${rotuloPrioridade[c.prioridade].texto}. ${c.motivo}`)
      .join(' ')} Por fim, a tabela das comunidades acompanhadas.`,
  )

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-36">
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

      <header className="mt-6 max-w-2xl">
        <span className="inline-block rounded-full border-3 border-amarelo bg-amarelo/25 px-3 py-0.5 text-base font-bold">
          Dados simulados
        </span>
        <h1 className="mt-3 text-5xl font-extrabold">Painel da iniciativa parceira</h1>
        <p className="mt-2 text-xl text-texto/80">
          O que a água do poço está gerando nas comunidades acompanhadas.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        <section className="cartao p-5 md:p-7">
          <h2 className="text-4xl leading-tight font-extrabold md:text-5xl">
            {numero(impacto.colheitaKg)} kg colhidos em {impacto.mesReferencia}
          </h2>
          <p className="mt-1 text-xl text-texto/80">
            Mais de {vezes} vezes a colheita de {primeiro.mes === 'jun' ? 'junho' : primeiro.mes}. Em quilos, somando todas
            as comunidades.
          </p>
          <div className="mt-5">
            <GraficoColheita dados={meses} />
          </div>

          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-3">
            {numeros.map((n) => (
              <div key={n.rotulo} className={`border-t-4 pt-3 ${n.borda}`}>
                <dt className="sr-only">{n.rotulo}</dt>
                <dd className="font-titulo text-4xl leading-none font-extrabold tabular-nums">{n.valor}</dd>
                <dd className="mt-1 text-lg">{n.rotulo}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cartao p-5 md:p-6">
          <h2 className="text-3xl font-extrabold">Onde chegar em seguida</h2>
          <ul className="mt-4 flex flex-col divide-y-2 divide-nuvem">
            {proximasComunidades.map((c) => (
              <li key={c.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <PiMapPinFill aria-hidden="true" className="mt-1 size-8 shrink-0 text-vermelho" />
                <div>
                  <p className="font-titulo text-2xl leading-tight font-bold">{c.nome}</p>
                  <p className="mt-1 text-lg">{c.motivo}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-0.5 text-base font-bold ${rotuloPrioridade[c.prioridade].classe}`}
                  >
                    {rotuloPrioridade[c.prioridade].texto}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="cartao mt-8 p-5 md:p-6">
        <h2 className="text-3xl font-extrabold">Comunidades acompanhadas</h2>
        <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela das comunidades acompanhadas">
          <table className="w-full min-w-[640px] border-collapse text-left text-lg">
            <thead>
              <tr className="border-b-4 border-nuvem">
                <th scope="col" className="py-3 pr-4 font-bold">Comunidade</th>
                <th scope="col" className="py-3 pr-4 font-bold">Município</th>
                <th scope="col" className="py-3 pr-4 text-right font-bold">Famílias</th>
                <th scope="col" className="py-3 pr-4 text-right font-bold">Colheita em {impacto.mesReferencia}</th>
                <th scope="col" className="py-3 font-bold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {comunidadesParceiras.map((c) => (
                <tr key={c.id} className="border-b-2 border-nuvem last:border-b-0">
                  <th scope="row" className="py-3 pr-4 font-bold">{c.nome}</th>
                  <td className="py-3 pr-4">{c.municipio}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{c.familias}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{numero(c.colheitaKg)} kg</td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-base font-bold ${
                        c.situacao === 'Produzindo' ? 'bg-verde text-white' : 'bg-nuvem text-texto'
                      }`}
                    >
                      {c.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
