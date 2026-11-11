import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioDescricaoProvider, useAudioDescricao } from './lib/AudioDescricao.jsx'
import BotaoAudio from './components/BotaoAudio.jsx'
import Inicio from './pages/Inicio.jsx'
import Horta from './pages/Horta.jsx'
import Aprender from './pages/Aprender.jsx'
import Vender from './pages/Vender.jsx'
import Parceiro from './pages/Parceiro.jsx'

/* Navegação pela âncora da URL (#inicio, #horta...), sem biblioteca de rotas. */
const telas = { inicio: Inicio, horta: Horta, aprender: Aprender, vender: Vender, parceiro: Parceiro }

function lerAncora() {
  const ancora = window.location.hash.replace('#', '')
  return ancora in telas ? ancora : 'inicio'
}

function Navegacao() {
  const { parar } = useAudioDescricao()
  const [tela, setTela] = useState(lerAncora)
  const [aulaId, setAulaId] = useState(null)
  const principal = useRef(null)
  const primeiraTela = useRef(true)

  const ir = useCallback(
    (destino, aula = null) => {
      parar()
      setTela(destino in telas ? destino : 'inicio')
      setAulaId(aula)
      window.scrollTo(0, 0)
      window.history.replaceState(null, '', `#${destino}`)
    },
    [parar],
  )

  // Se a pessoa mudar a âncora (ou usar um link), segue junto.
  useEffect(() => {
    const aoMudar = () => {
      parar()
      setTela(lerAncora())
      setAulaId(null)
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
  }, [tela, aulaId])

  const Tela = telas[tela]

  return (
    <>
      <main ref={principal} tabIndex={-1} className="outline-none">
        <Tela key={`${tela}-${aulaId ?? ''}`} ir={ir} aulaInicial={aulaId} />
      </main>
      <BotaoAudio largo={tela === 'parceiro'} />
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
