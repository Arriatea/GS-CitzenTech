import { useState } from 'react'
import {
  PiArrowDownBold,
  PiArrowLeftBold,
  PiCheckCircleFill,
  PiPaperPlaneTiltFill,
  PiWarningCircleFill,
  PiWrenchFill,
} from 'react-icons/pi'
import CaixaDagua from '../../components/CaixaDagua.jsx'
import { useAudioDescricao, useDescricao } from '../../lib/AudioDescricao.jsx'
import GraficoNivel from './GraficoNivel.jsx'
import Indicadores, { Ponto } from './Indicadores.jsx'
import QuadroCamera from './QuadroCamera.jsx'
import { alertasDa, bomba, camera, dias, litros, numero, situacaoDa, tomDaCaixa, tons } from './situacao.js'

/* Câmeras com problema primeiro. */
const ordemCamera = { alerta: 0, 'sem-sinal': 1, saudavel: 2 }

/* Rola até a parte da página sem mexer na âncora (a âncora é a navegação do app). */
function rolarPara(id) {
  const alvo = document.getElementById(id)
  if (!alvo) return
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' })
  alvo.focus({ preventScroll: true })
}

function Detalhe({ rotulo, valor, detalhe, tom }) {
  return (
    <div>
      <dt className="text-sm text-texto/70">{rotulo}</dt>
      <dd className="mt-0.5 flex items-center gap-2 text-lg font-bold">
        {tom && <Ponto tom={tom} />}
        {valor}
      </dd>
      {detalhe && <dd className="mt-0.5 text-base text-texto/80">{detalhe}</dd>}
    </div>
  )
}

