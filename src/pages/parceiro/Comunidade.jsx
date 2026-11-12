import { useState } from 'react'
import {
  PiArrowLeftBold,
  PiCheckCircleFill,
  PiCloudFill,
  PiDropFill,
  PiDropSlashFill,
  PiPaperPlaneTiltFill,
  PiSunFill,
  PiWarningFill,
  PiWrenchFill,
} from 'react-icons/pi'
import CaixaDagua from '../../components/CaixaDagua.jsx'
import { cursos } from '../../data/mock.js'
import { useAudioDescricao, useDescricao } from '../../lib/AudioDescricao.jsx'
import GraficoNivel from './GraficoNivel.jsx'
import QuadroCamera from './QuadroCamera.jsx'
import { alertasDa, bomba, camera, dias, litros, numero, situacaoDa, tomDaCaixa, tons } from './situacao.js'

const iconeBomba = { ligada: PiSunFill, 'sem-sol': PiCloudFill, falha: PiWarningFill }

function Dado({ rotulo, valor, detalhe, Icone, corIcone = '' }) {
  return (
    <div className="flex gap-3 py-3">
      {Icone && <Icone aria-hidden="true" className={`mt-1 size-6 shrink-0 ${corIcone}`} />}
      <div>
        <dt className="text-base text-texto/75">{rotulo}</dt>
        <dd className="text-xl font-bold">{valor}</dd>
        {detalhe && <dd className="text-base text-texto/80">{detalhe}</dd>}
      </div>
    </div>
  )
}

