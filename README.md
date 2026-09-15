# 🧱 Breakout

Breakout em HTML5 Canvas + JavaScript puro. Sem dependências, sem build.

**Jogar online:** https://condedeveloper.github.io/breakout/

## Rodar local

```bash
npx serve -l 5185 .
```

## Controles

| Ação            | Tecla / gesto                  |
|-----------------|--------------------------------|
| Mover raquete   | Mouse, toque, ← → ou A D       |
| Lançar / pausar | Espaço, clique ou toque        |
| Pausar          | P ou Esc                       |

## Power-ups

| Ícone | Efeito                                         |
|-------|------------------------------------------------|
| ⬌     | Raquete larga por 9 s                          |
| ✚     | Multibola: divide a bola em três               |
| ◔     | Bola lenta por 9 s                             |
| ♥     | Vida extra                                     |
| ⚡     | Bola de fogo: atravessa tijolos comuns por 9 s |

## Funcionalidades

- 5 níveis desenhados em mapas de texto, depois repete com tijolos reforçados
- 7 tipos de tijolo, incluindo reforçados (2 e 3 golpes, com rachaduras) e indestrutíveis
- Ângulo da rebatida conforme o ponto de impacto na raquete
- Bola acelera a cada rebatida, com limite
- Partículas na quebra de tijolos e barras de duração dos efeitos
- Pontuação multiplicada pelo nível, recorde no `localStorage`
- Sons via WebAudio, controles por toque

## Estrutura

```
js/config.js     # constantes, tipos de tijolo e power-ups
js/levels.js     # mapas dos níveis
js/paddle.js     # raquete
js/ball.js       # física e colisões da bola
js/bricks.js     # construção e dano dos tijolos
js/powerups.js   # queda e efeitos dos power-ups
js/particles.js  # partículas
js/render.js     # desenho
js/audio.js      # sons
js/input.js      # teclado, mouse, toque
js/game.js       # estados, vidas, níveis e loop
```

## Licença

MIT
