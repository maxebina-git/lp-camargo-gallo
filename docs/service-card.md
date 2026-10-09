# Serviços — geometria dos cards

Referência visual do layout da section de serviços (`/servicos`).
Dados: `src/data/servicos.ts` (11 itens) · Implementação: `src/components/services/ServicesSection.astro`

Valores em **desktop** (`width >= 48rem`):

| token | valor |
|---|---|
| `--servico-altura` | `28rem` = **448px** (altura fixa de cada card) |
| `--servico-peek` | `448 / 100` = **4,48px** — 1% da altura do card |
| largura do card | 100% do container (1248px numa viewport de 1600px) |
| passo de escala | **1% por card** |
| card 11 | 100% − 10 × 1% = **90%** da largura do card 1 |

---

## Cenário 1 — card 1 ativo, card 2 atrás

Estado inicial, sem scroll. O card 1 ocupa a cena inteira; o card 2 aparece
como uma fatia fina da **base** logo abaixo dele, 1% menor e atrás no z.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  01   Recuperação de Fachadas com Pintura ou Textura Acrílica    │
│                                                                  │
│  Tratamento de patologias e aplicação de pintura ou textura.     │
│                                                                  │
│  ────────────────────                             [ imagem ]     │
│                                                                  │
│  [ Saiba mais ]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
 └────────────────────────────────────────────────────────────────┘       99% · 4,48px
```

| # | elemento | escala | altura visível | z-index |
|---|---|---|---|---|
| 1 | card 1 — ativo | **100%** | 448px (inteira) | **frente** |
| 2 | card 2 — fatia | **99%** | **4,48px** (1%) | **atrás** |

O recuo da fatia é de **0,5% de cada lado** (≈6px em 1248px), porque a escala
é centralizada. *No desenho o recuo está exagerado ~9× para caber no terminal;
com os 6px reais ele seria sub-caractere aqui.*

A fatia é a **base** do card 2 porque ele fica mais abaixo que o card 1 e
atrás dele: o topo do card 2 fica coberto pelo card 1, e só a parte de baixo
passa da borda.

---

## Cenário 2 — a pirâmide inteira, card 1 ativo

Cada card mostra 1% da base. As 10 fatias empilham 4,48px cada = **44,80px**
de escada abaixo do card ativo. O recuo cresce 0,5% por lado a cada degrau.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  01   Recuperação de Fachadas com Pintura ou Textura Acrílica    │
│                                                                  │
│  Tratamento de patologias e aplicação de pintura ou textura.     │
│                                                                  │
│  ────────────────────                             [ imagem ]     │
│                                                                  │
│  [ Saiba mais ]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
 └────────────────────────────────────────────────────────────────┘       99% · 4,48px
  └──────────────────────────────────────────────────────────────┘        98% · 4,48px
   └────────────────────────────────────────────────────────────┘         97% · 4,48px
    └──────────────────────────────────────────────────────────┘          96% · 4,48px
     └────────────────────────────────────────────────────────┘           95% · 4,48px
      └──────────────────────────────────────────────────────┘            94% · 4,48px
       └────────────────────────────────────────────────────┘             93% · 4,48px
        └──────────────────────────────────────────────────┘              92% · 4,48px
         └────────────────────────────────────────────────┘               91% · 4,48px
          └──────────────────────────────────────────────┘                90% · 4,48px
```

O ápice não se move em lugar nenhum. A cada scroll o próximo card sobe para
o ápice e o antigo desce um degrau, mantendo o topo ancorado.

---

## Cenário 3 — card 2 ativo, card 1 já saiu para cima

Primeiro scroll. Idêntico ao Cenário 2, com duas diferenças: o ápice passou a
ser o **card 2**, e o card 1 que estava no ápice agora aparece **acima** dele
com só 1% visível. Atrás do ativo restam **9 cards** (3 a 11), não 10.

