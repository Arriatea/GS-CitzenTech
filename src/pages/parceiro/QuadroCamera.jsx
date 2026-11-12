import { PiVideoCameraSlashFill } from 'react-icons/pi'

/*
 * Quadro da câmera da horta. A imagem é ILUSTRATIVA: canteiros desenhados com a figura da planta.
 * No sistema real, aqui entra a última foto da câmera, e `marca` vem da IA (onde ela viu o problema).
 */
export default function QuadroCamera({ cam, numero }) {
  if (cam.estado === 'sem-sinal') {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-texto text-white">
        <div className="text-center">
          <PiVideoCameraSlashFill aria-hidden="true" className="mx-auto size-12 opacity-80" />
          <p className="mt-2 text-lg font-bold">Sem sinal</p>
          <p className="text-base opacity-80">Última foto {cam.foto}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-2xl"
      style={{
        // Terra com fileiras de canteiro, vista de cima.
        background:
          'repeating-linear-gradient(90deg, #7a5236 0 18%, #8d6141 18% 33.3%), linear-gradient(#7a5236, #6b4630)',
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 place-items-center p-3 text-5xl">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ transform: `rotate(${(i % 3) * 14 - 14}deg)` }}>
            {cam.figura}
          </span>
        ))}
      </div>

      {cam.marca && (
        <div
          aria-hidden="true"
          className="absolute rounded-lg border-4 border-amarelo shadow-[0_0_0_2px_rgb(0_0_0/0.35)]"
          style={{ left: `${cam.marca.x}%`, top: `${cam.marca.y}%`, width: `${cam.marca.l}%`, height: `${cam.marca.a}%` }}
        >
          <span className="absolute -top-8 left-0 rounded-md bg-amarelo px-2 py-0.5 text-sm font-extrabold whitespace-nowrap text-texto">
            IA: {cam.confianca}% de certeza
          </span>
        </div>
      )}

      <span className="absolute top-2 left-2 rounded-md bg-texto/80 px-2 py-0.5 text-sm font-bold text-white">
        Câmera {numero}
      </span>
      <span className="absolute right-2 bottom-2 rounded-md bg-texto/80 px-2 py-0.5 text-sm font-bold text-white">
        {cam.foto}
      </span>
    </div>
  )
}
