/*
 * Guarda pequenas coisas no próprio aparelho (tarefas feitas hoje, aulas terminadas, ONG escolhida).
 * Se o navegador não deixar guardar, o app funciona do mesmo jeito, só não lembra.
 */

const prefixo = 'gota-a-gota:'

export function ler(chave, padrao) {
  try {
    const valor = window.localStorage.getItem(prefixo + chave)
    return valor === null ? padrao : JSON.parse(valor)
  } catch {
    return padrao
  }
}

export function gravar(chave, valor) {
  try {
    window.localStorage.setItem(prefixo + chave, JSON.stringify(valor))
  } catch {
    /* sem espaço ou bloqueado: segue sem guardar */
  }
}

/** Data de hoje no formato 2026-11-11, para coisas que valem só no dia. */
export function hoje() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Vibra um pouquinho para confirmar um toque (só em celulares que deixam). */
export function vibrar(ms = 30) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* nada */
  }
}