```
 ┌────────────────────────────────────────────────────────────────┐       99% · 4,48px
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  02   Recuperação Total de Fachadas com Revestimento Cerâmico    │
│                                                                  │
│  Remoção do revestimento degraded e requentação completa.        │
│                                                                  │
│  ────────────────────                             [ imagem ]     │
│                                                                  │
│  [ Saiba mais ]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
 └────────────────────────────────────────────────────────────────┘       99% · 4,48px
  └──────────────────────────────────────────────────────────────┘        98% · 4,48px
   └────────────────────────────────────────────────────────────┘         97% · 4,48px
    └──────────────────────────────────────────────────────────┘          96% · 4,48px
     └────────────────────────────────────────────────────────┘           95% · 4,48px
      └──────────────────────────────────────────────────────┘            94% · 4,48px
       └────────────────────────────────────────────────────┘             93% · 4,48px
        └──────────────────────────────────────────────────┘              92% · 4,48px
         └────────────────────────────────────────────────┘               91% · 4,48px
```

Card 1 aparece no topo com **1% visível e escala 99%** (≈6,24px de recuo por
lado, a mesma medida da primeira fatia do Cenário 2 — só mudou de lado).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima | 1 | **99%** | 1235,52px | 6,24px |
| ápice | 2 | **100%** | 1248,00px | 0 |
| abaixo 1 | 3 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 4 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 5 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 6 | 96% | 1198,08px | 24,96px |
| abaixo 5 | 7 | 95% | 1185,60px | 31,20px |
| abaixo 6 | 8 | 94% | 1173,12px | 37,44px |
| abaixo 7 | 9 | 93% | 1160,64px | 43,68px |
| abaixo 8 | 10 | 92% | 1148,16px | 49,92px |
| abaixo 9 | 11 | 91% | 1135,68px | 56,16px |

**A pilha continua com o mesmo tamanho.** São 10 fatias (1 acima + 9 abaixo) ×
4,48px = **44,80px**, exatamente o mesmo total do Cenário 2 — uma fatia apenas
migrou de baixo para cima.

A escala afasta 1% do ápice em **qualquer** direção: para baixo, 99% → 91%; para
cima, o card 1 fica a 99%. Por isso a pirâmide afina dos dois lados do ápice e as
fatias são simétricas: a de cima e a primeira de baixo têm a mesma escala (99%).

### Qual parte do card 1 aparece

A fatia de cima é o **topo** do card 1 (`clip-path: inset(0% 0% 99% 0%)`): a
borda de cima dele fica logo acima do card 2 e o corpo desce **atrás** dele. É
por isso que a fatia de cima mostra a borda de cima arredondada, enquanto as de
baixo mostram a borda de base.

> **Resolvido no código.** A escala é a da **posição** na pirâmide, não a do card:
> com o ápice no card 2, o card 1 (1 degrau acima) vai para 99% — não para 100%,
> que o mandaria mais largo que o ápice. Vale nos dois sentidos, então a coluna de
> baixo também é relativa: o card 11 cresce de 90% (Cenário 2) até 99% (Cenário 11)
> conforme se aproxima do ápice, em vez de dar um salto de 90% para 100%.

---

## Cenário 4 — card 3 ativo, cards 1 e 2 já saíram para cima

Segundo scroll. O ápice agora é o **card 3**. O card 2, que era o ativo, agora é
uma fatia de topo (99%), e o card 1 tornou-se a fatia de topo mais alta (98%).
Abaixo do ativo, restam **8 cards** (4 a 11), com escalas de 99% a 92%.

```
   ┌──────────────────────────────────────────────────────────────┐       98% · 4,48px  ← Card 1 (topo)
  ┌────────────────────────────────────────────────────────────────┐       99% · 4,48px  ← Card 2 (topo)
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  03   [Nome do Serviço 3]                                        │
│                                                                  │
│  [Descrição do serviço 3]                                        │
│                                                                  │
│  ────────────────────                             [ imagem ]     │
│                                                                  │
│  [ Saiba mais ]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
 └────────────────────────────────────────────────────────────────┘       99% · 4,48px  ← Card 4 (base)
  └──────────────────────────────────────────────────────────────┘        98% · 4,48px  ← Card 5 (base)
   └────────────────────────────────────────────────────────────┘         97% · 4,48px  ← Card 6 (base)
    └──────────────────────────────────────────────────────────┘          96% · 4,48px  ← Card 7 (base)
     └────────────────────────────────────────────────────────┘           95% · 4,48px  ← Card 8 (base)
      └──────────────────────────────────────────────────────┘            94% · 4,48px  ← Card 9 (base)
       └────────────────────────────────────────────────────┘             93% · 4,48px  ← Card 10 (base)
        └──────────────────────────────────────────────────┘              92% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (2 fatias acima + 8 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 1 | 1 | **98%** | 1223,04px | 12,48px |
| acima 0 | 2 | **99%** | 1235,52px | 6,24px |
| **ápice** | 3 | **100%** | 1248,00px | 0 |
| abaixo 1 | 4 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 5 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 6 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 7 | 96% | 1198,08px | 24,96px |
| abaixo 5 | 8 | 95% | 1185,60px | 31,20px |
| abaixo 6 | 9 | 94% | 1173,12px | 37,44px |
| abaixo 7 | 10 | 93% | 1160,64px | 43,68px |
| abaixo 8 | 11 | 92% | 1148,16px | 49,92px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`.

