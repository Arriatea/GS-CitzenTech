import { diasHistorico, nivelAlertaPct } from '../../data/mock.js'

/* Nível da caixa nos últimos 7 dias, em SVG feito à mão. A linha tracejada é o nível de alerta. */
export default function GraficoNivel({ historico }) {
  const largura = 520
  const altura = 260
  const m = { topo: 34, direita: 26, baixo: 40, esquerda: 64 }
  const areaL = largura - m.esquerda - m.direita
  const areaA = altura - m.topo - m.baixo
  const x = (i) => m.esquerda + (areaL * i) / (historico.length - 1)
  const y = (v) => m.topo + areaA - (v / 100) * areaA

  const linha = historico.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')
  const area = `${linha} L${x(historico.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`
  const ultimo = historico.length - 1

  const resumo = `Nível da caixa nos últimos 7 dias, em porcentagem: ${historico
    .map((v, i) => `${diasHistorico[i]} ${v}`)
    .join(', ')}. Alerta abaixo de ${nivelAlertaPct}.`

  return (
    <svg viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label={resumo} className="block h-auto w-full">
      {[0, 50, 100].map((t) => (
        <g key={t}>
          <line x1={m.esquerda} x2={largura - m.direita} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#22264a' : '#eef1f7'} strokeWidth="2" />
          <text x={m.esquerda - 10} y={y(t)} dy="0.35em" textAnchor="end" fontSize="20" fill="#22264a" opacity="0.7">
            {t}%
          </text>
        </g>
      ))}

      {/* Nível de alerta */}
      <line
        x1={m.esquerda}
        x2={largura - m.direita}
        y1={y(nivelAlertaPct)}
        y2={y(nivelAlertaPct)}
        stroke="#e0352f"
        strokeWidth="2"
        strokeDasharray="8 6"
      />
      <text x={m.esquerda + 8} y={y(nivelAlertaPct) + 22} textAnchor="start" fontSize="19" fontWeight="700" fill="#c0281f">
        alerta: {nivelAlertaPct}%
      </text>

      <path d={area} fill="#1f6fe0" opacity="0.14" />
      <path d={linha} fill="none" stroke="#1f6fe0" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

      {historico.map((v, i) => (
        <g key={i}>
          <circle
            cx={x(i)}
            cy={y(v)}
            r={i === ultimo ? 8 : 5}
            fill={v < nivelAlertaPct ? '#e0352f' : '#1f6fe0'}
            stroke="#fff"
            strokeWidth="2.5"
          />
          <text x={x(i)} y={altura - 10} textAnchor="middle" fontSize="20" fontWeight={i === ultimo ? 800 : 600} fill="#22264a">
            {diasHistorico[i]}
          </text>
        </g>
      ))}

      <text x={x(ultimo)} y={y(historico[ultimo]) - 16} textAnchor="end" fontSize="23" fontWeight="800" fill="#22264a">
        {historico[ultimo]}%
      </text>
    </svg>
  )
}
