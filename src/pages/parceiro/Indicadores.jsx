import { nivelAlertaPct } from '../../data/mock.js'
import { indicadoresDa } from './situacao.js'

/* Ponto de cor do tom. Sempre acompanha uma palavra. */
const corPonto = {
  ok: 'bg-verde',
  atencao: 'bg-amarelo ring-2 ring-texto/25',
  grave: 'bg-vermelho',
  neutro: 'bg-white ring-2 ring-texto/35',
}

const corBarra = { ok: 'bg-azul', atencao: 'bg-amarelo', grave: 'bg-vermelho', neutro: 'bg-azul' }

export function Ponto({ tom, className = '' }) {
  return <span aria-hidden="true" className={`inline-block size-3 shrink-0 rounded-full ${corPonto[tom]} ${className}`} />
}

/* Barra fina do nível da caixa, com a marca do nível de alerta. */
function BarraNivel({ nivel, tom }) {
  return (
    <span aria-hidden="true" className="relative mt-1.5 block h-2 w-full max-w-36 rounded-full bg-nuvem">
      <span className={`absolute inset-y-0 left-0 rounded-full ${corBarra[tom]}`} style={{ width: `${nivel}%` }} />
      <span className="absolute -inset-y-0.5 w-0.5 bg-vermelho" style={{ left: `${nivelAlertaPct}%` }} />
    </span>
  )
}

/*
 * Os quatro indicadores (caixa, bomba, água, câmeras) sempre na mesma ordem.
 * Usa só <span> para poder ficar dentro de um botão.
 */
export default function Indicadores({ c, grande = false }) {
  return (
    <span className={`grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 ${grande ? 'sm:gap-x-6' : ''}`}>
      {indicadoresDa(c).map((ind) => (
        <span key={ind.id} className="block min-w-0">
          <span className="block text-sm text-texto/70">{ind.rotulo}</span>
          <span className={`flex items-center gap-2 font-bold ${grande ? 'text-xl sm:text-2xl' : 'text-lg'} leading-tight`}>
            <Ponto tom={ind.tom} />
            {ind.valor}
          </span>
          {ind.nivel !== undefined && <BarraNivel nivel={ind.nivel} tom={ind.tom} />}
          <span className="mt-1 block text-sm text-texto/75">{ind.detalhe}</span>
        </span>
      ))}
    </span>
  )
}
