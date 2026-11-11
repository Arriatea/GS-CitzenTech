/*
 * DADOS SIMULADOS.
 *
 * Tudo o que o app mostra vem deste arquivo, para ser trocado depois pela API Java.
 * Nenhum número aqui foi medido de verdade. Comunidades marcadas "(exemplo)" são fictícias.
 */

export const usuaria = {
  nome: 'Dona Socorro',
}

export const comunidade = {
  nome: 'Comunidade Angélica',
  municipio: 'Ipanguaçu (RN)',
}

/*
 * Estado da água.
 *
 * Regra do sistema real: a bomba do poço é só solar.
 * - Com sol, a bomba irriga a horta direto do poço e enche a caixa (fonte: 'poco').
 * - Sem sol, não há energia: a horta usa a água guardada na caixa (fonte: 'caixa').
 * A água da caixa também pode ser bebida e cobre a falta do carro-pipa.
 * `diasParaBeber` é quantos dias a caixa dura só para beber, se o carro-pipa atrasar.
 */
export const agua = {
  boa: true,
  caixa: 'cheia', // 'cheia' | 'metade' | 'pouca'
  diasParaBeber: 4,
  fonte: 'poco', // 'poco' | 'caixa'
  amanha: 'Vai chover amanhã. Não precisa molhar a horta.',
}

/* Tarefas do dia. A tela inicial mostra uma por vez. */
export const tarefas = [
  {
    id: 'colher-alface',
    figura: '🥬',
    texto: 'Colher a alface.',
    dica: 'O mercadinho vai buscar na sexta.',
  },
  {
    id: 'bichinhos-tomate',
    figura: '🍅',
    texto: 'Tirar os bichinhos do tomate.',
    dica: 'Eles ficam embaixo das folhas.',
    aula: 'pulgao',
  },
  {
    id: 'nao-molhar',
    figura: '🌧️',
    texto: 'Amanhã não precisa molhar.',
    dica: 'Vai chover.',
  },
]

/*
 * Canteiros da horta.
 * destino: 'venda' (horta de venda) | 'comunidade' (horta da comunidade, para dar)
 * estado: 'colher' | 'crescendo' | 'cuidado'
 */
export const canteiros = [
  { id: 'alface', figura: '🥬', nome: 'Alface', destino: 'venda', estado: 'colher' },
  { id: 'tomate', figura: '🍅', nome: 'Tomate', destino: 'venda', estado: 'cuidado', aula: 'pulgao' },
  { id: 'cebolinha', figura: '🌿', nome: 'Cebolinha', destino: 'venda', estado: 'crescendo' },
  { id: 'melancia', figura: '🍉', nome: 'Melancia', destino: 'venda', estado: 'crescendo' },
  { id: 'coentro', figura: '🍃', nome: 'Coentro', destino: 'comunidade', estado: 'crescendo' },
  { id: 'couve', figura: '🥗', nome: 'Couve', destino: 'comunidade', estado: 'colher' },
]

