import { PiSpeakerHighFill } from 'react-icons/pi'
import { useAudioDescricao } from '../lib/AudioDescricao.jsx'

/*
 * Cartão de informação que lê em voz alta quando é tocado.
 * O alto-falante pequeno no canto é sempre o mesmo sinal: "toque aqui para ouvir".
 */
export default function CartaoFalante({ fala, className = '', claro = false, children, ...resto }) {
  const { dizer } = useAudioDescricao()

  return (
    <button type="button" onClick={() => dizer(fala)} className={`relative block w-full text-left ${className}`} {...resto}>
      {children}
      <span
        aria-hidden="true"
        className={`absolute top-3 right-3 grid size-9 place-items-center rounded-full ${
          claro ? 'bg-white/25 text-white' : 'bg-nuvem text-texto/70'
        }`}
      >
        <PiSpeakerHighFill className="size-5" />
      </span>
    </button>
  )
}
