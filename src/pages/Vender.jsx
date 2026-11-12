import { useRef, useState } from 'react'
import { PiCalendarBlankFill, PiCheckCircleFill } from 'react-icons/pi'
import Topo from '../components/Topo.jsx'
import { compradores, precos } from '../data/mock.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'
import { precoFalado } from '../lib/voz.js'

const formatarPreco = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

export default function Vender({ ir }) {
  const { dizer } = useAudioDescricao()
  const [escolhido, setEscolhido] = useState(precos[0].id)
  const botoes = useRef([])

  const preco = precos.find((p) => p.id === escolhido)
  const falaPreco = (p) => `${p.nome}, ${p.unidade}: ${precoFalado(p.valor)}. Não venda mais barato que isso.`

  useDescricao(
    `Você está em Vender. No alto tem o botão Início. Quanto cobrar? Toque numa verdura: ${precos
      .map((p) => p.nome)
      .join(', ')}. Agora está escolhida: ${falaPreco(preco)} Embaixo, quem compra: ${compradores
      .map((c) => `${c.nome}, quer ${c.quer}, ${c.quando}`)
      .join('. ')}.`,
  )

  function escolher(p) {
    setEscolhido(p.id)
    dizer(falaPreco(p))
  }

  // Setas do teclado andam entre as verduras, como num grupo de opções.
  function aoTeclar(evento, indice) {
    const passos = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(evento.key in passos)) return
    evento.preventDefault()
    const novo = (indice + passos[evento.key] + precos.length) % precos.length
    botoes.current[novo]?.focus()
    escolher(precos[novo])
  }

  return (
    <div className="pagina">
      <Topo cor="amarelo" figura="💰" titulo="Vender" aoVoltar={() => ir('inicio')} />

      <div className="px-4">
        <h2 className="mt-6 text-4xl font-extrabold">Quanto cobrar?</h2>
        <p className="mt-1 text-xl text-texto/80">Toque na verdura.</p>

        <div role="radiogroup" aria-label="Escolha a verdura" className="mt-4 grid grid-cols-4 gap-3">
          {precos.map((p, i) => {
            const marcado = p.id === escolhido
            return (
              <button
                key={p.id}
                ref={(el) => {
                  botoes.current[i] = el
                }}
                type="button"
                role="radio"
                aria-checked={marcado}
                aria-label={p.nome}
                tabIndex={marcado ? 0 : -1}
                onClick={() => escolher(p)}
                onKeyDown={(e) => aoTeclar(e, i)}
                className={`apertar relative grid aspect-square place-items-center text-5xl ${
                  marcado ? 'border-4 border-texto bg-amarelo' : 'border-4 border-nuvem bg-white'
                }`}
              >
                <span aria-hidden="true">{p.figura}</span>
                {marcado && (
                  <PiCheckCircleFill aria-hidden="true" className="absolute -top-2 -right-2 size-8 rounded-full bg-white text-texto" />
                )}
              </button>
            )
          })}
        </div>

        {/* O preço como a plaquinha de uma banca de feira. */}
        <section aria-live="polite" aria-label="Preço mínimo" className="mt-7">
          <div className="plaquinha -rotate-1 bg-amarelo py-6 pr-6 pl-14 text-texto">
            <span aria-hidden="true" className="absolute top-1/2 left-6 size-5 -translate-y-1/2 rounded-full bg-fundo ring-3 ring-texto/60" />
            <p className="text-2xl font-bold">
              {preco.nome}, {preco.unidade}:
            </p>
            <p key={preco.id} className="surgir mt-1 font-titulo text-7xl leading-none font-extrabold tabular-nums">
              {formatarPreco(preco.valor)}
            </p>
            <p className="mt-3 text-2xl font-extrabold">Não venda mais barato que isso.</p>
          </div>
          <p className="mt-4 text-lg text-texto/80">
            O app calcula esse preço com o que você gastou e com o preço da região.
          </p>
        </section>

        <h2 className="mt-10 text-4xl font-extrabold">Quem compra</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {compradores.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => dizer(`${c.nome}. Quer ${c.quer}. ${c.quando}.`)}
                className="cartao flex w-full items-center gap-4 p-4 text-left"
              >
                <span aria-hidden="true" className="text-6xl leading-none">
                  {c.figura}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-titulo text-3xl leading-tight font-bold">{c.nome}</span>
                  <span className="text-xl">Quer {c.quer}</span>
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-nuvem px-3 py-0.5 text-lg font-bold">
                    <PiCalendarBlankFill aria-hidden="true" className="size-5" />
                    {maiuscula(c.quando)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
