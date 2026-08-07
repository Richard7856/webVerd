# VERDFRUT — réplica del sitio

Réplica hecha a partir de las 5 capturas de pantalla de la carpeta.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura completa + sprite SVG de iconos (estilo lucide) |
| `styles.css` | Todos los estilos. Los tokens de marca están arriba, en `:root` |
| `main.js` | Menú móvil, altura del header, revelado al scroll, conteo de cifras y enlace activo |
| `assets/hero-fondo.mp4` | Fondo de video del hero — 12 s, 2.1 MB, en bucle y sin sonido |
| `assets/hero-fondo.jpg` | Póster del video (móvil, autoplay bloqueado, reducir movimiento) |
| `assets/hero-reparto.jpg` | Foto del repartidor, en la sección "¿Quiénes somos?" |
| `assets/frutas/*.png` | Los 4 personajes recortados que se asoman entre secciones |
| `.claude/launch.json` | Servidor local de previsualización |

Para verlo: abrir `index.html` con doble clic, o levantar un servidor:

```bash
python3 -m http.server 8765
```

## Paleta (muestreada pixel a pixel de las capturas)

| Token | Valor | Uso |
|---|---|---|
| `--green` | `#2f9e44` | Color de marca: botones, títulos destacados, iconos |
| `--green-pale` | `#eef7f0` | Fondo de los círculos de icono |
| `--green-pale-2` | `#bfe3c6` | Punto "Próximas expansiones" |
| `--orange` | `#f5871e` | Punto "En expansión" |
| `--orange-a` → `--orange-b` | `#e77e10` → `#f9a824` | Degradado de la banda CTA |
| `--ink` | `#1f2937` | Títulos de sección |
| `--ink-green` | `#3f4a3f` | H1 del hero y navegación |
| `--body` / `--body-soft` | `#5b665b` / `#6b756b` | Texto corrido |
| `--bg-alt` | `#f6f8f6` | Fondo de secciones alternas |
| `--footer-bg` | `#133d20` | Footer |

Tipografía: **Outfit** (Google Fonts), pesos 300–800. Se comparó contra las
capturas y coincide con el original.

## Decisiones que conviene revisar

1. **Logotipo.** En las capturas el logo aparece como imagen rota (recuadro con
   "?"). Se reconstruyó como wordmark en SVG inline copiando la marca del camión
   de la foto: "ver"/"frut" en verde olivo, "D" en naranja y hoja verde. Los
   colores son `--wm-green` y `--wm-orange` en `styles.css`. Si existe el archivo
   original del logo, se sustituye ahí.

2. **Placeholders punteados.** Los recuadros con línea punteada ("Foto: cajas de
   verduras…" —ya sustituido por la foto del repartidor—, "Mapa de México…",
   "Mockup: dashboard…") son parte del diseño original y se replicaron tal cual.
   Los que quedan siguen esperando material real.

3. **Caja "Drop an image" del footer.** No se replicó: es la zona de arrastre del
   editor de artifacts, no parte del diseño. Si se quiere un espacio de imagen
   real ahí, se agrega en un minuto.

4. **Añadido (no estaba visible en las capturas):** layout responsive completo,
   menú hamburguesa en móvil y resaltado automático del enlace de navegación
   según la sección visible — las capturas mostraban "INICIO" en estado activo,
   así que se implementó el comportamiento.

---

# Fondo de video del hero

## Qué se hizo con `fondo.mp4`

El original: **464×832 (vertical), 62.7 s, 11.3 MB**. Es un reel de redes
sociales con **logo VERDFRUT incrustado** arriba a la derecha y **subtítulos
quemados** abajo ("PROCESO DE DESCARGA", "CALIDAD PARA NUESTROS CLIENTES"…),
más una placa crema al inicio y una verde al final.

Se recortó al tramo **36–48 s** (aguacates → piñas sobre fondo verde → limones
en reja). Se eligió ese tramo comparando cómo queda la **franja central** de
cada momento, que es lo único que se ve en un hero apaisado: otros tramos caen
sobre un primer plano de una mano o sobre la playera de alguien y no se leen
como producto.

Resultado: **12 s, 2.1 MB**, en bucle, sin sonido.

