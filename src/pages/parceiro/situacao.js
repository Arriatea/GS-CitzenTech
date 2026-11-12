import { nivelAlertaPct } from '../../data/mock.js'

const minuscula = (t) => t.charAt(0).toLowerCase() + t.slice(1)

/*
 * Regras que transformam as leituras da comunidade em situação e alertas para a ONG.
 * No sistema real, isso pode vir pronto da API; aqui fica no front para o protótipo.
 */

export const bomba = {
  ligada: { texto: 'Ligada', detalhe: 'Tem sol: bombeando do poço e enchendo a caixa.', tom: 'ok' },
  'sem-sol': { texto: 'Parada: sem sol', detalhe: 'Normal em dia nublado. A horta usa a água da caixa.', tom: 'neutro' },
  falha: { texto: 'Falha', detalhe: 'Tem sol, mas a bomba não está bombeando.', tom: 'grave' },
}

export const camera = {
  saudavel: { texto: 'Saudável', tom: 'ok' },
  alerta: { texto: 'Alerta', tom: 'atencao' },
  'sem-sinal': { texto: 'Sem sinal', tom: 'atencao' },
}

/* Cada tom tem cor e palavra. Nunca só cor. */
export const tons = {
  grave: { rotulo: 'Precisa de visita', selo: 'bg-vermelho text-white', borda: 'border-vermelho', texto: 'text-vermelho' },
  atencao: { rotulo: 'Atenção', selo: 'bg-amarelo text-texto', borda: 'border-amarelo', texto: 'text-texto' },
  ok: { rotulo: 'Tudo certo', selo: 'bg-verde text-white', borda: 'border-nuvem', texto: 'text-verde' },
  neutro: { rotulo: 'Normal', selo: 'bg-nuvem text-texto', borda: 'border-nuvem', texto: 'text-texto' },
}

export const litros = (c) => Math.round((c.caixa.capacidadeL * c.caixa.nivelPct) / 100)
export const numero = (n) => n.toLocaleString('pt-BR')
export const dias = (n) => (n === 1 ? '1 dia' : `${n} dias`)

export function tomDaCaixa(nivelPct) {
  if (nivelPct < nivelAlertaPct) return 'grave'
  if (nivelPct < nivelAlertaPct + 10) return 'atencao'
  return 'ok'
}

/** Lista de alertas de uma comunidade, do mais grave para o mais leve. */
export function alertasDa(c) {
  const lista = []
  const tomCaixa = tomDaCaixa(c.caixa.nivelPct)

  if (tomCaixa === 'grave')
    lista.push({
      tom: 'grave',
      tipo: 'caixa',
      texto: `Caixa com ${c.caixa.nivelPct}%: água para beber por ${dias(c.caixa.diasParaBeber)}.`,
    })
  else if (tomCaixa === 'atencao')
    lista.push({ tom: 'atencao', tipo: 'caixa', texto: `Caixa baixando: ${c.caixa.nivelPct}%.` })

  if (c.bomba.estado === 'falha') lista.push({ tom: 'grave', tipo: 'bomba', texto: 'Bomba solar não liga, mesmo com sol.' })

  if (!c.qualidade.boa) lista.push({ tom: 'grave', tipo: 'agua', texto: `Teste da água: ${minuscula(c.qualidade.detalhe)}` })

  c.cameras.forEach((cam) => {
    if (cam.estado === 'alerta') lista.push({ tom: 'atencao', tipo: 'camera', texto: `${cam.canteiro}: ${minuscula(cam.diagnostico)}` })
    if (cam.estado === 'sem-sinal') lista.push({ tom: 'atencao', tipo: 'camera', texto: `Câmera sem sinal: ${cam.canteiro}.` })
  })

  const peso = { grave: 0, atencao: 1 }
  return lista.sort((a, b) => peso[a.tom] - peso[b.tom])
}

/** Situação geral: o pior tom entre os alertas. */
export function situacaoDa(c) {
  const alertas = alertasDa(c)
  if (alertas.some((a) => a.tom === 'grave')) return 'grave'
  if (alertas.length) return 'atencao'
  return 'ok'
}
