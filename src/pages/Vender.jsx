import { useRef, useState } from 'react'
import { PiCalendarBlankFill, PiCheckCircleFill, PiMinusBold, PiPlusBold } from 'react-icons/pi'
import CartaoFalante from '../components/CartaoFalante.jsx'
import Topo from '../components/Topo.jsx'
import Carregando from '../components/Carregando.jsx'
import { buscarCompradores, buscarPrecos } from '../lib/api.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'
import { precoFalado } from '../lib/voz.js'
import { vibrar } from '../lib/guardar.js'
import { useApi } from '../lib/useApi.js'

const formatarPreco = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

export default function Vender({ ir }) {
  const { dados: precos } = useApi(buscarPrecos)
  const { dados: compradores } = useApi(buscarCompradores)
  if (!precos || !compradores) return <Carregando />
  return <VenderConteudo ir={ir} precos={precos} compradores={compradores} />
}

function VenderConteudo({ ir, precos, compradores }) {
  const { dizer } = useAudioDescricao()
  const [escolhido, setEscolhido] = useState(precos[0].id)
  const [quantos, setQuantos] = useState(1)
  const botoes = useRef([])

  const preco = precos.find((p) => p.id === escolhido)
  const falaPreco = (p) => `${p.nome}, ${p.unidade}: ${precoFalado(p.valor)}. Não venda mais barato que isso.`
  const nomeQuantos = (n, p = preco) => `${n} ${n === 1 ? p.contagem[0] : p.contagem[1]}`
  const total = Math.round(preco.valor * quantos * 100) / 100

  useDescricao(
    `Você está em Vender. No alto tem o botão Início. Quanto cobrar? Toque numa verdura: ${precos
      .map((p) => p.nome)
      .join(', ')}. Agora está escolhida: ${falaPreco(preco)} Logo abaixo dá para fazer a conta: toque no mais e no menos para dizer quantos vai vender. Agora são ${nomeQuantos(quantos)}: cobre pelo menos ${precoFalado(total)}. Embaixo, quem compra: ${compradores
      .map((c) => `${c.nome}, quer ${c.quer}, ${c.quando}`)
      .join('. ')}.`,
  )

  function escolher(p) {
    setEscolhido(p.id)
    setQuantos(1)
    dizer(falaPreco(p))
  }

  /* A conta: quantos vai vender vezes o preço mínimo. */
  function mudarQuantos(diferenca) {
    const novo = Math.min(99, Math.max(1, quantos + diferenca))
    if (novo === quantos) return
    vibrar(15)
    setQuantos(novo)
    dizer(`${nomeQuantos(novo)}: cobre pelo menos ${precoFalado(Math.round(preco.valor * novo * 100) / 100)}.`)
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

      <div className="grade">
        <h2 className="mt-6 text-4xl font-extrabold">Quanto cobrar?</h2>
        <p className="mt-1 text-xl text-texto/80">Toque na verdura.</p>

        {/* No computador, as verduras ficam ao lado do preço e da conta. */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
          <div role="radiogroup" aria-label="Escolha a verdura" className="mt-4 grid grid-cols-4 gap-3 lg:grid-cols-2 lg:gap-5">
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
                  className={`apertar relative grid aspect-square place-items-center text-5xl lg:text-8xl ${
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

          <div>
            {/* O preço como a plaquinha de uma banca de feira. */}
            <section aria-live="polite" aria-label="Preço mínimo" className="mt-7 lg:mt-4">
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

            {/* A conta do total, sem precisar fazer de cabeça. */}
            <section aria-label="Fazer a conta" className="cartao mt-8 p-5">
              <h2 className="text-3xl font-bold">Quantos vai vender?</h2>
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => mudarQuantos(-1)}
                  disabled={quantos <= 1}
                  aria-label="Menos um"
                  className="apertar grid size-18 shrink-0 place-items-center rounded-full! border-4 border-nuvem bg-white"
                >
                  <PiMinusBold aria-hidden="true" className="size-9" />
                </button>
                <p className="text-center">
                  <span className="block font-titulo text-6xl leading-none font-extrabold tabular-nums">{quantos}</span>
                  <span className="text-xl font-bold">{quantos === 1 ? preco.contagem[0] : preco.contagem[1]}</span>
                </p>
                <button
                  type="button"
                  onClick={() => mudarQuantos(1)}
                  disabled={quantos >= 99}
                  aria-label="Mais um"
                  className="apertar grid size-18 shrink-0 place-items-center rounded-full! bg-texto text-white"
                >
                  <PiPlusBold aria-hidden="true" className="size-9" />
                </button>
              </div>
              <p aria-live="polite" className="mt-5 rounded-2xl bg-amarelo/30 px-4 py-3 text-xl">
                Cobre pelo menos{' '}
                <strong className="font-titulo text-3xl font-extrabold whitespace-nowrap tabular-nums">{formatarPreco(total)}</strong>
              </p>
            </section>
          </div>
        </div>

        <h2 className="mt-10 text-4xl font-extrabold">Quem compra</h2>
        <ul className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          {compradores.map((c) => (
            <li key={c.id}>
              <CartaoFalante fala={`${c.nome}. Quer ${c.quer}. ${c.quando}.`} className="cartao p-4 pr-14 md:h-full">
                <span className="flex items-center gap-4">
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
                </span>
              </CartaoFalante>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
