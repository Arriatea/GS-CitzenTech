import { useId } from 'react'

/*
 * Desenho da caixa d'água de polietileno, com o nível pintado.
 * Para a família é figura (não é gráfico): a caixa cheia, pela metade ou com pouca água.
 * O texto ao lado sempre diz o mesmo em palavras.
 * No painel da ONG, `pct` (0 a 100) pinta o nível exato.
 */

const nivel = { cheia: 0.84, metade: 0.5, pouca: 0.2 }

// Corpo levemente afunilado, como as caixas azuis do sertão.
const corpo = 'M13 34 H87 L81 106 Q80 113 73 113 H27 Q20 113 19 106 Z'

export default function CaixaDagua({ caixa = 'cheia', pct, className = '', corAgua = '#1f6fe0' }) {
  const recorte = useId()
  const altura = typeof pct === 'number' ? Math.max(0, Math.min(100, pct)) / 100 : (nivel[caixa] ?? 0.5)
  const fundo = 113
  const topoAgua = fundo - (fundo - 36) * altura

  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={recorte}>
          <path d={corpo} />
        </clipPath>
      </defs>

      <path d={corpo} fill="#fff" />

      <g clipPath={`url(#${recorte})`}>
        <path d={`M0 ${topoAgua} q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V120 H0 Z`} fill={corAgua} />
        <path
          d={`M0 ${topoAgua + 7} q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0`}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      </g>

      {/* frisos da caixa */}
      <path d="M16 62 H84 M18 88 H82" stroke="#22264a" strokeOpacity="0.14" strokeWidth="2.5" />
      <path d={corpo} fill="none" stroke="#22264a" strokeWidth="3" strokeLinejoin="round" />

      {/* tampa */}
      <path d="M8 35 Q8 20 50 16 Q92 20 92 35 Z" fill="#fff" stroke="#22264a" strokeWidth="3" strokeLinejoin="round" />
      <rect x="42" y="9" width="16" height="8" rx="3" fill="#fff" stroke="#22264a" strokeWidth="3" />
    </svg>
  )
}