## Cómo se resuelven el logo y los subtítulos incrustados

No se borran, se dejan fuera de cuadro:

- **Escritorio:** `object-fit:cover` sobre un hero apaisado muestra solo ~27 %
  del alto del cuadro, centrado en `46 %`. El logo vive en el 7 % superior y el
  subtítulo entre el 84 % y el 95 %: ambos quedan fuera.
- **Móvil:** ahí `cover` mostraría casi todo el cuadro, así que el póster se
  amplía con `background-size:auto 175%` para forzar la misma franja limpia.

Si cambias el alto del hero o `object-position`, **revisa que no reaparezcan**.

## Altura y desenfoque

- **Hero a pantalla completa.** `min-height:calc(100svh - var(--header-h))`, con
  el contenido centrado. `main.js` sincroniza `--header-h` con la altura real
  del header (87.4 px en escritorio, cambia al reflowear el logo), así que
  header + hero suman exactamente una pantalla. Es `min-height`, no `height`:
  en pantallas bajas el hero crece en lugar de recortar el texto.

- **Desenfoque en degradado.** Ya no es uniforme: va de 1 px a la izquierda,
  donde vive el texto y hace falta disimular el reescalado, hasta **0 a partir
  del 80 % del ancho**, donde la imagen se ve limpia. Se hace con
  `backdrop-filter` + `mask-image` sobre `.hero-blur`, lo que evita decodificar
  el video dos veces. En móvil se desactiva: el degradado es horizontal y ahí el
  texto ocupa todo el ancho.

## Dos variantes, las dos probadas

- **Clara (activa).** Velo blanco en degradado; conserva intactos los colores y
  la tipografía del diseño aprobado. El video se ve sobre todo del centro a la
  derecha.
- **Oscura / cinematográfica.** Añade la clase en el HTML:
  `<section class="hero hero-dark">`. Titular en blanco, acento verde claro,
  botón secundario en outline blanco. Más impacto, se aleja más de lo aprobado.

## Respaldos automáticos

El video nunca deja un hueco: cae al póster estático en móvil, con
`prefers-reduced-motion`, y si el navegador bloquea el autoplay (`main.js`
detecta el rechazo de `play()` y añade `.is-static`).

## Lo que conviene pedirle al equipo (video)

El máster es de **464 px de ancho** y hay que estirarlo a 1512 px o más: se
compensa con un desenfoque de 1 px y el velo, pero de cerca se nota blando.
**Un máster apaisado (16:9, 1920×1080) y sin logo ni subtítulos quemados
resolvería las dos cosas de golpe** y sería un cambio de un solo archivo.

---

# Movimiento, espacios y accesibilidad

## Criterio

La paleta, la tipografía y el layout ya estaban aprobados, así que **no se
tocaron**. El trabajo fue sobre los huecos: la foto, el movimiento, el ritmo
vertical y el teclado.

En movimiento se buscó lo contrario de "animar todo": un gesto único y
consistente. Todo usa la misma curva (`--ease`), la misma distancia (20 px) y
la misma duración (0.65 s). El escalonado solo aparece donde el orden significa
algo — el proceso, que sí es una secuencia; las tarjetas de una grilla.

## Revelado al hacer scroll

Los bloques se declaran en `main.js` (`REVEAL_SINGLE` y `REVEAL_GROUP`), no con
atributos repartidos por el HTML: se cambia la lista en un solo lugar.

Dos protecciones, ambas verificadas:

- **Si el JS no corre**, el contenido queda visible. Las reglas van bajo `.js`,
  clase que añade un script en el `<head>`. Sin ella, opacidad 1.
- **Con "reducir movimiento" del sistema**, no hay ni opacidad 0: las reglas
  viven dentro de `@media (prefers-reduced-motion: no-preference)` y `main.js`
  ni siquiera añade los atributos. Además hay un bloque final que anula
  transiciones, animaciones y scroll suave.

El observador hace `unobserve` al revelar: el bloque no vuelve a animarse al
subir, que es lo que suele volverlo molesto.

## Velocidad del revelado

