/*
 * Voz do app (audiodescrição), usando a síntese de fala do próprio navegador.
 * Se o aparelho não tiver voz, as funções simplesmente não fazem nada
 * e a tela continua funcionando.
 */

let vozPortugues = null

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

function escolherVoz() {
  try {
    const vozes = window.speechSynthesis.getVoices() || []
    const idioma = (v) => (v.lang || '').toLowerCase().replace('_', '-')
    vozPortugues =
      vozes.find((v) => idioma(v) === 'pt-br') ||
      vozes.find((v) => idioma(v).startsWith('pt')) ||
      null
  } catch {
    vozPortugues = null
  }
}

if (podeFalar()) {
  escolherVoz()
  try {
    window.speechSynthesis.addEventListener('voiceschanged', escolherVoz)
  } catch {
    /* navegador antigo: fica sem a troca de voz */
  }
}

/**
 * Fala um texto em português. Interrompe o que estiver sendo falado.
 * Devolve `true` se começou a falar.
 */
export function falar(texto, { aoTerminar } = {}) {
  const terminar = () => {
    try {
      aoTerminar?.()
    } catch {
      /* nada */
    }
  }

  if (!texto || !podeFalar()) {
    terminar()
    return false
  }

  try {
    window.speechSynthesis.cancel()
    const fala = new window.SpeechSynthesisUtterance(texto)
    fala.lang = 'pt-BR'
    fala.rate = 0.95
    if (!vozPortugues) escolherVoz()
    if (vozPortugues) fala.voice = vozPortugues
    fala.onend = terminar
    fala.onerror = terminar
    window.speechSynthesis.speak(fala)
    return true
  } catch {
    terminar()
    return false
  }
}

export function calar() {
  try {
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
