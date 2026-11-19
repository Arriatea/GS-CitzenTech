import { PiArrowLeftBold, PiHouseFill } from 'react-icons/pi'

/* Faixa colorida do alto de cada tela. A cor diz em que parte do app a pessoa está. */
export const coresSecao = {
  laranja: 'bg-laranja text-white',
  azul: 'bg-azul text-white',
  amarelo: 'bg-amarelo text-texto',
  verde: 'bg-verde text-white',
  vermelho: 'bg-vermelho text-white',
}

export default function Topo({ cor = 'laranja', figura, titulo, aoVoltar, rotuloVoltar = 'Início', estreito = false }) {
  const ehInicio = rotuloVoltar === 'Início'
  const Icone = ehInicio ? PiHouseFill : PiArrowLeftBold

  return (
    <header className={`${coresSecao[cor]} rounded-b-[32px] pt-4 pb-7`}>
      <div className={estreito ? 'grade grade-estreita' : 'grade'}>
        <button
          type="button"
          onClick={aoVoltar}
          className="apertar flex min-h-16 items-center gap-2 bg-white px-5 text-xl font-extrabold text-texto"
        >
          <Icone aria-hidden="true" className="size-7" />
          {rotuloVoltar}
        </button>

        <h1 className="mt-6 flex items-center gap-3 text-5xl font-extrabold">
          {figura && (
            <span aria-hidden="true" className="text-6xl leading-none">
              {figura}
            </span>
          )}
          <span>{titulo}</span>
        </h1>
      </div>
    </header>
  )
}
