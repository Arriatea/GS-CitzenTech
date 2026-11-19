/*
 * Voz do app (audiodescrição), usando a síntese de fala do próprio navegador.
 * Se o aparelho não tiver voz, as funções simplesmente não fazem nada
 * e a tela continua funcionando.
 *
 * O navegador costuma ter várias vozes em português, e a primeira da lista
 * nem sempre é a melhor (no Windows é a "Daniel", bem robótica). Por isso
 * a voz é escolhida por nota: as vozes naturais do Edge, as do Google
 * (Chrome e Android) e as vozes melhoradas do iPhone vêm primeiro.
 */

// Vozes da internet que falharam (por exemplo, sem sinal). Voltam a valer quando a internet volta.
const vozesQueFalharam = new Set()

// A leitura que está tocando agora. Uma leitura nova ou o "calar" encerram a anterior.
let leituraAtual = null

export function podeFalar() {
  try {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance === 'function'
    )
  } catch {
    return false
  }
}

const idioma = (v) => (v.lang || '').toLowerCase().replace('_', '-')

function nota(v) {
  const nome = (v.name || '').toLowerCase()
  let n = 0
  // Sotaque do Brasil vale mais que uma voz bonita de Portugal.
  if (idioma(v) === 'pt-br') n += 100
  else if (idioma(v).startsWith('pt')) n += 50
  else return -1
  if (/natural|neural/.test(nome)) n += 40 // Edge: Francisca, Thalita, Antonio
  if (/premium|enhanced|aprimorad|melhorad/.test(nome)) n += 35 // iPhone e Mac, voz baixada
  if (/google/.test(nome)) n += 30 // Chrome e Android
  if (/francisca|luciana|maria/.test(nome)) n += 3 // mesma voz de mulher em todo aparelho
  if (/espeak/.test(nome)) n -= 30
  return n
}

function melhorVoz() {
  try {
    const semInternet = typeof navigator !== 'undefined' && navigator.onLine === false
    let melhor = null
    let notaMelhor = -1
    for (const v of window.speechSynthesis.getVoices() || []) {
      if (vozesQueFalharam.has(v.voiceURI || v.name)) continue
      if (semInternet && v.localService === false) continue
      const n = nota(v)
      if (n > notaMelhor) {
        melhor = v
        notaMelhor = n
      }
    }
    return melhor
  } catch {
    return null
  }
}

/*
 * Divide o texto em frases. Falar frase por frase deixa as pausas mais naturais
 * e evita um defeito do Chrome, que corta a voz do Google depois de uns 15 segundos.
 */
function frases(texto) {
  return String(texto)
    .replace(/\s+/g, ' ')
    .replace(/([.!?…])\s+/g, '$1\n')
    .split('\n')
    .flatMap((frase) => (frase.length > 200 ? cortarNasVirgulas(frase) : [frase]))
    .map((frase) => frase.trim())
    .filter(Boolean)
}

// Frase longa demais: corta nas vírgulas, em pedaços de até umas 160 letras.
function cortarNasVirgulas(frase) {
  const pedacos = []
  let atual = ''
  for (const parte of frase.replace(/([,;])\s+/g, '$1\n').split('\n')) {
    if (atual && atual.length + parte.length > 160) {
      pedacos.push(atual)
      atual = parte
    } else {
      atual = atual ? `${atual} ${parte}` : parte
    }
  }
  if (atual) pedacos.push(atual)
  return pedacos
}

if (podeFalar()) {
  try {
    // O Chrome só carrega as vozes depois do primeiro pedido.
    window.speechSynthesis.getVoices()
    window.addEventListener('online', () => vozesQueFalharam.clear())
  } catch {
    /* navegador antigo: fica com a voz padrão */
  }
}

function encerrarLeitura() {
  const leitura = leituraAtual
  leituraAtual = null
  leitura?.terminar()
}

function lerFrases(lista, terminar) {
  const voz = melhorVoz()
  const leitura = { terminar, falas: [] }
  leituraAtual = leitura

  leitura.falas = lista.map((trecho, i) => {
    const fala = new window.SpeechSynthesisUtterance(trecho)
    fala.lang = voz?.lang || 'pt-BR'
    fala.rate = 0.95
    if (voz) fala.voice = voz
    fala.onend = () => {
      if (leituraAtual === leitura && i === lista.length - 1) encerrarLeitura()
    }
    fala.onerror = (evento) => {
      if (leituraAtual !== leitura) return
      const interrompida = evento?.error === 'interrupted' || evento?.error === 'canceled'
      // A voz da internet falhou: continua desta frase com outra voz.
      if (voz && voz.localService === false && !interrompida) {
        vozesQueFalharam.add(voz.voiceURI || voz.name)
        leituraAtual = null
        window.speechSynthesis.cancel()
        lerFrases(lista.slice(i), terminar)
        return
      }
      encerrarLeitura()
      window.speechSynthesis.cancel()
    }
    return fala
  })

  // As falas ficam guardadas em `leitura` para o Safari não perder o aviso de fim.
  leitura.falas.forEach((fala) => window.speechSynthesis.speak(fala))
}

/**
 * Fala um texto em português. Interrompe o que estiver sendo falado.
 * Devolve `true` se começou a falar.
 */
export function falar(texto, { aoTerminar } = {}) {
  let terminou = false
  const terminar = () => {
    if (terminou) return
    terminou = true
    try {
      aoTerminar?.()
    } catch {
      /* nada */
    }
  }

  const lista = texto ? frases(texto) : []
  if (!lista.length || !podeFalar()) {
    terminar()
    return false
  }

  try {
    encerrarLeitura()
    window.speechSynthesis.cancel()
    lerFrases(lista, terminar)
    return true
  } catch {
    leituraAtual = null
    terminar()
    return false
  }
}

export function calar() {
  try {
    encerrarLeitura()
    if (podeFalar()) window.speechSynthesis.cancel()
  } catch {
    /* nada */
  }
}

/** "R$ 2,80" fica difícil de ler em voz alta; aqui vira "2 reais e 80 centavos". */
export function precoFalado(valor) {
  const reais = Math.floor(valor)
  const centavos = Math.round((valor - reais) * 100)
  const parteReais = reais === 1 ? '1 real' : `${reais} reais`
  if (!centavos) return parteReais
  return `${parteReais} e ${centavos} centavos`
}
