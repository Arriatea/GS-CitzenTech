import { useEffect, useState } from 'react'

export function useApi(buscar, intervaloMs = 0) {
  const [dados, setDados] = useState(null)

  useEffect(() => {
    let ativo = true
    const carregar = () =>
      buscar().then((novos) => {
        if (ativo) setDados(novos)
      })
    carregar()
    const relogio = intervaloMs ? setInterval(carregar, intervaloMs) : null
    return () => {
      ativo = false
      if (relogio) clearInterval(relogio)
    }
  }, [buscar, intervaloMs])

  return { dados, carregando: dados === null }
}
