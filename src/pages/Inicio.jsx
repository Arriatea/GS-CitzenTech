import { useEffect, useRef, useState } from 'react'
import { PiCheckBold, PiQuestionBold } from 'react-icons/pi'
import CaixaDagua from '../components/CaixaDagua.jsx'
import CartaoFalante from '../components/CartaoFalante.jsx'
import Carregando from '../components/Carregando.jsx'
import { usuaria } from '../data/mock.js'
import { buscarAgua, buscarTarefas } from '../lib/api.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'
import { gravar, hoje, ler, vibrar } from '../lib/guardar.js'
import { useApi } from '../lib/useApi.js'

const textoCaixa = {
  cheia: 'A caixa está cheia',
  metade: 'A caixa está pela metade',
  pouca: 'A caixa está com pouca água',
}

function saudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

/* Marca: uma gota com o sol dentro (a bomba do poço é solar). */
function Marca() {
  return (
    <p className="flex items-center gap-2 font-titulo text-2xl font-bold">
      <svg viewBox="0 0 24 30" className="h-7 w-auto" aria-hidden="true" focusable="false">
        <path d="M12 1 C12 1 2 13 2 19.5 A10 10 0 0 0 22 19.5 C22 13 12 1 12 1 Z" fill="#1f6fe0" />
        <circle cx="12" cy="19.5" r="4.2" fill="#ffc21f" />
      </svg>
      Gota a Gota
    </p>
  )
}

/* O progresso das tarefas vale só para o dia de hoje. */
function lerProgresso(tarefas) {
  const salvo = ler('tarefas', null)
  return salvo && salvo.dia === hoje() ? Math.min(salvo.indice, tarefas.length) : 0
}

/*
 * As tarefas do dia em fila. A feita ganha ✓ e pode ser tocada para voltar nela
 * (se a pessoa apertou "Já fiz" sem querer).
 */