function Camera({ cam, cursos, numeroCam, feito, agir }) {
  const estado = camera[cam.estado]
  const aula = cursos.find((c) => c.id === cam.aula)

  return (
    <li id={`camera-${cam.id}`} tabIndex={-1} className="cartao scroll-mt-6 p-3 outline-none">
      <QuadroCamera cam={cam} numero={numeroCam} />
      <div className="px-2 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">{cam.canteiro}</h3>
          <span className="flex items-center gap-2 text-base font-bold whitespace-nowrap">
            <Ponto tom={estado.tom} />
            {estado.texto}
          </span>
        </div>
        <p className="mt-1 text-base">{cam.diagnostico}</p>

        {cam.estado !== 'saudavel' && (
          <div className="mt-3" aria-live="polite">
            {feito ? (
              <p className="flex items-center gap-2 rounded-xl bg-verde/15 px-3 py-2 text-base font-bold">
                <PiCheckCircleFill aria-hidden="true" className="size-6 shrink-0 text-verde" />
                {cam.estado === 'alerta'
                  ? `Enviado. A família vai ver ${aula ? `a aula ${aula.titulo}` : 'o aviso'} no app.`
                  : 'Visita técnica marcada.'}
              </p>
            ) : (
              <button
                type="button"
                onClick={agir}
                className="apertar flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl! bg-texto px-4 text-base font-bold text-white"
              >
                {cam.estado === 'alerta' ? (
                  <>
                    <PiPaperPlaneTiltFill aria-hidden="true" className="size-5" />
                    Enviar orientação à família
                  </>
                ) : (
                  <>
                    <PiWrenchFill aria-hidden="true" className="size-5" />
                    Marcar visita técnica
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export default function Comunidade({ c, cursos, voltar }) {
  const { dizer } = useAudioDescricao()
  const [feitos, setFeitos] = useState([])
  const situacao = situacaoDa(c)
  const alertas = alertasDa(c)
  const b = bomba[c.bomba.estado]
  const tomCaixa = tomDaCaixa(c.caixa.nivelPct)
  const cameras = c.cameras.map((cam, i) => ({ cam, numero: i + 1 })).sort((x, y) => ordemCamera[x.cam.estado] - ordemCamera[y.cam.estado])

  useDescricao(
    `${c.nome}. ${tons[situacao].rotulo}. ${alertas.length ? `O que resolver: ${alertas.map((a) => a.texto).join(' ')}` : 'Nada para resolver.'} Caixa d'água com ${
      c.caixa.nivelPct
    } por cento, ${numero(litros(c))} litros. Água para beber por ${dias(c.caixa.diasParaBeber)}. Bomba solar: ${b.texto}. ${b.detalhe} Qualidade da água: ${
      c.qualidade.boa ? 'boa' : 'fora do padrão'
    }, teste de ${c.qualidade.ultimoTeste}. Abaixo, ${c.cameras.length} câmeras da horta, as com problema primeiro.`,
    `comunidade-${c.id}`,
  )

  function agir(cam) {
    setFeitos((f) => [...f, cam.id])
    dizer(cam.estado === 'alerta' ? 'Orientação enviada à família.' : 'Visita técnica marcada.')
  }

  return (
    <>
      <button
        type="button"
        onClick={voltar}
        className="inline-flex min-h-12 items-center gap-2 text-lg font-bold underline underline-offset-4"
      >
        <PiArrowLeftBold aria-hidden="true" className="size-5" />
        Todas as comunidades
      </button>

      <header className="mt-3">
        <span className="flex items-center gap-2 text-base font-bold">
          <Ponto tom={situacao} />
          {tons[situacao].rotulo}
        </span>
        <h1 className="mt-1 text-5xl font-extrabold">{c.nome}</h1>
        <p className="mt-1 text-lg text-texto/75">
          {c.municipio !== '—' ? `${c.municipio}. ` : ''}
          {c.familias} famílias. Atualizado {c.atualizado}.
        </p>
      </header>

      {/* Os mesmos quatro indicadores da visão geral */}
      <section aria-label="Resumo" className="cartao mt-6 p-5 md:p-6">
        <Indicadores c={c} grande />
      </section>

      {/* Tudo o que precisa de ação, num bloco só */}
      <section aria-labelledby="titulo-resolver" className="cartao mt-4 p-5 md:p-6">
        <h2 id="titulo-resolver" className="text-2xl font-extrabold">
          {alertas.length ? 'O que resolver' : 'Nada para resolver agora'}
        </h2>
        {alertas.length > 0 && (
          <ul className="mt-2 divide-y-2 divide-nuvem">
            {alertas.map((a, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <PiWarningCircleFill
                  aria-hidden="true"
                  className={`mt-0.5 size-6 shrink-0 ${a.tom === 'grave' ? 'text-vermelho' : 'text-texto/55'}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg">{a.texto}</span>
                  <span className="text-sm font-bold text-texto/65">{a.tom === 'grave' ? 'Urgente' : 'Atenção'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => rolarPara(a.onde)}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2 text-base font-bold underline underline-offset-4 hover:bg-nuvem"
                >
                  {a.tipo === 'camera' ? 'Ver câmera' : 'Ver caixa'}
                  <PiArrowDownBold aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Caixa d'água */}
      <section id="caixa" tabIndex={-1} aria-labelledby="titulo-caixa" className="cartao mt-4 scroll-mt-6 p-5 outline-none md:p-6">
        <h2 id="titulo-caixa" className="text-2xl font-extrabold">
          Caixa d'água
        </h2>

        <div className="mt-4 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex items-center gap-5">
            <CaixaDagua pct={c.caixa.nivelPct} corAgua={tomCaixa === 'grave' ? '#e0352f' : '#1f6fe0'} className="h-32 w-auto shrink-0" />
            <div>
              <p className="font-titulo text-6xl leading-none font-extrabold tabular-nums">{c.caixa.nivelPct}%</p>
              <p className="mt-1 text-lg">
                {numero(litros(c))} de {numero(c.caixa.capacidadeL)} litros
              </p>
              <p className="mt-1 text-lg font-bold">{dias(c.caixa.diasParaBeber)} de água para beber</p>
              <p className="text-sm text-texto/70">se o carro-pipa atrasar</p>
            </div>
          </div>

          <figure className="m-0">
            <figcaption className="text-base font-bold">Nível nos últimos 7 dias</figcaption>
            <div className="mt-2">
              <GraficoNivel historico={c.caixa.historico} />
            </div>
          </figure>
        </div>

        <dl className="mt-6 grid gap-5 border-t-2 border-nuvem pt-5 sm:grid-cols-3">
          <Detalhe rotulo="Bomba solar" valor={b.texto} detalhe={b.detalhe} tom={b.tom} />
          <Detalhe
            rotulo="A horta usa agora"
            valor={c.bomba.fonteHorta === 'poco' ? 'Água do poço' : 'Água da caixa'}
            detalhe={c.bomba.fonteHorta === 'poco' ? 'A caixa fica para beber.' : 'A caixa abastece a horta e a casa.'}
          />
          <Detalhe
            rotulo={`Qualidade da água (teste de ${c.qualidade.ultimoTeste})`}
            valor={c.qualidade.boa ? 'Boa para beber' : 'Fora do padrão'}
            detalhe={c.qualidade.detalhe}
            tom={c.qualidade.boa ? 'ok' : 'grave'}
          />
        </dl>

        <div className="mt-6 border-t-2 border-nuvem pt-5">
          <h3 className="text-base font-bold">O que aconteceu</h3>
          <ol className="mt-2 grid gap-3 sm:grid-cols-3">
            {c.eventos.map((e, i) => (
              <li key={i} className="rounded-2xl bg-nuvem px-4 py-3">
                <span className="block text-sm font-bold text-texto/70">{e.quando}</span>
                <span className="text-base">{e.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Horta pelas câmeras */}
      <section aria-labelledby="titulo-cameras" className="mt-8">
        <h2 id="titulo-cameras" className="text-2xl font-extrabold">
          Horta pelas câmeras
        </h2>
        <p className="mt-1 text-base text-texto/75">
          A IA olha a última foto de cada câmera e aponta o que pode estar errado. Fotos de exemplo, com crédito embaixo de cada uma.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cameras.map(({ cam, numero: n }) => (
            <Camera key={cam.id} cam={cam} cursos={cursos} numeroCam={n} feito={feitos.includes(cam.id)} agir={() => agir(cam)} />
          ))}
        </ul>
      </section>
    </>
  )
}
