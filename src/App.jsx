import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioDescricaoProvider, useAudioDescricao } from './lib/AudioDescricao.jsx'
import BotaoAudio from './components/BotaoAudio.jsx'
import Inicio from './pages/Inicio.jsx'
import Horta from './pages/Horta.jsx'
import Aprender from './pages/Aprender.jsx'
import Vender from './pages/Vender.jsx'
import Parceiro from './pages/Parceiro.jsx'

/*
 * Navegação pela âncora da URL, sem biblioteca de rotas.
 * Formato: #tela ou #tela/detalhe (ex.: #aprender/pulgao, #parceiro/angelica).
 */
const telas = { inicio: Inicio, horta: Horta, aprender: Aprender, vender: Vender, parceiro: Parceiro }

function lerAncora() {
  const [tela = '', detalhe = null] = decodeURIComponent(window.location.hash.replace('#', '')).split('/')
  return tela in telas ? { tela, detalhe: detalhe || null } : { tela: 'inicio', detalhe: null }
}

function Navegacao() {
  const { parar } = useAudioDescricao()
  const [local, setLocal] = useState(lerAncora)
  const principal = useRef(null)
  const primeiraTela = useRef(true)

  const ir = useCallback(
    (destino, detalhe = null) => {
      const tela = destino in telas ? destino : 'inicio'
      parar()
      setLocal({ tela, detalhe })
      window.scrollTo(0, 0)
      window.history.replaceState(null, '', `#${tela}${detalhe ? `/${detalhe}` : ''}`)
    },
    [parar],
  )

  // Se a pessoa mudar a âncora (ou usar um link), segue junto.
  useEffect(() => {
    const aoMudar = () => {
      parar()
      setLocal(lerAncora())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [parar])

  // Leva o foco do teclado para a tela nova (menos na primeira abertura).
  useEffect(() => {
    if (primeiraTela.current) {
      primeiraTela.current = false
      return
    }
    principal.current?.focus({ preventScroll: true })
  }, [local])

  const Tela = telas[local.tela]

  return (
    <>
      <main ref={principal} tabIndex={-1} className="outline-none">
        <Tela key={`${local.tela}-${local.detalhe ?? ''}`} ir={ir} detalhe={local.detalhe} />
      </main>
      <BotaoAudio largo={local.tela === 'parceiro'} />
    </>
  )
}

export default function App() {
  return (
    <AudioDescricaoProvider>
      <Navegacao />
    </AudioDescricaoProvider>
  )
}
