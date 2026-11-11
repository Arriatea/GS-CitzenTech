import { useEffect, useRef, useState } from 'react'
import { PiCameraFill, PiCheckCircleFill, PiFirstAidKitFill, PiPlantFill, PiWarningFill } from 'react-icons/pi'
import Topo from '../components/Topo.jsx'
import { canteiros } from '../data/mock.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'

/* Selo de estado: sempre cor e palavra juntas. */
const estados = {
  colher: { texto: 'Pode colher!', classe: 'bg-verde text-white', Icone: PiCheckCircleFill, borda: 'border-verde' },
  crescendo: { texto: 'Crescendo', classe: 'bg-nuvem text-texto', Icone: PiPlantFill, borda: 'border-nuvem' },
  cuidado: { texto: 'Precisa de cuidado', classe: 'bg-vermelho text-white', Icone: PiWarningFill, borda: 'border-vermelho' },
}

/* Resposta simulada. No app de verdade, a foto vai para a IA. */
const respostaFoto = {
  figura: '🐛',
  titulo: 'Parece pulgão',
  texto: 'São bichinhos pequenos embaixo da folha. Dá para tirar com sabão de coco.',
  aula: 'pulgao',
}

function Canteiro({ canteiro, ir, dizer }) {
  const estado = estados[canteiro.estado]
  const falaEstado = canteiro.estado === 'cuidado' ? 'Precisa de cuidado. Toque em Como cuidar.' : estado.texto

  return (
    <li className={`cartao overflow-hidden ${canteiro.estado === 'cuidado' ? estado.borda : ''}`}>
      <button
        type="button"
        onClick={() => dizer(`${canteiro.nome}. ${falaEstado}`)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <span aria-hidden="true" className="text-7xl leading-none">
          {canteiro.figura}
        </span>
        <span className="flex flex-col items-start gap-2">
          <span className="font-titulo text-3xl font-extrabold">{canteiro.nome}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-lg font-extrabold ${estado.classe}`}>
            <estado.Icone aria-hidden="true" className="size-5" />
            {estado.texto}
          </span>
        </span>
      </button>

      {canteiro.estado === 'cuidado' && canteiro.aula && (
        <div className="px-4 pb-5">
          <button
            type="button"
            onClick={() => ir('aprender', canteiro.aula)}
            className="apertar flex min-h-16 w-full items-center justify-center gap-2 bg-vermelho px-5 text-xl font-extrabold text-white"
          >
            <PiFirstAidKitFill aria-hidden="true" className="size-7" />
            Como cuidar
          </button>
        </div>
      )}
    </li>
  )
}

export default function Horta({ ir }) {
  const { dizer } = useAudioDescricao()
  const [foto, setFoto] = useState(null)
  const [situacao, setSituacao] = useState('nada') // 'nada' | 'olhando' | 'pronto'
  const relogio = useRef(null)

  const venda = canteiros.filter((c) => c.destino === 'venda')
  const daComunidade = canteiros.filter((c) => c.destino === 'comunidade')

  // Limpa a foto e o relógio quando sai da tela ou troca de foto.
  useEffect(() => () => clearTimeout(relogio.current), [])
  useEffect(() => () => foto && URL.revokeObjectURL(foto), [foto])

  function aoEscolherFoto(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    clearTimeout(relogio.current)
    setFoto(URL.createObjectURL(arquivo))
    setSituacao('olhando')
    dizer('Recebi a foto. Estou olhando.')
    relogio.current = setTimeout(() => {
      setSituacao('pronto')
      dizer(`${respostaFoto.titulo}. ${respostaFoto.texto} Para aprender, toque em Como cuidar.`)
    }, 1500)
  }

  const resumoCanteiros = (lista) => lista.map((c) => `${c.nome}, ${estados[c.estado].texto}`).join('. ')
  const descricaoFoto =
    situacao === 'pronto'
      ? `Resposta da foto: ${respostaFoto.titulo}. ${respostaFoto.texto} Embaixo tem o botão Como cuidar.`
      : situacao === 'olhando'
        ? 'Estou olhando a foto.'
        : ''

  useDescricao(
    `Você está na sua horta. No alto tem o botão Início. Logo abaixo, o botão escuro Tirar foto da planta. ${descricaoFoto} Para vender: ${resumoCanteiros(
      venda,
    )}. Para a comunidade: ${resumoCanteiros(daComunidade)}. Toque numa planta para ouvir.`,
  )

  return (
    <div className="pagina">
      <Topo cor="laranja" figura="🌱" titulo="Minha horta" aoVoltar={() => ir('inicio')} />

      <div className="px-4">
        <label className="apertar mt-6 flex min-h-24 w-full items-center justify-center gap-3 rounded-[28px]! bg-texto px-6 font-titulo text-3xl font-extrabold text-white focus-within:outline-4 focus-within:outline-offset-3 focus-within:outline-texto">
          <PiCameraFill aria-hidden="true" className="size-10" />
          Tirar foto da planta
          <input type="file" accept="image/*" capture="environment" onChange={aoEscolherFoto} className="sr-only" />
        </label>

        {foto && (
          <section aria-label="Foto da planta" className="cartao surgir mt-6 overflow-hidden">
            <img src={foto} alt="A foto que você tirou" className="h-60 w-full object-cover" />
            <div className="p-5" aria-live="polite">
              {situacao === 'olhando' ? (
                <p className="flex items-center gap-3 font-titulo text-3xl font-extrabold">
                  <span aria-hidden="true" className="pulsar">
                    👀
                  </span>
                  Olhando a foto…
                </p>
              ) : (
                <div className="surgir">
                  <h2 className="flex items-center gap-3 text-4xl font-extrabold">
                    <span aria-hidden="true">{respostaFoto.figura}</span>
                    {respostaFoto.titulo}
                  </h2>
                  <p className="mt-2 text-xl">{respostaFoto.texto}</p>
                  <button
                    type="button"
                    onClick={() => ir('aprender', respostaFoto.aula)}
                    className="apertar mt-5 flex min-h-16 w-full items-center justify-center gap-2 bg-vermelho px-5 text-xl font-extrabold text-white"
                  >
                    <PiFirstAidKitFill aria-hidden="true" className="size-7" />
                    Como cuidar
                  </button>
                  <p className="mt-4 text-base font-semibold text-texto/70">
                    Exemplo de resposta. No app de verdade, quem responde é a IA.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <h2 className="mt-10 text-4xl font-extrabold">
          <span aria-hidden="true">💰 </span>Para vender
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {venda.map((c) => (
            <Canteiro key={c.id} canteiro={c} ir={ir} dizer={dizer} />
          ))}
        </ul>

        <h2 className="mt-10 text-4xl font-extrabold">
          <span aria-hidden="true">🤝 </span>Para a comunidade
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {daComunidade.map((c) => (
            <Canteiro key={c.id} canteiro={c} ir={ir} dizer={dizer} />
          ))}
        </ul>
      </div>
    </div>
  )
}