La duración y el escalonado son variables (`--rev-dur` y `--rev-step`), así que
se pueden ajustar por bloque sin tocar el sistema. El **proceso de 8 pasos va un
20 % más lento** que el resto (`.78s` / `.072s` en vez de `.65s` / `.06s`):
son una secuencia y conviene que se lea el orden. La animación completa pasó de
1.49 s a 1.79 s.

## "Tecnología que te da visibilidad total"

Con la lista de "¿Por qué elegirnos?" en 2×4, esa columna medía **307 px contra
521 px** de la columna de tecnología: 214 px de hueco muerto debajo. Centrarla
solo habría repartido el vacío arriba y abajo.

La solución fue **pasar la lista a una sola columna y estrecharla** (`.78fr` /
`1.22fr`): sube a ~547 px y las dos terminan con 23 px de diferencia, así que el
hueco desaparece en vez de moverse. De paso el panel de tecnología pasó de 622 a
**742 px de ancho**, que es donde va a ir el mockup real.

Al apilarse (≤1080 px) la lista vuelve a dos columnas y el eyebrow a centrado:
a lo ancho completo, una sola columna dejaría filas larguísimas.

## Conteo de cifras

Los números de "Números que nos respaldan" cuentan desde 0 al entrar en
pantalla (`easeOutCubic`, 1.1 s). Las cifras llevan
`font-variant-numeric:tabular-nums` para que la tarjeta no se reacomode
mientras cuentan.

## Ancho del contenido

`--container` pasó de **1140px a 1280px** y el canalón quedó en 40px por lado.
En escritorio el margen lateral no lo fijaba el padding sino el ancho máximo,
así que ese era el valor a mover: a 1512px el margen bajó de 186px a **116px**
y la foto del repartidor pasó de 393×492 a **446×558**.

Las dos reglas conviven a propósito: por encima de ~1360px manda `--container`
(márgenes estrechos, foto grande); por debajo manda el canalón de 40px, que da
más aire que los 32px que había antes. Se cambió en el contenedor global, no
solo en esa sección, para que el borde izquierdo de todas las secciones siga
alineado — comprobado: un único valor para todas.

## Transiciones entre secciones

Las secciones alternas ya no son una banda plana con dos líneas rectas: entran
y salen del blanco con un fundido de **180 px en cada borde**, así que la junta
es blanco puro y el cambio se lee como transición. La medida es fija y no un
porcentaje, para que el fundido sea igual de suave en una sección corta que en
una larga. El hero también se funde a blanco en sus últimos 130 px, para que el
video no termine en una línea recta.

**Lo que no hay que hacer aquí:** añadir un halo radial en la junta. Se probó y
el resultado fue peor — un radial está a máxima intensidad justo en el borde,
así que en vez de disolver la línea la vuelve a dibujar. Cualquier capa que se
añada sobre el degradado tiene que valer cero exactamente en el borde.

La banda naranja del CTA y el footer **conservan el corte duro a propósito**:
son bloques de acento que deben interrumpir. Suavizarlos les quita la fuerza.

## Cobertura, reestructurada

Se sentía genérica por tres cosas concretas, no por estilo:

1. **La leyenda de colores vivía en la columna de texto**, lejos del mapa que
   explica. Era una clave sin gráfico al lado: prometía especificidad y no la
   entregaba. Ahora va debajo del mapa y en horizontal, que es su lugar.
