import { useEffect, useRef, useState } from 'react'
import { PiCameraFill, PiCheckCircleFill, PiFirstAidKitFill, PiPlantFill, PiVideoCameraFill, PiWarningFill } from 'react-icons/pi'
import CartaoFalante from '../components/CartaoFalante.jsx'
import Topo from '../components/Topo.jsx'
import Carregando from '../components/Carregando.jsx'
import { buscarCanteiros } from '../lib/api.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'
import { useApi } from '../lib/useApi.js'

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

function Canteiro({ canteiro, ir }) {
  const estado = estados[canteiro.estado]
  const cuidado = canteiro.estado === 'cuidado'
  const fala = [canteiro.nome + '.', estado.texto + '.', canteiro.aviso || '', cuidado && canteiro.aula ? 'Toque em Como cuidar.' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={`cartao overflow-hidden ${cuidado ? estado.borda : ''}`}>
      <CartaoFalante fala={fala} className="p-4 pr-12">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="text-6xl leading-none">
            {canteiro.figura}
          </span>
          <span className="flex flex-col items-start gap-2">
            <span className="font-titulo text-3xl leading-none font-bold">{canteiro.nome}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-lg font-bold whitespace-nowrap ${estado.classe}`}>
              <estado.Icone aria-hidden="true" className="size-5" />
              {estado.texto}
            </span>
          </span>
        </span>
      </CartaoFalante>

      {cuidado && (
        <div className="px-4 pb-5">
          {canteiro.aviso && (
            <p className="mb-4 flex items-center gap-2 rounded-2xl bg-vermelho/10 px-4 py-3 text-xl font-bold">
              <PiVideoCameraFill aria-hidden="true" className="size-6 shrink-0 text-vermelho" />
              {canteiro.aviso}
            </p>
          )}
          {canteiro.aula && (
            <button
              type="button"
              onClick={() => ir('aprender', canteiro.aula)}
              className="apertar flex min-h-16 w-full items-center justify-center gap-2 bg-vermelho px-5 text-xl font-bold text-white"
            >
              <PiFirstAidKitFill aria-hidden="true" className="size-7" />
              Como cuidar
            </button>
          )}
        </div>
      )}
    </li>
  )
}

/* O que precisa de cuidado aparece primeiro; depois o que pode colher. */
const ordem = { cuidado: 0, colher: 1, crescendo: 2 }
const porUrgencia = (a, b) => ordem[a.estado] - ordem[b.estado]

export default function Horta({ ir }) {
  const { dados: canteiros } = useApi(buscarCanteiros)
  if (!canteiros) return <Carregando />
  return <HortaConteudo ir={ir} canteiros={canteiros} />
}

function HortaConteudo({ ir, canteiros }) {
  const { dizer } = useAudioDescricao()
  const [foto, setFoto] = useState(null)
  const [situacao, setSituacao] = useState('nada') // 'nada' | 'olhando' | 'pronto'
  const relogio = useRef(null)

  const venda = canteiros.filter((c) => c.destino === 'venda').sort(porUrgencia)
  const daComunidade = canteiros.filter((c) => c.destino === 'comunidade').sort(porUrgencia)

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

  const resumoCanteiros = (lista) =>
    lista.map((c) => `${c.nome}, ${estados[c.estado].texto}${c.aviso ? `. ${c.aviso}` : ''}`).join('. ')
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

      <div className="grade">
        <label className="apertar mt-6 flex min-h-24 w-full items-center justify-center gap-3 rounded-[26px]! bg-texto px-6 font-titulo text-3xl font-bold text-white focus-within:outline-4 focus-within:outline-offset-3 focus-within:outline-texto">
          <PiCameraFill aria-hidden="true" className="size-10" />
          Tirar foto da planta
          <input type="file" accept="image/*" capture="environment" onChange={aoEscolherFoto} className="sr-only" />
        </label>

        {foto && (
          <section aria-label="Foto da planta" className="cartao surgir mt-6 overflow-hidden">
            <img src={foto} alt="A foto que você tirou" className="h-60 w-full object-cover" />
            <div className="p-5" aria-live="polite">
              {situacao === 'olhando' ? (
                <p className="flex items-center gap-3 font-titulo text-3xl font-bold">
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
                    className="apertar mt-5 flex min-h-16 w-full items-center justify-center gap-2 bg-vermelho px-5 text-xl font-bold text-white"
                  >
                    <PiFirstAidKitFill aria-hidden="true" className="size-7" />
                    Como cuidar
                  </button>
                  <p className="mt-4 text-base font-medium text-texto/70">
                    Exemplo de resposta. No app de verdade, quem responde é a IA.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <h2 className="mt-10 text-4xl font-extrabold">Para vender</h2>
        <p className="text-xl text-texto/80">Estes você vende. Eles pagam a casa e a bomba.</p>
        <ul className="mt-4 flex flex-col gap-4">
          {venda.map((c) => (
            <Canteiro key={c.id} canteiro={c} ir={ir} />
          ))}
        </ul>

        <h2 className="mt-10 text-4xl font-extrabold">Para a comunidade</h2>
        <p className="text-xl text-texto/80">Comida para as famílias da comunidade.</p>
        <ul className="mt-4 flex flex-col gap-4">
          {daComunidade.map((c) => (
            <Canteiro key={c.id} canteiro={c} ir={ir} />
          ))}
        </ul>
      </div>
    </div>
  )
}
