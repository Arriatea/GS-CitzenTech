# GS-CitzensTech

## Gota a Gota

Plataforma para comunidades rurais do semiárido do Rio Grande do Norte que receberam um poço
(inspirada no projeto Leve Poços, Comunidade Angélica, Ipanguaçu/RN). O app cuida do "depois do poço":
mostra o estado da água, orienta a horta, ensina a plantar e a vender, mostra o preço mínimo de venda
e conecta as famílias aos compradores. A ONG que acompanha as comunidades vê a caixa d'água,
a bomba solar, a qualidade da água e a saúde da horta pelas câmeras.

Este repositório tem o **front-end**. Todos os dados ainda são **simulados**.

## Como rodar

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final em dist/
npm run preview  # serve a pasta dist/ (com o modo sem internet ligado)
```

Stack: React 19, Vite, Tailwind CSS v4 (tokens com `@theme static` em `src/index.css`) e ícones Phosphor (`react-icons/pi`).
Sem biblioteca de rotas: a navegação usa a âncora da URL (`#tela` ou `#tela/detalhe`).

## Telas da comunidade

| Âncora              | Tela        | O que tem                                                                                                    |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `#inicio`           | Início      | Caixa d'água desenhada com o nível, sol/bomba, uma tarefa do dia por vez e três botões grandes.              |
| `#horta`            | Minha horta | Foto da planta (resposta simulada) e canteiros, com o que precisa de cuidado primeiro e o aviso da câmera.   |
| `#aprender`         | Aprender    | Lista de aulas (as terminadas aparecem como "Feita"). `#aprender/pulgao` abre direto uma aula.               |
| `#vender`           | Vender      | Preço mínimo em formato de plaquinha de feira, a conta "quantos vai vender" e quem compra.                   |

## Área da ONG (`#parceiro`)

Para a ONG que acompanha as comunidades (público técnico, aqui pode ter números).

- **Uma ONG só.** O app atende uma única ONG: quem entra em `#parceiro` vê direto as comunidades dela.
  Não existe tela para escolher nem para trocar de ONG, e uma ONG não tem como ver os dados de outra.
  No sistema real, o login define a ONG e a API só devolve as comunidades dela.