2. **El párrafo no decía nada** ("Seguimos creciendo para estar cada vez más
   cerca de nuestros clientes"). Se reemplazó por una idea que la propia página
   ya sostiene en la tarjeta de HUBs: que las zonas nuevas las abre el
   crecimiento del cliente.
3. **No había nada que hacer**, solo leer. Se añadió "¿No ves tu zona?" que
   lleva a contacto — que es justo la pregunta que trae al comprador aquí.

También: el título pasó de verde a la jerarquía normal (eyebrow verde + h2
oscuro), como el resto de las secciones, y las cifras pasaron a 2×2 para que la
columna equilibre al mapa (550 px contra 526 px).

> **Lo que de verdad va a quitarle lo genérico no es diseño: son los datos.**
> Una sección de cobertura sin nombres de estados o ciudades está vacía por
> definición. Falta decidir qué estados van en cada color de la leyenda y
> encargar el mapa. Hasta que eso llegue, la sección está estructurada para
> recibirlo, pero sigue sin responder "¿llegan a donde estoy?".
>
### Las cuatro cifras

Se reescribieron las etiquetas para que **cada una diga qué mide**. Los números
son los originales: no se inventó ninguno.

| Antes | Ahora | Por qué |
|---|---|---|
| 75+ · Tiendas en expansión | 75+ · **Puntos de entrega atendidos** | No se entendía si eran tiendas ya atendidas o planeadas. "Puntos de entrega" además cubre restaurantes y hoteles, no solo tiendas |
| 99 % · Entregas exitosas | 99 % · **Entregas dentro de la ventana pactada** | "Exitosa" no es medible. ¿Llegó, llegó a tiempo, llegó completa? |
| 400 km · Cobertura logística | 400 km · **Radio de entrega desde cada CEDIS** | 400 km sin unidad de referencia no dice nada |
| 100 % · Trazabilidad total | 100 % · **Entregas con evidencia digital** | "100 %" y "total" decían lo mismo; y era una capacidad, no una métrica. Ahora es verificable y engancha con la sección de tecnología |

Los iconos se ajustaron a la nueva etiqueta (reloj para la ventana de entrega,
móvil para la evidencia digital) y el orden pone primero las dos que más le
importan al comprador.

> **Dos cosas por confirmar con el cliente:**
> - **400 km**: se asumió que es el radio desde cada CEDIS. Si en realidad son
>   kilómetros de ruta al día o distancia máxima, hay que cambiar la etiqueta.
> - **99 %**: pasar de "exitosas" a "dentro de la ventana pactada" **acota la
>   promesa**. Es más creíble y más vendible, pero solo si el dato mide eso.

## "Clientes ideales": texto visible, no modal

Se evaluó abrir una ventana al hacer clic en cada tarjeta y **se descartó**:

- Lo que queda detrás de un clic casi nadie lo ve. La sección se escanea y su
  único trabajo es que el prospecto se auto-identifique en un segundo.
- Un modal interrumpe el scroll hacia el CTA, que es a donde va la página.
- Seis modales implican trampa de foco, cierre con Escape, bloqueo de scroll y
  `aria-modal`: mucho trabajo para contenido que la mayoría no abrirá.

En su lugar, **una línea de apoyo visible por tarjeta**. Para que quepa hubo que
pasar de 6 tarjetas en fila a **3×2**: con 6 quedaban ~195px cada una y
cualquier frase se partía en cuatro renglones; a 3 columnas son ~412px y entra
en dos. En móvil va una por fila (a dos quedaban 156px y se partía en ocho).

> **Los textos son un borrador y hay que validarlos con el cliente.** Están
> escritos recombinando lo que la propia página ya afirma (entregas programadas,
> evidencia digital, trazabilidad, KPIs, cobertura) para no inventar promesas
> nuevas, pero no salen de un brief.

Si más adelante quieren profundidad por segmento, lo que conviene no es un modal
sino una landing por segmento: sirve igual para campañas y para buscadores.

## Breakpoint propio para el header

El header deja de caber **antes** que el resto del layout: entre 900 px y
~1060 px la navegación completa más el botón se salían del contenedor y
provocaban scroll horizontal. Por eso el menú compacto entra en su propio
`@media (max-width:1080px)` y no arrastra a los demás breakpoints, que siguen
en 900 px. A 1100 px la nav cabe justa (el botón termina en 1060, el borde del
contenedor), así que 1080 es el punto correcto.

## Espaciado

Se sustituyeron los márgenes sueltos por una escala (`--sp-1`…`--sp-7`) y un
ritmo de sección elástico: `--section-y: clamp(72px, 7.5vw, 108px)`.
"Proceso" y "¿Por qué elegirnos?" se separan con **medio** ritmo, porque son la
misma unidad narrativa y con el ritmo completo se leían como dos temas.

## Accesibilidad

- **Foco visible**: no existía ninguno; navegar con teclado era invisible.
  Ahora hay contorno verde de 2.5 px, en blanco sobre los fondos oscuros.
- **Salto al contenido**: primer tabulador de la página.
- `aria-current` en el enlace de navegación de la sección activa.
- `alt` descriptivo en la foto del reparto.
- `text-wrap:balance` en los títulos, para que no quede una palabra huérfana.

## Un bug que apareció al hacer esto

La foto se renderizaba **335×851** ignorando su `aspect-ratio`. Los atributos
`width`/`height` del HTML —que se ponen justamente para evitar el salto de
layout al cargar— fijan las dos dimensiones, y `aspect-ratio` solo actúa si una
de ellas es automática. Se resolvió con `height:auto`. Si añades más imágenes
con atributos de tamaño, van a necesitar lo mismo.

---

# Frutas que se asoman

## De dónde salieron los recortes

Las tres imágenes originales (generadas con Gemini, 2816×1536, 4–6 MB cada una)
llegaron con **fondo blanco opaco, sin transparencia real** — el damero que se
ve en la vista previa de una de ellas es del visor, no del archivo. Además la
tercera traía **piña y manzana en una sola imagen**, superpuestas.

El recorte se hizo con una inundación desde los bordes, no con un
"blanco → transparente" global: así se conservan los brillos blancos de los
ojos y los pétalos claros de la flor, que un reemplazo global habría borrado.
Después se erosiona el halo de antialiasing y se conserva solo el componente
conectado más grande, lo que elimina los trazos sueltos del original.

Separar piña y manzana fue lo más delicado: **se tocan** (el brazo de la piña
queda por detrás de la manzana), así que no se pueden partir por componentes ni
por un corte recto. Se cortó por la columna con menos píxeles y luego se filtró
por color en la franja de solape. La clave: el rojo de la manzana tiene verde y
azul **bajos y parecidos entre sí**, mientras que el naranja de la piña tiene el
verde muy por encima del azul. Distinguirlos por "es rojizo" a secas no
funciona — se come el sombreado de la piña.

Resultado: `assets/frutas/{pera,aguacate,pina,manzana}.png`, 300 px de alto,
**356 KB las cuatro**.

## El efecto

Viven al final de "¿Quiénes somos?", que lleva `overflow:hidden`. Cada fruta
está posicionada con `translateY(100%)`: queda **por debajo del borde inferior
de la sección y por tanto recortada**, como si se escondiera detrás de la
siguiente. Al animarse sube hasta `var(--asoma)` y aparece.

**Cuánto asoma cada una no es igual, y es a propósito.** El valor `--asoma`
dice cuánto queda escondido, así que menor = asoma más:

| Fruta | `--asoma` | Visible | Por qué |
|---|---|---|---|
| Pera | 32 % | 68 % | La cara está al 35–51 % de su imagen |
| Aguacate | 32 % | 68 % | Igual que la pera |
| Piña | 18 % | 82 % | El 40 % superior de su imagen es corona; su cara está al 60–73 % |
| Manzana | 22 % | 78 % | El 30 % superior es tallo y hoja; su cara está al 49–69 % |

Con un valor único, de la piña solo se veían las hojas y de la manzana el
tallo. La sección lleva `padding-bottom:max(var(--section-y), 132px)` para que
quepan sin invadir el contenido: la que más sube ocupa 109 px.

Son ocasionales de verdad: el ciclo dura 21 s y cada fruta solo está arriba
entre el 16 % y el 30 % de su ciclo. Con retrasos de 0 / 5.2 / 10.4 / 15.6 s se
turnan y casi nunca coinciden. Cada una tiene su propia inclinación y altura
para que no se lean como copias.

- **Solo animan en pantalla**: un IntersectionObserver pone y quita `.is-live`,
  así fuera de vista no gastan CPU ni batería.
- **Con "reducir movimiento"** no se animan: se quedan asomadas y quietas.
- **En móvil** quedan dos (pera y manzana) y más chicas; cuatro saturaban.
- Son decorativas: `aria-hidden` y `alt` vacío, no las anuncia el lector.

## Para ajustar

Todo está en `.p-pera`, `.p-aguacate`, `.p-pina` y `.p-manzana` en
`styles.css`: `left`/`right` mueven la posición, `--alto` el tamaño, `--giro`
la inclinación y `--retraso` el turno. La frecuencia se cambia en un solo
sitio: la duración de la animación en `.peekers.is-live .peeker`.
