import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { calar, falar } from './voz.js'

/*
 * Audiodescrição do app inteiro.
 *
 * Cada tela chama useDescricao(texto) com o que tem nela e onde tocar.
 * Esse texto é lido sozinho quando a tela abre, e o botão "Ouvir a tela" repete.
 *
 * O navegador só libera a voz depois que a pessoa toca na tela ou aperta uma tecla.
 * Por isso a leitura automática só começa a partir do primeiro gesto.
 */

const Contexto = createContext(null)

export function AudioDescricaoProvider({ children }) {
  const [ligado, setLigado] = useState(true)
  const [falando, setFalando] = useState(false)

  const ligadoRef = useRef(true)
  const liberadoRef = useRef(false)
  const textoTela = useRef('')
  const idFala = useRef(0)

  const dizer = useCallback((texto) => {
    const id = ++idFala.current
    const comecou = falar(texto, {
      // Só a fala mais recente pode desligar o "falando".
      aoTerminar: () => {
        if (idFala.current === id) setFalando(false)
      },
    })
    setFalando(comecou)
  }, [])

  const parar = useCallback(() => {
    idFala.current++
    calar()
    setFalando(false)
  }, [])

  const ouvirTela = useCallback(() => dizer(textoTela.current), [dizer])

  const alternarLigado = useCallback(() => {
    const novo = !ligadoRef.current
    ligadoRef.current = novo
    setLigado(novo)
    if (novo) dizer('Leitura ligada. ' + textoTela.current)
    else parar()
  }, [dizer, parar])

  /* Chamado pelas telas. Não são para uso direto. */
  const registrarTela = useCallback((texto) => {
    textoTela.current = texto
  }, [])

  const lerTelaAutomatico = useCallback(() => {
    if (ligadoRef.current && liberadoRef.current) dizer(textoTela.current)
  }, [dizer])

  // Espera o primeiro gesto para liberar a voz.
  useEffect(() => {
    const eventos = ['pointerdown', 'pointerup', 'keydown']

    const liberar = () => {
      // No celular, o toque só libera a voz quando o dedo sai da tela.
      const ativo = navigator.userActivation ? navigator.userActivation.hasBeenActive : true
      if (!ativo || liberadoRef.current) return
      liberadoRef.current = true
      eventos.forEach((e) => window.removeEventListener(e, liberar, true))
      // O gesto pode ser num botão que já fala ou troca de tela;
      // espera o clique acontecer e só lê a tela se nada mais falou.
      const idAntes = idFala.current
      setTimeout(() => {
        if (idFala.current === idAntes) lerTelaAutomatico()
      }, 120)
    }

    eventos.forEach((e) => window.addEventListener(e, liberar, true))
    return () => eventos.forEach((e) => window.removeEventListener(e, liberar, true))
  }, [lerTelaAutomatico])

  // Ao fechar o app, para de falar.
  useEffect(() => () => calar(), [])

  const valor = useMemo(
    () => ({ ligado, falando, dizer, parar, ouvirTela, alternarLigado, registrarTela, lerTelaAutomatico }),
    [ligado, falando, dizer, parar, ouvirTela, alternarLigado, registrarTela, lerTelaAutomatico],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAudioDescricao() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useAudioDescricao precisa estar dentro de <AudioDescricaoProvider>')
  return ctx
}

/**
 * Registra o texto que descreve a tela.
 * - Lê em voz alta quando a tela abre ou quando `chave` muda.
 * - Se só o texto mudar (com a mesma chave), atualiza o que "Ouvir a tela" repete, sem reler.
 */
export function useDescricao(texto, chave = 'tela') {
  const { registrarTela, lerTelaAutomatico } = useAudioDescricao()

  // Primeiro guarda o texto novo...
  useEffect(() => {
    registrarTela(texto)
  }, [texto, registrarTela])

  // ...depois lê, se a tela acabou de abrir ou a chave mudou.
  useEffect(() => {
    lerTelaAutomatico()
  }, [chave, lerTelaAutomatico])
}
