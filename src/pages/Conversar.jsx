import { useEffect, useRef, useState } from 'react'
import { PiMicrophoneFill, PiPaperPlaneRightFill, PiStopFill } from 'react-icons/pi'
import Topo from '../components/Topo.jsx'
import { conversar } from '../lib/api.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'
import { vibrar } from '../lib/guardar.js'

const Reconhecimento = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

const perguntasProntas = ['A água está boa?', 'O que eu colho hoje?', 'Quanto cobro na alface?']

const saudacao = { de: 'gotinha', texto: 'Oi! Eu sou a Gotinha. Pode perguntar da água, da horta ou dos preços.' }

function lerDaVisita(chave, padrao) {
  try {
    const valor = window.sessionStorage.getItem(`gota-a-gota:${chave}`)
    return valor === null ? padrao : JSON.parse(valor)
  } catch {
    return padrao
  }
}

function gravarNaVisita(chave, valor) {
  try {
    window.sessionStorage.setItem(`gota-a-gota:${chave}`, JSON.stringify(valor))
  } catch {
    /* sem armazenamento: a conversa vale só enquanto a tela estiver aberta */
  }
}

function novaSessao() {
  return window.crypto?.randomUUID?.() ?? `sessao-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Balao({ de, texto }) {
  const daPessoa = de === 'pessoa'
  return (
    <li className={`surgir flex ${daPessoa ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] px-5 py-4 text-xl ${
          daPessoa ? 'rounded-[24px] rounded-br-md bg-texto text-white' : 'cartao rounded-bl-md! flex gap-3'
        }`}
      >
        {!daPessoa && (
          <span aria-hidden="true" className="text-3xl leading-none">
            💧
          </span>
        )}
        <span>
          <span className="sr-only">{daPessoa ? 'Você disse: ' : 'Gotinha: '}</span>
          {texto}
        </span>
      </p>
    </li>
  )
}

export default function Conversar({ ir }) {
  const { parar, dizer, ligado } = useAudioDescricao()
  const ligadoRef = useRef(ligado)
  const montada = useRef(true)
  const [sessao] = useState(() => {
    const salva = lerDaVisita('sessao-gotinha', null)
    if (salva) return salva
    const nova = novaSessao()
    gravarNaVisita('sessao-gotinha', nova)
    return nova
  })
  const [mensagens, setMensagens] = useState(() => lerDaVisita('conversa-gotinha', [saudacao]))
  const [esperando, setEsperando] = useState(false)
  const [ouvindo, setOuvindo] = useState(false)
  const [aviso, setAviso] = useState('')
  const [texto, setTexto] = useState('')
  const reconhecedor = useRef(null)
  const fim = useRef(null)

  useEffect(() => {
    gravarNaVisita('conversa-gotinha', mensagens)
    fim.current?.scrollIntoView({ block: 'nearest' })
  }, [mensagens, esperando])

  useEffect(() => {
    ligadoRef.current = ligado
  }, [ligado])

  useEffect(() => {
    montada.current = true
    return () => {
      montada.current = false
      reconhecedor.current?.abort()
    }
  }, [])

  function enviar(pergunta) {
    const limpa = pergunta.trim()
    if (!limpa || esperando) return
    vibrar()
    setAviso('')
    setMensagens((atuais) => [...atuais, { de: 'pessoa', texto: limpa }])
    setEsperando(true)
    if (ligadoRef.current) dizer('A Gotinha está pensando.')
    conversar(sessao, limpa).then((resposta) => {
      const nova = { de: 'gotinha', texto: resposta }
      if (!montada.current) {
        gravarNaVisita('conversa-gotinha', [...lerDaVisita('conversa-gotinha', [saudacao]), nova])
        return
      }
      setMensagens((atuais) => [...atuais, nova])
      setEsperando(false)
      if (ligadoRef.current) dizer(resposta)
    })
  }

  function falar() {
    if (ouvindo) {
      reconhecedor.current?.stop()
      return
    }
    parar()
    setAviso('')
    const rec = new Reconhecimento()
    rec.lang = 'pt-BR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (evento) => enviar(evento.results[0][0].transcript)
    rec.onerror = (evento) => {
      if (evento.error !== 'aborted') setAviso('Não deu para ouvir. Toque no botão e fale de novo.')
    }
    rec.onend = () => setOuvindo(false)
    reconhecedor.current = rec
    setOuvindo(true)
    rec.start()
  }

  function aoEnviarTexto(evento) {
    evento.preventDefault()
    enviar(texto)
    setTexto('')
  }

  const ultimaResposta = [...mensagens].reverse().find((m) => m.de === 'gotinha')
  const comoPerguntar = Reconhecimento
    ? 'Logo abaixo da conversa tem o botão verde Falar: toque nele e diga sua pergunta.'
    : 'Logo abaixo da conversa tem um campo para escrever a pergunta e o botão Enviar.'

  useDescricao(
    `Você está em Falar com a Gotinha. No alto tem o botão Início. ${
      esperando ? 'A Gotinha está pensando.' : `A Gotinha disse: ${ultimaResposta?.texto ?? ''}`
    } ${comoPerguntar} Ou toque numa pergunta pronta: ${perguntasProntas.join(' ')}`,
  )

  return (
    <div className="pagina">
      <Topo cor="verde" figura="💬" titulo="Falar com a Gotinha" aoVoltar={() => ir('inicio')} />

      <div className="px-4">
        <ol role="log" aria-label="Conversa" className="mt-6 flex flex-col gap-4">
          {mensagens.map((m, i) => (
            <Balao key={i} de={m.de} texto={m.texto} />
          ))}
          {esperando && (
            <li className="surgir flex justify-start">
              <p className="cartao flex items-center gap-3 rounded-bl-md! px-5 py-4 text-xl font-bold">
                <span aria-hidden="true" className="pulsar text-3xl leading-none">
                  💭
                </span>
                A Gotinha está pensando…
              </p>
            </li>
          )}
        </ol>

        <div ref={fim} className="scroll-mb-36">
          {Reconhecimento ? (
            <button
              type="button"
              onClick={falar}
              disabled={esperando}
              className={`apertar mt-8 flex min-h-24 w-full items-center justify-center gap-3 rounded-[26px]! px-6 font-titulo text-3xl font-extrabold text-white ${
                ouvindo ? 'bg-vermelho' : 'bg-verde'
              }`}
            >
              {ouvindo ? (
                <>
                  <PiStopFill aria-hidden="true" className="pulsar size-10" />
                  Ouvindo… toque para parar
                </>
              ) : (
                <>
                  <PiMicrophoneFill aria-hidden="true" className="size-10" />
                  Falar
                </>
              )}
            </button>
          ) : (
            <form onSubmit={aoEnviarTexto} className="mt-8 flex flex-col gap-3">
              <label htmlFor="pergunta" className="text-2xl font-bold">
                Escreva sua pergunta
              </label>
              <input
                id="pergunta"
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                autoComplete="off"
                className="min-h-16 rounded-[22px] border-4 border-nuvem bg-white px-5 text-xl"
              />
              <button
                type="submit"
                disabled={esperando || !texto.trim()}
                className="apertar flex min-h-16 items-center justify-center gap-2 bg-verde px-5 text-2xl font-extrabold text-white"
              >
                <PiPaperPlaneRightFill aria-hidden="true" className="size-7" />
                Enviar
              </button>
            </form>
          )}

          {aviso && (
            <p role="status" className="mt-3 text-xl font-bold text-vermelho">
              {aviso}
            </p>
          )}

          <h2 className="mt-8 text-3xl font-bold">Perguntas prontas</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {perguntasProntas.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => enviar(p)}
                  disabled={esperando}
                  className="apertar min-h-16 w-full border-4 border-nuvem bg-white px-5 text-left text-xl font-bold"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