/* Aulas. Cada passo é uma tela. */
export const cursos = [
  {
    id: 'vender-bem',
    figura: '💰',
    titulo: 'Vender bem',
    cor: 'amarelo',
    passos: [
      { figura: '🏪', texto: 'Pergunte ao mercado o que ele quer comprar.' },
      { figura: '🥬', texto: 'Venda só as verduras bonitas e do mesmo tamanho.' },
      { figura: '🤝', texto: 'A horta da comunidade é para dar. A horta de venda é para vender.' },
      { figura: '🚫', texto: 'Não dê de graça a verdura de venda. Ela paga o sustento da casa e a bomba do poço.' },
      { figura: '🌱', texto: 'Guarde um pouco de cada venda para comprar sementes.' },
    ],
  },
  {
    id: 'plantar-alface',
    figura: '🥬',
    titulo: 'Plantar alface',
    cor: 'laranja',
    passos: [
      { figura: '⛅', texto: 'Faça o canteiro onde bate sol de manhã e tem sombra à tarde.' },
      { figura: '✋', texto: 'Plante as mudas com um palmo de distância uma da outra.' },
      { figura: '💧', texto: 'Molhe todo dia, bem cedinho ou no fim da tarde.' },
      { figura: '🔪', texto: 'Depois de um mês e meio, colha o pé inteiro, cortando rente ao chão.' },
    ],
  },
  {
    id: 'plantar-melancia',
    figura: '🍉',
    titulo: 'Plantar melancia',
    cor: 'verde',
    passos: [
      { figura: '☀️', texto: 'Plante a melancia num lugar com muito sol.' },
      { figura: '👣', texto: 'Deixe dois passos largos entre uma cova e outra.' },
      { figura: '🌾', texto: 'Ela está madura quando o cabinho perto dela fica seco.' },
      { figura: '👂', texto: 'Bata na melancia com a mão. Se o som for oco, pode colher.' },
    ],
  },
  {
    id: 'pulgao',
    figura: '🐛',
    titulo: 'Tirar bichinhos',
    cor: 'vermelho',
    passos: [
      { figura: '🧼', texto: 'Rale um pedaço de sabão de coco num litro de água.' },
      { figura: '💦', texto: 'Ponha num borrifador e molhe embaixo das folhas.' },
      { figura: '🌇', texto: 'Faça no fim da tarde, por três dias seguidos.' },
    ],
  },
]

/*
 * Preço mínimo de venda, já calculado pelo sistema a partir do preço do mercado local
 * e do custo da família (sementes, adubo, manutenção da bomba).
 */
export const precos = [
  { id: 'alface', figura: '🥬', nome: 'Alface', unidade: 'cada pé', valor: 2.8 },
  { id: 'cebolinha', figura: '🌿', nome: 'Cebolinha', unidade: 'cada maço', valor: 2.2 },
  { id: 'tomate', figura: '🍅', nome: 'Tomate', unidade: 'o quilo', valor: 9 },
  { id: 'melancia', figura: '🍉', nome: 'Melancia', unidade: 'cada uma', valor: 12 },
]

export const compradores = [
  { id: 'mercadinho', figura: '🏪', nome: 'Mercadinho São José', quer: 'alface', quando: 'Sexta-feira' },
  { id: 'escola', figura: '🏫', nome: 'Escola (merenda)', quer: 'cebolinha', quando: 'Dia 10' },
  { id: 'feira', figura: '⛺', nome: 'Feira de Assú', quer: 'de tudo', quando: 'Sábado' },
]

/* ---------- Painel da iniciativa parceira ---------- */

export const impacto = {
  familias: 18,
  colheitaKg: 640,
  rendaReais: 4380,
  economiaAguaPct: 31,
  mesReferencia: 'outubro',
  colheitaPorMes: [
    { mes: 'jun', kg: 120 },
    { mes: 'jul', kg: 260 },
    { mes: 'ago', kg: 410 },
    { mes: 'set', kg: 520 },
    { mes: 'out', kg: 640 },
  ],
}

/* A soma das comunidades bate com o total do impacto (18 famílias, 640 kg). */
export const comunidadesParceiras = [
  { id: 'angelica', nome: 'Comunidade Angélica', municipio: 'Ipanguaçu (RN)', familias: 11, colheitaKg: 390, situacao: 'Produzindo' },
  { id: 'carnauba', nome: 'Comunidade Carnaúba (exemplo)', municipio: '—', familias: 4, colheitaKg: 150, situacao: 'Produzindo' },
  { id: 'umbuzeiro', nome: 'Sítio Umbuzeiro (exemplo)', municipio: '—', familias: 3, colheitaKg: 100, situacao: 'Começando' },
]

export const proximasComunidades = [
  {
    id: 'juazeiro',
    nome: 'Sítio Juazeiro (exemplo)',
    motivo: 'Já tem poço, mas ainda não tem horta.',
    prioridade: 'alta',
  },
  {
    id: 'mandacaru',
    nome: 'Comunidade Mandacaru (exemplo)',
    motivo: 'Depende do carro-pipa duas vezes por semana.',
    prioridade: 'media',
  },
]
