import { PiVideoCameraSlashFill } from 'react-icons/pi'
import { creditosFotos } from '../../data/mock.js'

/*
 * Quadro da câmera da horta: a última foto e, se a IA viu um problema, o quadrado onde ela viu.
 * As fotos de exemplo são reais (Wikimedia Commons, licença livre) e ficam em public/cameras/.
 * No sistema real, a imagem e a `marca` vêm da API.
 */
export default function QuadroCamera({ cam, numero }) {
  if (cam.estado === 'sem-sinal' || !cam.imagem) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-texto text-white">
        <div className="text-center">
          <PiVideoCameraSlashFill aria-hidden="true" className="mx-auto size-12 opacity-80" />
          <p className="mt-2 text-lg font-bold">Sem sinal</p>
          <p className="text-base opacity-80">Última foto {cam.ultimaFoto}</p>
        </div>
      </div>
    )
  }

  const credito = creditosFotos[cam.imagem]
  // O rótulo da IA vai embaixo do quadrado se ele estiver colado no alto, e à direita se estiver do lado direito.
  const marcaEmCima = cam.marca && cam.marca.y < 18
  const marcaADireita = cam.marca && cam.marca.x > 45

  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-nuvem">
        <img
          src={`${import.meta.env.BASE_URL}cameras/${cam.imagem}.jpg`}
          alt={`Foto da câmera ${numero}: ${cam.canteiro}. ${cam.diagnostico}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />

        {cam.marca && (
          <div
            aria-hidden="true"
            className="absolute rounded-lg border-4 border-amarelo shadow-[0_0_0_2px_rgb(0_0_0/0.45)]"
            style={{ left: `${cam.marca.x}%`, top: `${cam.marca.y}%`, width: `${cam.marca.l}%`, height: `${cam.marca.a}%` }}
          >
            <span
              className={`absolute ${marcaADireita ? 'right-0' : 'left-0'} rounded-md bg-amarelo px-2 py-0.5 text-sm font-extrabold whitespace-nowrap text-texto ${
                marcaEmCima ? '-bottom-8' : '-top-8'
              }`}
            >
              IA: {cam.confianca}% de certeza
            </span>
          </div>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-texto/80 px-2 py-0.5 text-sm font-bold text-white">
          Câmera {numero}
        </span>
        <span className="absolute right-2 bottom-2 rounded-md bg-texto/80 px-2 py-0.5 text-sm font-bold text-white">
          {cam.ultimaFoto}
        </span>
      </div>

      {credito && (
        <figcaption className="mt-1.5 px-1 text-xs text-texto/65">
          Foto de exemplo:{' '}
          <a href={credito.pagina} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {credito.autor}
          </a>
          , {credito.licenca}
        </figcaption>
      )}
    </figure>
  )
}