function Camera({ cam, numeroCam, feito, agir }) {
  const estado = camera[cam.estado]
  const aula = cursos.find((c) => c.id === cam.aula)

  return (
    <li className={`cartao overflow-hidden p-3 ${cam.estado === 'alerta' ? 'border-amarelo!' : ''}`}>
      <QuadroCamera cam={cam} numero={numeroCam} />
      <div className="px-2 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-bold">{cam.canteiro}</h3>
          <span className={`rounded-full px-3 py-0.5 text-base font-bold whitespace-nowrap ${tons[estado.tom].selo}`}>
            {estado.texto}
          </span>
        </div>
        <p className="mt-1 text-lg">{cam.diagnostico}</p>

        {cam.estado !== 'saudavel' && (
          <div className="mt-4" aria-live="polite">
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
                className="apertar flex min-h-14 w-full items-center justify-center gap-2 bg-texto px-4 text-lg font-bold text-white"
              >
                {cam.estado === 'alerta' ? (
                  <>
                    <PiPaperPlaneTiltFill aria-hidden="true" className="size-6" />
                    Enviar orientação à família
                  </>
                ) : (
                  <>
                    <PiWrenchFill aria-hidden="true" className="size-6" />
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

export default function Comunidade({ c, voltar }) {
  const { dizer } = useAudioDescricao()
  const [feitos, setFeitos] = useState([])
  const situacao = situacaoDa(c)
  const alertas = alertasDa(c)
  const b = bomba[c.bomba.estado]
  const tomCaixa = tomDaCaixa(c.caixa.nivelPct)

  useDescricao(
    `${c.nome}. ${tons[situacao].rotulo}. ${alertas.map((a) => a.texto).join(' ')} Caixa d'água com ${c.caixa.nivelPct} por cento, ${numero(
      litros(c),
    )} litros. Água para beber por ${dias(c.caixa.diasParaBeber)}. Bomba solar: ${b.texto}. ${b.detalhe} Qualidade da água: ${
      c.qualidade.boa ? 'boa' : 'precisa de cuidado'
    }, teste de ${c.qualidade.ultimoTeste}. Abaixo, ${c.cameras.length} câmeras da horta.`,
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

      <header className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-5xl font-extrabold">{c.nome}</h1>
          <p className="mt-1 text-xl text-texto/80">
            {c.municipio !== '—' ? `${c.municipio}. ` : ''}
            {c.familias} famílias. Atualizado {c.atualizado}.
          </p>
        </div>
        <span className={`rounded-full px-4 py-1 text-lg font-bold ${tons[situacao].selo}`}>{tons[situacao].rotulo}</span>
      </header>

      {alertas.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {alertas.map((a, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-bold ${
                a.tom === 'grave' ? 'bg-vermelho/12' : 'bg-amarelo/30'
              }`}
            >
              <PiWarningFill aria-hidden="true" className={`size-6 shrink-0 ${a.tom === 'grave' ? 'text-vermelho' : ''}`} />
              {a.texto}
            </li>
          ))}
        </ul>
      )}

      {/* Caixa d'água */}
      <section aria-labelledby="titulo-caixa" className="cartao mt-6 p-5 md:p-6">
        <h2 id="titulo-caixa" className="text-3xl font-extrabold">
          Caixa d'água
        </h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-5">
              <CaixaDagua
                pct={c.caixa.nivelPct}
                corAgua={tomCaixa === 'grave' ? '#e0352f' : '#1f6fe0'}
                className="h-36 w-auto shrink-0"
              />
              <div>
                <p className="font-titulo text-6xl leading-none font-extrabold tabular-nums">{c.caixa.nivelPct}%</p>
                <p className="mt-1 text-lg">
                  {numero(litros(c))} de {numero(c.caixa.capacidadeL)} litros
                </p>
              </div>
            </div>

            <dl className="mt-4 divide-y-2 divide-nuvem">
              <Dado
                rotulo="Água para beber"
                valor={dias(c.caixa.diasParaBeber)}
                detalhe="Se o carro-pipa atrasar."
                Icone={PiDropFill}
                corIcone="text-azul"
              />
              <Dado
                rotulo="Bomba solar"
                valor={b.texto}
                detalhe={b.detalhe}
                Icone={iconeBomba[c.bomba.estado]}
                corIcone={c.bomba.estado === 'falha' ? 'text-vermelho' : ''}
              />
              <Dado rotulo="A horta usa agora" valor={c.bomba.fonteHorta === 'poco' ? 'Água do poço' : 'Água da caixa'} />
              <Dado
                rotulo={`Qualidade da água (teste de ${c.qualidade.ultimoTeste})`}
                valor={c.qualidade.boa ? 'Boa para beber' : 'Precisa de cuidado'}
                detalhe={c.qualidade.detalhe}
                Icone={c.qualidade.boa ? PiDropFill : PiDropSlashFill}
                corIcone={c.qualidade.boa ? 'text-verde' : 'text-vermelho'}
              />
            </dl>
          </div>

          <div>
            <h3 className="text-2xl font-bold">Nível nos últimos 7 dias</h3>
            <div className="mt-3">
              <GraficoNivel historico={c.caixa.historico} />
            </div>

            <h3 className="mt-6 text-2xl font-bold">O que aconteceu</h3>
            <ol className="mt-2 border-l-4 border-nuvem pl-4">
              {c.eventos.map((e, i) => (
                <li key={i} className="relative py-2">
                  <span aria-hidden="true" className="absolute top-4 -left-[26px] size-4 rounded-full border-4 border-white bg-azul" />
                  <span className="block text-base font-bold text-texto/75">{e.quando}</span>
                  <span className="text-lg">{e.texto}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Horta pelas câmeras */}
      <section aria-labelledby="titulo-cameras" className="mt-8">
        <h2 id="titulo-cameras" className="text-3xl font-extrabold">
          Horta pelas câmeras
        </h2>
        <p className="mt-1 text-lg text-texto/80">
          A IA olha a última foto de cada câmera e aponta o que pode estar errado. Imagens ilustrativas.
        </p>
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.cameras.map((cam, i) => (
            <Camera key={cam.id} cam={cam} numeroCam={i + 1} feito={feitos.includes(cam.id)} agir={() => agir(cam)} />
          ))}
        </ul>
      </section>
    </>
  )
}