- **Comunidades**: agrupadas por situação (precisam de visita, atenção, tudo certo). Cada comunidade é uma linha
  com os mesmos quatro indicadores, sempre na mesma ordem (caixa d'água, bomba solar, água, câmeras), cada um com
  cor e palavra, e embaixo o que é preciso resolver nela, em poucas palavras.
- **Comunidade** (`#parceiro/angelica`):
  - No alto, os mesmos quatro indicadores e um bloco **O que resolver**, com cada item levando à parte certa da página.
  - **Caixa d'água**: nível, litros, reserva para beber, bomba solar (ligada, parada por falta de sol ou falha),
    de onde a horta tira água agora, último teste da água, gráfico dos últimos 7 dias com a linha de alerta
    e o que aconteceu (carro-pipa, dias sem sol, testes).
  - **Horta pelas câmeras** (as com problema primeiro): a última foto de cada câmera, com o quadrado onde a IA viu o problema e a certeza dela.
    Ações: "Enviar orientação à família" (a família recebe a aula no app) e "Marcar visita técnica".

As regras de alerta ficam em `src/pages/parceiro/situacao.js` (caixa abaixo de 30% é urgente, bomba que não liga
com sol, água fora do padrão, câmera com alerta ou sem sinal).

### Fotos das câmeras

As fotos em `public/cameras/` são **fotos reais de exemplo**, tiradas do Wikimedia Commons com licença livre
(CC0, CC BY, CC BY-SA ou domínio público). Não foram tiradas nas comunidades. O crédito (autor, licença e link)
aparece embaixo de cada foto e está em `creditosFotos`, em `src/data/mock.js`. No sistema real, cada quadro
mostra a última foto enviada pela câmera da horta.

## Princípios de design

Quem usa o app da comunidade são donas de casa e trabalhadores rurais, muitos com pouca leitura e pouco
contato com tecnologia.

- **Uma coisa por tela.** Sem menu escondido, sem gráfico, sem porcentagem e sem termo técnico.
- **Figura antes de texto.** A caixa d'água é desenhada com o nível; as tarefas do dia aparecem em fila com as figuras.
- **Cor e palavra juntas.** Todo estado tem cor e texto ("Pode colher!", "Precisa de cuidado"), nunca só cor.
- **Tocar para ouvir.** Todo cartão de informação lê em voz alta quando é tocado; o alto-falante pequeno no
  canto é sempre o mesmo sinal.
- **Perdoar o erro.** A tarefa marcada sem querer volta tocando na figura dela na fila.
- **O app faz a conta.** Em Vender, o "−" e o "+" dizem quanto cobrar no total.
- **Lembrar.** Tarefas do dia e aulas feitas ficam guardadas no aparelho.
- **Sinal fraco.** Depois da primeira visita, o app abre sem internet (`public/sw.js`).
- **Audiodescrição em todo o app.** Cada tela tem um texto que diz o que tem nela e onde tocar
  (`useDescricao` em `src/lib/AudioDescricao.jsx`). Ele é lido sozinho quando a tela abre (depois do primeiro
  toque, que o navegador exige) e pode ser repetido no botão "Ouvir a tela". O botão redondo liga e desliga
  a leitura automática. Se o aparelho não tiver voz, tudo continua funcionando.
- Foco visível no teclado, `prefers-reduced-motion` respeitado e emojis decorativos escondidos dos leitores de tela.

## Estrutura

```
src/
  App.jsx                    navegação por âncora + AudioDescricaoProvider + BotaoAudio
  main.jsx, index.css        entrada, tokens visuais e registro do modo sem internet
  data/mock.js               TODOS os dados simulados
  lib/voz.js                 falar(), calar(), podeFalar() com speechSynthesis
  lib/AudioDescricao.jsx     contexto da audiodescrição e hook useDescricao
  lib/guardar.js             guardar no aparelho (localStorage) e vibrar
  components/                Topo, BotaoAudio, CaixaDagua, CartaoFalante
  pages/                     Inicio, Horta, Aprender, Vender, Parceiro
  pages/parceiro/            Comunidades, Comunidade, GraficoNivel, QuadroCamera, situacao.js
public/
  sw.js, manifest.webmanifest, icone.svg
  cameras/                   fotos de exemplo das câmeras (licença livre, ver créditos)
```

## Onde entra a API Java

Tudo o que o app mostra vem de `src/data/mock.js`. Para ligar na API, troque cada exportação por uma chamada
(por exemplo, um `fetch` dentro de um hook `useDados`) mantendo o mesmo formato dos objetos:

| Dado em `mock.js`                  | Origem na API                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `usuaria`, `comunidade`            | Cadastro da família e da comunidade                                           |
| `agua`                             | Sensor de nível da caixa, estado da bomba solar e previsão do tempo           |
| `tarefas`                          | Tarefas do dia geradas a partir da horta, da água e das vendas                |
| `canteiros`                        | Canteiros cadastrados e o diagnóstico das câmeras                             |
| `cursos`                           | Conteúdo das aulas                                                            |
| `precos`                           | Preço mínimo calculado com o custo da família e o preço local                 |
| `compradores`                      | Compradores ligados à comunidade                                              |
| `ong`                              | ONG do login (a API só devolve as comunidades dela)                           |
| `comunidadesOng`, `creditosFotos`  | Leituras da caixa, bomba e testes da água; fotos e diagnóstico das câmeras    |

Também são simulados: a análise da foto tirada pela família (`respostaFoto` em `src/pages/Horta.jsx`),
as fotos das câmeras (fotos de exemplo do Wikimedia Commons) e as ações da ONG (enviar orientação,
marcar visita), que hoje só mudam a tela.

## Licença

Veja [LICENSE](LICENSE).
