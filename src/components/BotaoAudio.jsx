import { PiSpeakerHighFill, PiSpeakerSlashFill } from 'react-icons/pi'
import { useAudioDescricao } from '../lib/AudioDescricao.jsx'

/* Fica sempre no canto de baixo, em todas as telas. */
export default function BotaoAudio({ largo = false }) {
  const { ligado, falando, ouvirTela, parar, alternarLigado } = useAudioDescricao()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-6 md:pb-6">
      <div className={`mx-auto flex items-end justify-end gap-3 md:max-w-none ${largo ? 'max-w-5xl' : 'max-w-[480px]'}`}>
        <button
          type="button"
          onClick={alternarLigado}
          aria-pressed={ligado}
          aria-label={ligado ? 'Leitura automática ligada. Toque para desligar.' : 'Leitura automática desligada. Toque para ligar.'}
          title={ligado ? 'Desligar leitura automática' : 'Ligar leitura automática'}
          className={`apertar pointer-events-auto grid size-16 place-items-center rounded-full! border-4 border-texto ${
            ligado ? 'bg-white text-texto' : 'bg-nuvem text-texto/60'
          }`}
        >
          {ligado ? <PiSpeakerHighFill aria-hidden="true" className="size-8" /> : <PiSpeakerSlashFill aria-hidden="true" className="size-8" />}
        </button>

        <button
          type="button"
          onClick={falando ? parar : ouvirTela}
          className="apertar pointer-events-auto flex min-h-16 items-center gap-2 bg-texto px-6 text-xl font-extrabold text-white"
        >
          <span aria-hidden="true">{falando ? '⏹' : '🔊'}</span>
          {falando ? 'Parar' : 'Ouvir a tela'}
        </button>
      </div>
    </div>
  )
}
