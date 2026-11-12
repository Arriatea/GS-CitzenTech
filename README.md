# GS-CitzensTech

## Gota a Gota

Plataforma para comunidades rurais do semiárido do Rio Grande do Norte que receberam um poço
(inspirada no projeto Leve Poços, Comunidade Angélica, Ipanguaçu/RN). O app cuida do "depois do poço":
mostra o estado da água, orienta a horta, ensina a plantar e a vender, mostra o preço mínimo de venda
e conecta as famílias aos compradores.

Este repositório tem o **front-end**. Todos os dados ainda são **simulados**.

## Como rodar

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final em dist/
npm run preview  # serve a pasta dist/
```

Stack: React 19, Vite, Tailwind CSS v4 (tokens com `@theme static` em `src/index.css`) e ícones Phosphor (`react-icons/pi`).
Sem biblioteca de rotas: a navegação usa a âncora da URL.

## Telas

| Âncora       | Tela                       | O que tem                                                                                                  |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `#inicio`    | Início                     | Estado da água, uma tarefa do dia por vez e três botões grandes: Minha horta, Aprender e Vender.           |
| `#horta`     | Minha horta                | Foto da planta (resposta simulada) e os canteiros de venda e da comunidade, com o estado de cada um.       |
| `#aprender`  | Aprender                   | Lista de aulas. Cada aula mostra um passo por tela. Pode abrir direto numa aula (vinda de "Como cuidar").  |
| `#vender`    | Vender                     | Preço mínimo de cada verdura e quem compra.                                                                |
| `#parceiro`  | Painel da iniciativa parceira | Para o público técnico: números de impacto, gráfico de colheita, próximas comunidades e tabela.          |

## Princípios de design

Quem usa o app são donas de casa e trabalhadores rurais, muitos com pouca leitura e pouco contato com tecnologia.

- **Uma coisa por tela.** Sem menu escondido, sem gráfico, sem porcentagem e sem termo técnico nas telas da comunidade.
- **Grande e com figura.** Botões com no mínimo 64px de altura, emoji como figura do produto, frases curtas.
- **Cor e palavra juntas.** Todo estado tem cor e texto ("Pode colher!", "Precisa de cuidado"), nunca só cor.
- **Cada parte tem sua cor**, como as barracas de uma feira: Horta laranja, Aprender azul, Vender amarelo,
  água boa verde, cuidado vermelho. As bandeirolas do Início juntam todas.
- **Botões que parecem botões.** A classe `.apertar` dá uma sombra sólida embaixo e faz o botão descer ao toque.
- **Audiodescrição em todo o app.** Cada tela tem um texto que diz o que tem nela e onde tocar
  (`useDescricao` em `src/lib/AudioDescricao.jsx`). Ele é lido sozinho quando a tela abre (depois do primeiro
  toque, que o navegador exige) e pode ser repetido no botão "Ouvir a tela". O botão redondo liga e desliga
  a leitura automática. Se o aparelho não tiver voz, tudo continua funcionando.
- Foco visível no teclado, `prefers-reduced-motion` respeitado e emojis decorativos escondidos dos leitores de tela.

## Estrutura

```
src/
  App.jsx                  navegação por âncora + AudioDescricaoProvider + BotaoAudio
  main.jsx, index.css      entrada e tokens visuais
  data/mock.js             TODOS os dados simulados
  lib/voz.js               falar(), calar(), podeFalar() com speechSynthesis
  lib/AudioDescricao.jsx   contexto da audiodescrição e hook useDescricao
  components/Topo.jsx      faixa colorida do alto de cada tela
  components/BotaoAudio.jsx  "Ouvir a tela" e liga/desliga da leitura
  pages/                   Inicio, Horta, Aprender, Vender, Parceiro
```

## Onde entra a API Java

Tudo o que o app mostra vem de `src/data/mock.js`. Para ligar na API, troque cada exportação por uma chamada
(por exemplo, um `fetch` dentro de um hook `useDados`) mantendo o mesmo formato dos objetos:

| Dado em `mock.js`                                      | Origem na API                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `usuaria`, `comunidade`                                | Cadastro da família e da comunidade                                  |
| `agua`                                                 | Leituras da caixa e da bomba solar + previsão do tempo               |
| `tarefas`                                              | Tarefas do dia geradas a partir da horta, da água e das vendas       |
| `canteiros`                                            | Canteiros cadastrados e seu estado                                   |
| `cursos`                                               | Conteúdo das aulas                                                   |
| `precos`                                               | Preço mínimo calculado com o custo da família e o preço local        |
| `compradores`                                          | Compradores ligados à comunidade                                     |
| `impacto`, `comunidadesParceiras`, `proximasComunidades` | Indicadores agregados para o painel da iniciativa parceira         |

A análise da foto da planta (`src/pages/Horta.jsx`, constante `respostaFoto`) também é simulada:
no app de verdade, a foto vai para o serviço de IA e a resposta substitui o exemplo.

## Licença

Veja [LICENSE](LICENSE).
