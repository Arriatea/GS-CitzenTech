import * as mock from '../data/mock.js'

const URL_API = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TEMPO_LIMITE_MS = 4000

const avisados = new Set()

async function buscar(caminho, reserva) {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS)
  try {
    const resposta = await fetch(`${URL_API}${caminho}`, { signal: controle.signal })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
    avisados.delete(caminho)
    return await resposta.json()
  } catch (erro) {
    if (!avisados.has(caminho)) {
      avisados.add(caminho)
      console.warn(`API indisponível em ${caminho} (${erro.message}). Usando dados simulados.`)
    }
    return reserva
  } finally {
    clearTimeout(relogio)
  }
}

export const buscarAgua = () => buscar('/agua', mock.agua)
export const buscarTarefas = () => buscar('/tarefas', mock.tarefas)
export const buscarCanteiros = () => buscar('/canteiros', mock.canteiros)
export const buscarCursos = () => buscar('/cursos', mock.cursos)
export const buscarPrecos = () => buscar('/precos', mock.precos)
export const buscarCompradores = () => buscar('/compradores', mock.compradores)
export const buscarImpacto = () => buscar('/impacto', null)
export const buscarComunidades = () => buscar('/comunidades', mock.comunidadesOng)

const TEMPO_LIMITE_CONVERSA_MS = 30000
export const RESPOSTA_DE_ERRO = 'Não consegui responder agora, tente de novo.'

export async function conversar(sessao, mensagem) {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_CONVERSA_MS)
  try {
    const resposta = await fetch(`${URL_API}/conversar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessao, mensagem }),
      signal: controle.signal,
    })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
    const { resposta: texto } = await resposta.json()
    return texto || RESPOSTA_DE_ERRO
  } catch (erro) {
    console.warn(`Gotinha indisponível (${erro.message}).`)
    return RESPOSTA_DE_ERRO
  } finally {
    clearTimeout(relogio)
  }
}
