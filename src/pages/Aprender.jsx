import { useState } from 'react'
import { PiArrowLeftBold, PiArrowRightBold, PiCheckBold } from 'react-icons/pi'
import Topo, { coresSecao } from '../components/Topo.jsx'
import { cursos } from '../data/mock.js'
import { useDescricao } from '../lib/AudioDescricao.jsx'

const corPreenchida = {
  laranja: 'bg-laranja',
  azul: 'bg-azul',
  amarelo: 'bg-amarelo',
  verde: 'bg-verde',
  vermelho: 'bg-vermelho',
}

function Lista({ ir, abrir }) {
  useDescricao(
    `Você está em Aprender. No alto tem o botão Início. Tem ${cursos.length} aulas: ${cursos
      .map((c) => `${c.titulo}, ${c.passos.length} passos`)
      .join('. ')}. Toque numa aula para começar.`,
    'lista',
  )

  return (
    <div className="pagina">
      <Topo cor="azul" figura="📖" titulo="Aprender" aoVoltar={() => ir('inicio')} />

      <ul className="mt-6 flex flex-col gap-5 px-4">
        {cursos.map((curso) => (
          <li key={curso.id}>
            <button
              type="button"
              onClick={() => abrir(curso.id)}
              className={`apertar flex min-h-24 w-full items-center gap-4 rounded-[26px]! p-4 text-left ${coresSecao[curso.cor]}`}
            >
              <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-full bg-white text-5xl">
                {curso.figura}
              </span>
              <span className="flex flex-col">
                <span className="font-titulo text-3xl leading-tight font-bold">{curso.titulo}</span>
                <span className="text-xl">{curso.passos.length} passos</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Aula({ curso, voltar }) {
  const [passo, setPasso] = useState(0)
  const [fim, setFim] = useState(false)
  const total = curso.passos.length
  const atual = curso.passos[passo]
  const ultimo = passo === total - 1

  useDescricao(
    fim
      ? `Muito bem! Você terminou a aula ${curso.titulo}. Para ver outras aulas, toque no botão Ver outras aulas.`
      : `Aula ${curso.titulo}. Passo ${passo + 1} de ${total}. ${atual.texto} ${
          ultimo ? 'Quando terminar, toque no botão verde Terminei.' : 'Para o próximo passo, toque no botão verde Próximo.'
        }${passo > 0 ? ' Para voltar, toque na seta.' : ''}`,
    `${curso.id}-${passo}-${fim}`,
  )

  function avancar() {
    if (ultimo) setFim(true)
    else setPasso(passo + 1)
    window.scrollTo(0, 0)
  }

  return (
    <div className="pagina">
      <Topo cor={curso.cor} figura={curso.figura} titulo={curso.titulo} rotuloVoltar="Aulas" aoVoltar={voltar} />

      <div className="px-4">
        {fim ? (
          <section key="fim" className="cartao surgir mt-6 p-6">
            <p aria-hidden="true" className="text-8xl leading-none">
              🎉
            </p>
            <h2 className="mt-4 text-5xl font-extrabold">Muito bem!</h2>
            <p className="mt-2 text-xl">Você terminou a aula {curso.titulo}.</p>
            <button
              type="button"
              onClick={voltar}
              className="apertar mt-6 min-h-16 w-full bg-azul px-5 text-2xl font-bold text-white"
            >
              Ver outras aulas
            </button>
          </section>
        ) : (
          <>
            {/* Progresso: segmentos coloridos e também em palavras */}
            <div className="mt-6">
              <p className="text-xl font-bold text-texto/75">
                Passo {passo + 1} de {total}
              </p>
              <div aria-hidden="true" className="mt-2 flex gap-2">
                {curso.passos.map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 flex-1 rounded-full ${i <= passo ? corPreenchida[curso.cor] : 'bg-nuvem'}`}
                  />
                ))}
              </div>
            </div>

            <section key={passo} aria-live="polite" className="cartao surgir mt-5 p-6">
              <p aria-hidden="true" className="text-8xl leading-none">
                {atual.figura}
              </p>
              <p className="mt-5 font-titulo text-4xl leading-tight font-bold">{atual.texto}</p>
            </section>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setPasso(passo - 1)}
                disabled={passo === 0}
                aria-label="Passo anterior"
                className="apertar grid min-h-16 w-20 shrink-0 place-items-center border-4 border-nuvem bg-white"
              >
                <PiArrowLeftBold aria-hidden="true" className="size-8" />
              </button>
              <button
                type="button"
                onClick={avancar}
                className="apertar flex min-h-16 flex-1 items-center justify-center gap-2 bg-verde px-5 text-2xl font-extrabold text-white"
              >
                {ultimo ? (
                  <>
                    <PiCheckBold aria-hidden="true" className="size-7" />
                    Terminei
                  </>
                ) : (
                  <>
                    Próximo
                    <PiArrowRightBold aria-hidden="true" className="size-7" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Aprender({ ir, aulaInicial }) {
  const [aulaId, setAulaId] = useState(() => (cursos.some((c) => c.id === aulaInicial) ? aulaInicial : null))
  const curso = cursos.find((c) => c.id === aulaId)

  function trocar(id) {
    setAulaId(id)
    window.scrollTo(0, 0)
  }

  if (curso) return <Aula key={curso.id} curso={curso} voltar={() => trocar(null)} />
  return <Lista ir={ir} abrir={trocar} />
}