function FilaDeTarefas({ tarefas, atual, voltarPara }) {
  return (
    <ol className="flex gap-2">
      {tarefas.map((t, i) => {
        const feita = i < atual
        const agora = i === atual
        const caixa = `relative grid size-12 place-items-center rounded-xl text-2xl ${
          agora ? 'bg-white ring-4 ring-texto' : feita ? 'bg-verde/15' : 'bg-nuvem'
        }`
        const conteudo = (
          <>
            <span aria-hidden="true" className={feita ? 'opacity-40' : ''}>
              {t.figura}
            </span>
            {feita && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full bg-verde text-white ring-3 ring-white"
              >
                <PiCheckBold className="size-4" />
              </span>
            )}
          </>
        )
        return (
          <li key={t.id}>
            {feita ? (
              <button
                type="button"
                onClick={() => voltarPara(i)}
                aria-label={`Tarefa ${i + 1}, feita: ${t.texto} Toque para voltar nela.`}
                className={caixa}
              >
                {conteudo}
              </button>
            ) : (
              <span role="img" aria-label={`Tarefa ${i + 1}${agora ? ', agora' : ''}: ${t.texto}`} className={caixa}>
                {conteudo}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

const secoes = [
  { destino: 'horta', figura: '🌱', rotulo: 'Minha horta', classe: 'bg-laranja text-white' },
  { destino: 'aprender', figura: '📖', rotulo: 'Aprender', classe: 'bg-azul text-white' },
  { destino: 'vender', figura: '💰', rotulo: 'Vender', classe: 'bg-amarelo text-texto' },
  { destino: 'conversar', figura: '💬', rotulo: 'Falar com a Gotinha', classe: 'bg-verde text-white' },
]

const ATUALIZA_AGUA_MS = 5000

export default function Inicio({ ir }) {
  const { dados: agua } = useApi(buscarAgua, ATUALIZA_AGUA_MS)
  const { dados: tarefas } = useApi(buscarTarefas)
  if (!agua || !tarefas) return <Carregando />
  return <InicioConteudo ir={ir} agua={agua} tarefas={tarefas} />
}

function InicioConteudo({ ir, agua, tarefas }) {
  const { dizer, ligado } = useAudioDescricao()
  const aguaAnterior = useRef(agua)
  const [indice, setIndiceEstado] = useState(() => lerProgresso(tarefas))

  function setIndice(novo) {
    setIndiceEstado(novo)
    gravar('tarefas', { dia: hoje(), indice: novo })
  }

  const tarefa = tarefas[indice]
  const tudoFeito = indice >= tarefas.length
  const ola = `${saudacao()}, ${usuaria.nome}!`
  const dias = agua.diasParaBeber === 1 ? '1 dia' : `${agua.diasParaBeber} dias`
  const temSol = agua.fonte === 'poco'

  useEffect(() => {
    const antes = aguaAnterior.current
    aguaAnterior.current = agua
    if (!ligado) return
    const avisos = []
    if (antes.caixa !== agua.caixa) avisos.push(`Atenção: ${textoCaixa[agua.caixa].toLowerCase()}.`)
    if (antes.fonte !== agua.fonte) {
      avisos.push(agua.fonte === 'poco' ? 'Agora tem sol: a bomba ligou.' : 'Agora não tem sol: a horta usa a água da caixa.')
    }
    if (avisos.length) dizer(avisos.join(' '))
  }, [agua, ligado, dizer])

  const falaAgua = [
    agua.boa ? 'Água boa.' : 'Cuidado: a água não está boa para beber.',
    `${textoCaixa[agua.caixa]}.`,
    agua.boa ? `Se o carro-pipa atrasar, tem água para beber por ${dias}.` : 'Não beba a água do poço agora.',
    temSol ? 'Hoje tem sol: a bomba está ligada e molha a horta.' : 'Hoje não tem sol: a horta usa a água da caixa.',
    agua.caixa === 'pouca' ? 'Use a água da caixa só para beber.' : '',
  ].join(' ')

  const descricaoTarefa = tudoFeito
    ? 'Todas as tarefas de hoje estão feitas. Para ver de novo, toque em Ver de novo.'
    : `Tarefa de hoje, ${indice + 1} de ${tarefas.length}: ${tarefa.texto} ${tarefa.dica} Quando terminar, toque no botão verde Já fiz.${
        tarefa.aula ? ' Para aprender, toque em Como faz.' : ''
      }`

  useDescricao(
    `Você está no início. ${ola} ${falaAgua} Toque no cartão verde para ouvir de novo. ${descricaoTarefa} Embaixo tem quatro botões grandes: Minha horta, laranja. Aprender, azul. Vender, amarelo. E Falar com a Gotinha, verde.`,
  )

  function jaFiz() {
    const proxima = tarefas[indice + 1]
    vibrar()
    setIndice(indice + 1)
    dizer(proxima ? `Muito bem! Próxima tarefa: ${proxima.texto} ${proxima.dica}` : 'Muito bem! Tudo feito por hoje.')
  }

  function voltarPara(i) {
    setIndice(i)
    dizer(`Voltou para a tarefa: ${tarefas[i].texto}`)
  }

  return (
    <div className="pagina">
      <div className="px-4 pt-5">
        <Marca />
        <h1 className="mt-2 text-5xl font-extrabold">{ola}</h1>

        {/* Água: a caixa desenhada com o nível, e as palavras ao lado. Toque para ouvir. */}
        <section aria-label="Água" className="mt-7">
          <CartaoFalante
            fala={falaAgua}
            claro
            className={`rounded-[32px] px-6 pt-6 pb-5 text-white ${agua.boa ? 'bg-verde' : 'bg-vermelho'}`}
          >
            <span className="flex items-center justify-between gap-4 pr-6">
              <span>
                <span className="block font-titulo text-[2.5rem] leading-tight font-extrabold whitespace-nowrap">
                  {agua.boa ? 'Água boa' : 'Água ruim'}
                </span>
                <span className="mt-1 block text-xl font-bold">{textoCaixa[agua.caixa]}</span>
              </span>
              <CaixaDagua caixa={agua.caixa} className="h-28 w-auto shrink-0" />
            </span>
            <span className="mt-4 block border-t-2 border-white/30 pt-4 text-xl">
              {agua.boa ? `Se o carro-pipa atrasar, tem água para beber por ${dias}.` : 'Não beba a água do poço agora.'}
            </span>
            {agua.caixa === 'pouca' && (
              <span className="mt-2 block text-xl font-extrabold">Use a água da caixa só para beber.</span>
            )}
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-lg font-bold">
              <span aria-hidden="true">{temSol ? '☀️' : '☁️'}</span>
              {temSol ? 'Tem sol: a bomba está ligada' : 'Sem sol: a horta usa a caixa'}
            </span>
          </CartaoFalante>
        </section>

        {/* Uma tarefa por vez */}
        <section aria-label="Tarefa de hoje" className="cartao mt-6 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold whitespace-nowrap">Para hoje</h2>
            <FilaDeTarefas tarefas={tarefas} atual={indice} voltarPara={voltarPara} />
          </div>

          {tudoFeito ? (
            <div key="fim" className="surgir mt-6">
              <p className="text-7xl leading-none" aria-hidden="true">
                🎉
              </p>
              <p className="mt-3 font-titulo text-4xl font-extrabold">Tudo feito!</p>
              <p className="mt-1 text-xl text-texto/80">Amanhã tem tarefas novas.</p>
              <button
                type="button"
                onClick={() => setIndice(0)}
                className="apertar mt-6 min-h-16 w-full border-4 border-nuvem bg-white px-5 text-xl font-bold"
              >
                Ver de novo
              </button>
            </div>
          ) : (
            <div key={tarefa.id} className="surgir mt-5">
              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="text-7xl leading-none">
                  {tarefa.figura}
                </span>
                <div>
                  <p className="font-titulo text-3xl leading-tight font-bold">{tarefa.texto}</p>
                  <p className="mt-1 text-xl text-texto/80">{tarefa.dica}</p>
                </div>
              </div>
              <p className="sr-only">
                Tarefa {indice + 1} de {tarefas.length}.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={jaFiz}
                  className="apertar flex min-h-16 flex-1 items-center justify-center gap-2 bg-verde px-5 text-2xl font-extrabold text-white"
                >
                  <PiCheckBold aria-hidden="true" className="size-7" />
                  Já fiz
                </button>
                {tarefa.aula && (
                  <button
                    type="button"
                    onClick={() => ir('aprender', tarefa.aula)}
                    className="apertar flex min-h-16 items-center justify-center gap-2 border-4 border-nuvem bg-white px-4 text-xl font-bold"
                  >
                    <PiQuestionBold aria-hidden="true" className="size-6" />
                    Como faz?
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* As três partes do app */}
        <nav aria-label="Partes do app" className="mt-8 flex flex-col gap-5">
          {secoes.map((s) => (
            <button
              key={s.destino}
              type="button"
              onClick={() => ir(s.destino)}
              className={`apertar flex min-h-24 w-full items-center gap-4 rounded-[26px]! px-6 text-left font-titulo text-4xl font-extrabold ${s.classe}`}
            >
              <span aria-hidden="true" className="text-5xl">
                {s.figura}
              </span>
              {s.rotulo}
            </button>
          ))}
        </nav>

        <p className="mt-10">
          <a
            href="#parceiro"
            onClick={(e) => {
              e.preventDefault()
              ir('parceiro')
            }}
            className="text-lg text-texto/75 underline underline-offset-4"
          >
            Sou de uma ONG parceira
          </a>
        </p>
      </div>
    </div>
  )
}
