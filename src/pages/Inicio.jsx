import { useState } from 'react'
import { PiCheckBold, PiDropFill, PiQuestionBold } from 'react-icons/pi'
import { agua, tarefas, usuaria } from '../data/mock.js'
import { useAudioDescricao, useDescricao } from '../lib/AudioDescricao.jsx'

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

/* Bandeirolas de feira, nas cores das partes do app. Balançam uma vez ao abrir. */
const coresBandeirola = ['#f2661c', '#1f6fe0', '#ffc21f', '#1fa24a', '#e0352f']

function Bandeirolas() {
  const total = 11
  const bandeiras = Array.from({ length: total }, (_, i) => {
    const t = (i + 0.5) / total
    const x = 480 * t
    const y = (1 - t) ** 2 * 6 + 2 * (1 - t) * t * 30 + t ** 2 * 6
    return { x, y, cor: coresBandeirola[i % coresBandeirola.length] }
  })

  return (
    <svg viewBox="0 0 480 64" className="block w-full" aria-hidden="true" focusable="false">
      <path d="M0 6 Q240 54 480 6" fill="none" stroke="#22264a" strokeWidth="2.5" />
      {bandeiras.map((b, i) => (
        <path
          key={i}
          className="bandeirola"
          style={{ animationDelay: `${i * 60}ms` }}
          d={`M${b.x - 17} ${b.y} L${b.x + 17} ${b.y} L${b.x + 17} ${b.y + 24} L${b.x} ${b.y + 34} L${b.x - 17} ${b.y + 24} Z`}
          fill={b.cor}
        />
      ))}
    </svg>
  )
}

const secoes = [
  { destino: 'horta', figura: '🌱', rotulo: 'Minha horta', classe: 'bg-laranja text-white' },
  { destino: 'aprender', figura: '📖', rotulo: 'Aprender', classe: 'bg-azul text-white' },
  { destino: 'vender', figura: '💰', rotulo: 'Vender', classe: 'bg-amarelo text-texto' },
]

export default function Inicio({ ir }) {
  const { dizer } = useAudioDescricao()
  const [indice, setIndice] = useState(0)

  const tarefa = tarefas[indice]
  const tudoFeito = indice >= tarefas.length
  const ola = `${saudacao()}, ${usuaria.nome}!`
  const dias = agua.diasParaBeber === 1 ? '1 dia' : `${agua.diasParaBeber} dias`

  const descricaoAgua = agua.boa
    ? `Água boa. ${textoCaixa[agua.caixa]}. Se o carro-pipa atrasar, tem água para beber por ${dias}.`
    : `Cuidado: a água não está boa para beber. ${textoCaixa[agua.caixa]}.`

  const descricaoTarefa = tudoFeito
    ? 'Todas as tarefas de hoje estão feitas. Para ver de novo, toque em Ver de novo.'
    : `Tarefa de hoje, ${indice + 1} de ${tarefas.length}: ${tarefa.texto} ${tarefa.dica} Quando terminar, toque no botão verde Já fiz.${
        tarefa.aula ? ' Para aprender, toque em Como faz.' : ''
      }`

  useDescricao(
    `Você está no início. ${ola} ${descricaoAgua} ${descricaoTarefa} Embaixo tem três botões grandes: Minha horta, laranja. Aprender, azul. E Vender, amarelo.`,
  )

  function jaFiz() {
    const proxima = tarefas[indice + 1]
    setIndice(indice + 1)
    dizer(proxima ? `Muito bem! Próxima tarefa: ${proxima.texto} ${proxima.dica}` : 'Muito bem! Tudo feito por hoje.')
  }

  return (
    <div className="pagina">
      <Bandeirolas />

      <div className="px-4">
        <p className="mt-3 font-titulo text-2xl font-bold">
          <span aria-hidden="true">☀️ </span>Gota a Gota
        </p>
        <h1 className="mt-1 text-5xl font-extrabold">{ola}</h1>

        {/* Água */}
        <section
          aria-label="Água"
          className={`mt-6 rounded-[32px] p-6 text-white ${agua.boa ? 'bg-verde' : 'bg-vermelho'}`}
        >
          <div className="flex items-center gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-full bg-white">
              <PiDropFill aria-hidden="true" className={`size-12 ${agua.boa ? 'text-verde' : 'text-vermelho'}`} />
            </span>
            <div>
              <h2 className="text-4xl font-extrabold">{agua.boa ? 'Água boa' : 'Água ruim'}</h2>
              <p className="text-2xl font-extrabold">{textoCaixa[agua.caixa]}</p>
            </div>
          </div>
          <p className="mt-4 text-xl font-bold">
            {agua.boa
              ? `Se o carro-pipa atrasar, tem água para beber por ${dias}.`
              : 'Não beba a água do poço agora.'}
          </p>
        </section>

        {/* Uma tarefa por vez */}
        <section aria-label="Tarefa de hoje" className="cartao mt-6 p-6">
          {tudoFeito ? (
            <div key="fim" className="surgir">
              <p className="text-7xl" aria-hidden="true">
                🎉
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">Tudo feito!</h2>
              <button
                type="button"
                onClick={() => setIndice(0)}
                className="apertar mt-6 min-h-16 w-full border-4 border-nuvem bg-white px-5 text-xl font-extrabold"
              >
                Ver de novo
              </button>
            </div>
          ) : (
            <div key={tarefa.id} className="surgir">
              <p className="text-xl font-extrabold text-texto/70">
                Hoje · {indice + 1} de {tarefas.length}
              </p>
              <p className="mt-3 text-7xl leading-none" aria-hidden="true">
                {tarefa.figura}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold">{tarefa.texto}</h2>
              <p className="mt-1 text-xl">{tarefa.dica}</p>

              <div className="mt-6 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={jaFiz}
                  className="apertar flex min-h-16 w-full items-center justify-center gap-2 bg-verde px-5 text-2xl font-extrabold text-white"
                >
                  <PiCheckBold aria-hidden="true" className="size-7" />
                  Já fiz
                </button>
                {tarefa.aula && (
                  <button
                    type="button"
                    onClick={() => ir('aprender', tarefa.aula)}
                    className="apertar flex min-h-16 w-full items-center justify-center gap-2 border-4 border-nuvem bg-white px-5 text-xl font-extrabold"
                  >
                    <PiQuestionBold aria-hidden="true" className="size-7" />
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
              className={`apertar flex min-h-24 w-full items-center gap-4 rounded-[28px]! px-6 text-left font-titulo text-4xl font-extrabold ${s.classe}`}
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
            className="text-lg font-bold text-texto/75 underline underline-offset-4"
          >
            Sou de uma iniciativa parceira
          </a>
        </p>
      </div>
    </div>
  )
}