### Qual parte dos cards 1 e 2 aparece

A fatia de cima é o **topo** de cada card (`clip-path: inset(0% 0% 99% 0%)`): a
borda superior do card fica logo acima do card ativo e o corpo desce **atrás**
dele. É por isso que a fatia de cima mostra a borda de cima arredondada,
enquanto as de baixo mostram a borda de base.

- **Card 1** (mais antigo, no topo da pilha): escala 98%, mostra o topo com
  recuo de 12,48px por lado
- **Card 2** (mais recente, logo acima do ativo): escala 99%, mostra o topo com
  recuo de 6,24px por lado — a mesma medida da primeira fatia de base do
  Cenário 2, só mudou de lado

---

## Cenário 5 — card 4 ativo, cards 1, 2 e 3 já saíram para cima

Terceiro scroll. O ápice agora é o **card 4**. Os cards 1, 2 e 3 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **7 cards** (5 a 11).

```
      ┌────────────────────────────────────────────────────────────┐       97% · 4,48px  ← Card 1 (topo)
     ┌──────────────────────────────────────────────────────────────┐      98% · 4,48px  ← Card 2 (topo)
    ┌────────────────────────────────────────────────────────────────┐     99% · 4,48px  ← Card 3 (topo)
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  04   [Nome do Serviço 4]                                        │
│                                                                  │
│  [Descrição do serviço 4]                                        │
│                                                                  │
│  ────────────────────                             [ imagem ]     │
│                                                                  │
│  [ Saiba mais ]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
 └────────────────────────────────────────────────────────────────┘       99% · 4,48px  ← Card 5 (base)
  └──────────────────────────────────────────────────────────────┘        98% · 4,48px  ← Card 6 (base)
   └────────────────────────────────────────────────────────────┘         97% · 4,48px  ← Card 7 (base)
    └──────────────────────────────────────────────────────────┘          96% · 4,48px  ← Card 8 (base)
     └────────────────────────────────────────────────────────┘           95% · 4,48px  ← Card 9 (base)
      └──────────────────────────────────────────────────────┘            94% · 4,48px  ← Card 10 (base)
       └────────────────────────────────────────────────────┘             93% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (3 fatias acima + 7 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 2 | 1 | **97%** | 1198,08px | 24,96px |
| acima 1 | 2 | **98%** | 1223,04px | 12,48px |
| acima 0 | 3 | **99%** | 1235,52px | 6,24px |
| **ápice** | 4 | **100%** | 1248,00px | 0 |
| abaixo 1 | 5 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 6 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 7 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 8 | 96% | 1198,08px | 24,96px |
| abaixo 5 | 9 | 95% | 1185,60px | 31,20px |
| abaixo 6 | 10 | 94% | 1173,12px | 37,44px |
| abaixo 7 | 11 | 93% | 1160,64px | 43,68px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 97% (card 1) até 93% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 6 — card 5 ativo, cards 1 a 4 já saíram para cima

Quarto scroll. O ápice agora é o **card 5**. Os cards 1, 2, 3 e 4 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **6 cards** (6 a 11).

```
┌────────────────────────────────────────────────────────────┐       96% · 4,48px  ← Card 1 (topo)
      ┌──────────────────────────────────────────────────────────────┐      97% · 4,48px  ← Card 2 (topo)
     ┌────────────────────────────────────────────────────────────────┐     98% · 4,48px  ← Card 3 (topo)
    ┌──────────────────────────────────────────────────────────────────┐      99% · 4,48px  ← Card 4 (topo)
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  05   [Nome do Serviço 5]                                           │
│                                                                     │
│  [Descrição do serviço 5]                                           │
│                                                                     │
│  ────────────────────                              [ imagem ]      │
│                                                                     │
│  [ Saiba mais ]                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
  └──────────────────────────────────────────────────────────────────┐       99% · 4,48px  ← Card 6 (base)
   └──────────────────────────────────────────────────────────────┐        98% · 4,48px  ← Card 7 (base)
    └────────────────────────────────────────────────────────────┐         97% · 4,48px  ← Card 8 (base)
     └──────────────────────────────────────────────────────────┐          96% · 4,48px  ← Card 9 (base)
      └────────────────────────────────────────────────────────┐           95% · 4,48px  ← Card 10 (base)
       └──────────────────────────────────────────────────────┐            94% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (4 fatias acima + 6 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 3 | 1 | **96%** | 1198,08px | 24,96px |
| acima 2 | 2 | **97%** | 1210,56px | 18,72px |
| acima 1 | 3 | **98%** | 1223,04px | 12,48px |
| acima 0 | 4 | **99%** | 1235,52px | 6,24px |
| **ápice** | 5 | **100%** | 1248,00px | 0 |
| abaixo 1 | 6 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 7 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 8 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 9 | 96% | 1198,08px | 24,96px |
| abaixo 5 | 10 | 95% | 1185,60px | 31,20px |
| abaixo 6 | 11 | 94% | 1173,12px | 37,44px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 96% (card 1) até 94% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 7 — card 6 ativo, cards 1 a 5 já saíram para cima

Quinto scroll. O ápice agora é o **card 6**. Os cards 1, 2, 3, 4 e 5 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **5 cards** (7 a 11).

```
┌────────────────────────────────────────────────────────────┐       95% · 4,48px  ← Card 1 (topo)
        ┌──────────────────────────────────────────────────────────────┐      96% · 4,48px  ← Card 2 (topo)
       ┌────────────────────────────────────────────────────────────────┐     97% · 4,48px  ← Card 3 (topo)
      ┌──────────────────────────────────────────────────────────────────┐      98% · 4,48px  ← Card 4 (topo)
     ┌────────────────────────────────────────────────────────────────────┐       99% · 4,48px  ← Card 5 (topo)
┌───────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  06   [Nome do Serviço 6]                                              │
│                                                                         │
│  [Descrição do serviço 6]                                              │
│                                                                         │
│  ────────────────────                                 [ imagem ]       │
│                                                                         │
│  [ Saiba mais ]                                                            │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
  └──────────────────────────────────────────────────────────────┐        99% · 4,48px  ← Card 7 (base)
   └────────────────────────────────────────────────────────────┐         98% · 4,48px  ← Card 8 (base)
    └──────────────────────────────────────────────────────────┐          97% · 4,48px  ← Card 9 (base)
     └────────────────────────────────────────────────────────┐           96% · 4,48px  ← Card 10 (base)
      └──────────────────────────────────────────────────────┐            95% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (5 fatias acima + 5 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 4 | 1 | **95%** | 1185,60px | 31,20px |
| acima 3 | 2 | **96%** | 1198,08px | 24,96px |
| acima 2 | 3 | **97%** | 1210,56px | 18,72px |
| acima 1 | 4 | **98%** | 1223,04px | 12,48px |
| acima 0 | 5 | **99%** | 1235,52px | 6,24px |
| **ápice** | 6 | **100%** | 1248,00px | 0 |
| abaixo 1 | 7 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 8 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 9 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 10 | 96% | 1198,08px | 24,96px |
| abaixo 5 | 11 | 95% | 1185,60px | 31,20px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 95% (card 1) até 95% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 8 — card 7 ativo, cards 1 a 6 já saíram para cima

Sexto scroll. O ápice agora é o **card 7**. Os cards 1, 2, 3, 4, 5 e 6 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **4 cards** (8 a 11).

```
          ┌────────────────────────────────────────────────────────────┐       94% · 4,48px  ← Card 1 (topo)
          ┌──────────────────────────────────────────────────────────────┐      95% · 4,48px  ← Card 2 (topo)
         ┌────────────────────────────────────────────────────────────────┐     96% · 4,48px  ← Card 3 (topo)
        ┌──────────────────────────────────────────────────────────────────┐      97% · 4,48px  ← Card 4 (topo)
       ┌────────────────────────────────────────────────────────────────────┐       98% · 4,48px  ← Card 5 (topo)
      ┌──────────────────────────────────────────────────────────────────────┐       99% · 4,48px  ← Card 6 (topo)
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  07   [Nome do Serviço 7]                                                    │
│                                                                             │
│  [Descrição do serviço 7]                                                    │
│                                                                             │
│  ────────────────────                                     [ imagem ]         │
│                                                                             │
│  [ Saiba mais ]                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────┘
  └────────────────────────────────────────────────────────────┐                99% · 4,48px  ← Card 8 (base)
   └──────────────────────────────────────────────────────────┐                 98% · 4,48px  ← Card 9 (base)
    └────────────────────────────────────────────────────────┐                  97% · 4,48px  ← Card 10 (base)
     └──────────────────────────────────────────────────────┐                   96% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (6 fatias acima + 4 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 5 | 1 | **94%** | 1173,12px | 37,44px |
| acima 4 | 2 | **95%** | 1185,60px | 31,20px |
| acima 3 | 3 | **96%** | 1198,08px | 24,96px |
| acima 2 | 4 | **97%** | 1210,56px | 18,72px |
| acima 1 | 5 | **98%** | 1223,04px | 12,48px |
| acima 0 | 6 | **99%** | 1235,52px | 6,24px |
| **ápice** | 7 | **100%** | 1248,00px | 0 |
| abaixo 1 | 8 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 9 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 10 | 97% | 1210,56px | 18,72px |
| abaixo 4 | 11 | 96% | 1198,08px | 24,96px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 94% (card 1) até 96% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 9 — card 8 ativo, cards 1 a 7 já saíram para cima

Sétimo scroll. O ápice agora é o **card 8**. Os cards 1, 2, 3, 4, 5, 6 e 7 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **3 cards** (9 a 11).

```
            ┌────────────────────────────────────────────────────────────┐       93% · 4,48px  ← Card 1 (topo)
            ┌──────────────────────────────────────────────────────────────┐      94% · 4,48px  ← Card 2 (topo)
           ┌────────────────────────────────────────────────────────────────┐     95% · 4,48px  ← Card 3 (topo)
          ┌──────────────────────────────────────────────────────────────────┐      96% · 4,48px  ← Card 4 (topo)
         ┌────────────────────────────────────────────────────────────────────┐       97% · 4,48px  ← Card 5 (topo)
        ┌──────────────────────────────────────────────────────────────────────┐       98% · 4,48px  ← Card 6 (topo)
       ┌────────────────────────────────────────────────────────────────────────┐     99% · 4,48px  ← Card 7 (topo)
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  08   [Nome do Serviço 8]                                                       │
│                                                                                │
│  [Descrição do serviço 8]                                                       │
│                                                                                │
│  ────────────────────                                         [ imagem ]           │
│                                                                                │
│  [ Saiba mais ]                                                                  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────┘
  └─────────────────────────────────────────────────────────┐                      99% · 4,48px  ← Card 9 (base)
   └────────────────────────────────────────────────────────┐                       98% · 4,48px  ← Card 10 (base)
    └──────────────────────────────────────────────────────┐                        97% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (7 fatias acima + 3 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 6 | 1 | **93%** | 1160,64px | 43,68px |
| acima 5 | 2 | **94%** | 1173,12px | 37,44px |
| acima 4 | 3 | **95%** | 1185,60px | 31,20px |
| acima 3 | 4 | **96%** | 1198,08px | 24,96px |
| acima 2 | 5 | **97%** | 1210,56px | 18,72px |
| acima 1 | 6 | **98%** | 1223,04px | 12,48px |
| acima 0 | 7 | **99%** | 1235,52px | 6,24px |
| **ápice** | 8 | **100%** | 1248,00px | 0 |
| abaixo 1 | 9 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 10 | 98% | 1223,04px | 12,48px |
| abaixo 3 | 11 | 97% | 1210,56px | 18,72px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 93% (card 1) até 97% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 10 — card 9 ativo, cards 1 a 8 já saíram para cima

Oitavo scroll. O ápice agora é o **card 9**. Os cards 1, 2, 3, 4, 5, 6, 7 e 8 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, restam **2 cards** (10 e 11).

```
              ┌────────────────────────────────────────────────────────────┐       92% · 4,48px  ← Card 1 (topo)
              ┌──────────────────────────────────────────────────────────────┐      93% · 4,48px  ← Card 2 (topo)
             ┌────────────────────────────────────────────────────────────────┐     94% · 4,48px  ← Card 3 (topo)
            ┌──────────────────────────────────────────────────────────────────┐      95% · 4,48px  ← Card 4 (topo)
           ┌────────────────────────────────────────────────────────────────────┐       96% · 4,48px  ← Card 5 (topo)
          ┌──────────────────────────────────────────────────────────────────────┐       97% · 4,48px  ← Card 6 (topo)
         ┌────────────────────────────────────────────────────────────────────────┐     98% · 4,48px  ← Card 7 (topo)
        ┌──────────────────────────────────────────────────────────────────────────┐      99% · 4,48px  ← Card 8 (topo)
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                                   │
│  09   [Nome do Serviço 9]                                                          │
│                                                                                   │
│  [Descrição do serviço 9]                                                          │
│                                                                                   │
│  ────────────────────                                             [ imagem ]           │
│                                                                                   │
│  [ Saiba mais ]                                                                      │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
  └──────────────────────────────────────────────────────────┐                        99% · 4,48px  ← Card 10 (base)
   └────────────────────────────────────────────────────────┐                         98% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (8 fatias acima + 2 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 7 | 1 | **92%** | 1148,16px | 49,92px |
| acima 6 | 2 | **93%** | 1160,64px | 43,68px |
| acima 5 | 3 | **94%** | 1173,12px | 37,44px |
| acima 4 | 4 | **95%** | 1185,60px | 31,20px |
| acima 3 | 5 | **96%** | 1198,08px | 24,96px |
| acima 2 | 6 | **97%** | 1210,56px | 18,72px |
| acima 1 | 7 | **98%** | 1223,04px | 12,48px |
| acima 0 | 8 | **99%** | 1235,52px | 6,24px |
| **ápice** | 9 | **100%** | 1248,00px | 0 |
| abaixo 1 | 10 | 99% | 1235,52px | 6,24px |
| abaixo 2 | 11 | 98% | 1223,04px | 12,48px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 92% (card 1) até 98% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 11 — card 10 ativo, cards 1 a 9 já saíram para cima

Nono scroll. O ápice agora é o **card 10**. Os cards 1, 2, 3, 4, 5, 6, 7, 8 e 9 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, resta **1 card** (11).

```
                  ┌────────────────────────────────────────────────────────────┐       91% · 4,48px  ← Card 1 (topo)
                 ┌──────────────────────────────────────────────────────────────┐      92% · 4,48px  ← Card 2 (topo)
                ┌────────────────────────────────────────────────────────────────┐     93% · 4,48px  ← Card 3 (topo)
               ┌──────────────────────────────────────────────────────────────────┐      94% · 4,48px  ← Card 4 (topo)
              ┌────────────────────────────────────────────────────────────────────┐       95% · 4,48px  ← Card 5 (topo)
             ┌──────────────────────────────────────────────────────────────────────┐       96% · 4,48px  ← Card 6 (topo)
            ┌────────────────────────────────────────────────────────────────────────┐     97% · 4,48px  ← Card 7 (topo)
           ┌──────────────────────────────────────────────────────────────────────────┐      98% · 4,48px  ← Card 8 (topo)
          ┌────────────────────────────────────────────────────────────────────────────┐       99% · 4,48px  ← Card 9 (topo)
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                                    │
│  10   [Nome do Serviço 10]                                                         │
│                                                                                    │
│  [Descrição do serviço 10]                                                         │
│                                                                                    │
│  ────────────────────                                                [ imagem ]       │
│                                                                                    │
│  [ Saiba mais ]                                                                       │
│                                                                                    │
└───────────────────────────────────────────────────────────────────────────────┘
  └─────────────────────────────────────────────────────────┐                          99% · 4,48px  ← Card 11 (base)
```

A pilha mantém a mesma altura total de **44,80px** (9 fatias acima + 1 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 8 | 1 | **91%** | 1135,68px | 56,16px |
| acima 7 | 2 | **92%** | 1148,16px | 49,92px |
| acima 6 | 3 | **93%** | 1160,64px | 43,68px |
| acima 5 | 4 | **94%** | 1173,12px | 37,44px |
| acima 4 | 5 | **95%** | 1185,60px | 31,20px |
| acima 3 | 6 | **96%** | 1198,08px | 24,96px |
| acima 2 | 7 | **97%** | 1210,56px | 18,72px |
| acima 1 | 8 | **98%** | 1223,04px | 12,48px |
| acima 0 | 9 | **99%** | 1235,52px | 6,24px |
| **ápice** | 10 | **100%** | 1248,00px | 0 |
| abaixo 1 | 11 | 99% | 1235,52px | 6,24px |

As fatias de topo usam os cantos `┌ ... ┐` e as de base `└ ... ┘`. A pirâmide afunila simetricamente de 91% (card 1) até 99% (card 11), mantendo 10 fatias visíveis e 44,80px de altura total.

---

## Cenário 12 — card 11 ativo, cards 1 a 10 já saíram para cima

Décimo scroll. O ápice agora é o **card 11**. Os cards 1, 2, 3, 4, 5, 6, 7, 8, 9 e 10 tornaram-se fatias de topo, empilhadas em ordem cronológica (o mais recente à frente). Abaixo do ativo, não resta mais cards.

```
                       ┌────────────────────────────────────────────────────────────┐       90% · 4,48px  ← Card 1 (topo)
                      ┌──────────────────────────────────────────────────────────────┐      91% · 4,48px  ← Card 2 (topo)
                     ┌────────────────────────────────────────────────────────────────┐     92% · 4,48px  ← Card 3 (topo)
                    ┌──────────────────────────────────────────────────────────────────┐      93% · 4,48px  ← Card 4 (topo)
                   ┌────────────────────────────────────────────────────────────────────┐       94% · 4,48px  ← Card 5 (topo)
                  ┌──────────────────────────────────────────────────────────────────────┐       95% · 4,48px  ← Card 6 (topo)
                 ┌────────────────────────────────────────────────────────────────────────┐     96% · 4,48px  ← Card 7 (topo)
                ┌──────────────────────────────────────────────────────────────────────────┐      97% · 4,48px  ← Card 8 (topo)
               ┌────────────────────────────────────────────────────────────────────────────┐       98% · 4,48px  ← Card 9 (topo)
              ┌──────────────────────────────────────────────────────────────────────────────┐      99% · 4,48px  ← Card 10 (topo)
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│  11   [Nome do Serviço 11]                                                            │
│                                                                                       │
│  [Descrição do serviço 11]                                                            │
│                                                                                       │
│  ────────────────────                                          [ imagem ]              │
│                                                                                       │
│  [ Saiba mais ]                                                                         │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

A pilha mantém a mesma altura total de **44,80px** (10 fatias acima, 0 abaixo).

| posição | card | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| acima 9 | 1 | **90%** | 1123,20px | 62,40px |
| acima 8 | 2 | **91%** | 1135,68px | 56,16px |
| acima 7 | 3 | **92%** | 1148,16px | 49,92px |
| acima 6 | 4 | **93%** | 1160,64px | 43,68px |
| acima 5 | 5 | **94%** | 1173,12px | 37,44px |
| acima 4 | 6 | **95%** | 1185,60px | 31,20px |
| acima 3 | 7 | **96%** | 1198,08px | 24,96px |
| acima 2 | 8 | **97%** | 1210,56px | 18,72px |
| acima 1 | 9 | **98%** | 1223,04px | 12,48px |
| acima 0 | 10 | **99%** | 1235,52px | 6,24px |
| **ápice** | 11 | **100%** | 1248,00px | 0 |

As fatias de topo usam os cantos `┌ ... ┐` e não há fatias de base, pois o card 11 é o ativo e ocupa toda a cena.

---

## Tabela de escala — Cenário 2 (card 1 ativo, passo de 1%)


| card | índice | escala | largura em 1248px | recuo por lado |
|---|---|---|---|---|
| 1 | 0 | **100%** | 1248,00px | 0 |
| 2 | 1 | 99% | 1235,52px | 6,24px |
| 3 | 2 | 98% | 1223,04px | 12,48px |
| 4 | 3 | 97% | 1210,56px | 18,72px |
| 5 | 4 | 96% | 1198,08px | 24,96px |
| 6 | 5 | 95% | 1185,60px | 31,20px |
| 7 | 6 | 94% | 1173,12px | 37,44px |
| 8 | 7 | 93% | 1160,64px | 43,68px |
| 9 | 8 | 92% | 1148,16px | 49,92px |
| 10 | 9 | 91% | 1135,68px | 56,16px |
| 11 | 10 | 90% | 1123,20px | 62,40px |

---

## Aviso honesto sobre o tronco

Com **1% por card** a base fica a **90%** do ápice. A soma dos recuos é 62px
em 1248px de largura — isso é uma pirâmide quase reta, e só fica legível como
triângulo porque o desenho é explícito. Em tela, o olho provavelmente lê como
"cards de tamanhos levemente diferentes", não como pirâmide.

Para a pirâmide aparecer de fato o passo precisa subir:

| passo | base | recuo total | leitura |
|---|---|---|---|
| 1% | 90% | 62px | quase reto |
| 2% | 80% | 125px | funil discreto |
| 4% | 60% | 249px | pirâmide legível |
| 8% | 20% | 499px | pirâmide evidente |

O `--servico-peek` é a outra metade da conta, e é independente: a fatia é 1%
da **altura**, e altura e largura são grandezas diferentes. Dá para estreitar
a pirâmide sem mexer no passo da fatia.

> **O código já está em 1%.** A implementação usa `scale: 1 − |N| × 0.01`, com
> `N = ápice − card`, que é o passo de 1% desenhado aqui. A nota original deste
> arquivo descrevia um `0.02` (2% por card, base a 80%) que foi substituído antes
> de a implementação ficar pronta.

---

## Convenção dos cantos

Os cantos da moldura dizem **qual aresta do card** a fatia está mostrando:

| posição do card | aresta visível | cantos | onde aparece |
|---|---|---|---|
| **acima** do ativo | topo | `┌` … `┐` | Cenário 3, card 1 |
| **abaixo** do ativo | base | `└` … `┘` | Cenários 1 e 2, e os 9 de baixo do Cenário 3 |

Não é decorativo — é o que se vê de verdade. O card que está acima do ativo
aparece só pelo seu **topo** (`clip-path: inset(0% 0% 99% 0%)`, o corpo desce
atrás do ativo), então a aresta visível tem os cantos de cima. Os cards de
baixo aparecem só pela **base**, então a aresta tem os cantos de baixo.

A legenda à direita de cada fatia segue a mesma ordem: `escala · 4,48px`, sempre
na coluna 76.

---

## Notas de implementação

- **Card ativo ancorado.** Fica em `--servico-folga` (44,80px) dentro da lista
  e nunca se move. É o `top` estático menos o deslocamento do conjunto (`<ol>`).
- **Recorte.** `clip-path: inset(0% 0% 99% 0%)` deixa só a fatia de **cima** —
  é isso que faz o corpo do card pendurar para baixo e obriga ele a ir para
  trás no z do card ativo.
- **z-index.** Ativo `100`; card que já saiu `10 + índice` (o mais recente na
  frente dos antigos, para nenhum corpo cobrir a fatia do vizinho de cima);
  os que ainda não passaram, `0`.
- **Altura fixa é obrigatória.** A fatia é 1% dela; com altura natural cada
  card daria uma fatia diferente e a escada não ladrilharia.
- **Escala e deslocamento por posição, nos dois sentidos.** `N = ápice − card`, e a
  escala é `1 − |N| × 1%`. O `y` é `−0,01 × H × N` **só acima** do ápice (`N > 0`);
  abaixo é `0`. O `y` é o que compensa a escala para a borda de cima cair na
  fatia: o topo de um card acima é `folga + k × peek + 0,01 × H × N + y − ápice × peek`,
  que com esse `y` fecha em `folga − N × peek` — exatamente um degrau por card.
  Abaixo, a base fica em `folga + H + (k − ápice) × peek`, também um degrau. É
  por isso que a pilha ladrilha em 44,80px nos dois sentidos e nas 12 cenas.
- **O `clip-path` tem prazo próprio.** Ele só pode terminar no fim do segmento em
  que o card sai, enquanto escala e `y` continuam andando nos segmentos
  seguintes. Se os três dividissem o mesmo tween, o recorte fecharia com o card
  ainda mudando de escala.
- **Alternância imagem/texto** no desktop: ímpares com imagem à direita, pares
  à esquerda, via `order` (o DOM é sempre texto → imagem, para a ordem de
  leitura não divergir da visual).