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

1. **Logotipo — ya es el original.** En las capturas aparecía como imagen rota,
   así que al principio se reconstruyó como wordmark en SVG. **Ese SVG ya se
   eliminó**: ahora se usa `assets/logo-verdfrut.png`, el archivo real del
   cliente (736×238, fondo transparente ya recortado, sin halo).

   En el footer va dentro de una caja blanca **a propósito**: el logo es verde
   oscuro y sobre `--footer-bg` (#133d20) se perdería. Si algún día hay una
   versión en blanco del logo, se puede quitar la caja.

   El logo se dimensiona con `height` y **`width:auto`** — hace falta porque los
   atributos `width`/`height` del HTML fijarían las dos dimensiones.

2. **Placeholders punteados — ya no queda ninguno.** Todos los recuadros del
   diseño original se sustituyeron por material real:

   | Hueco | Ahora |
   |---|---|
   | Foto cajas de verduras | Foto del repartidor (sección "¿Quiénes somos?") |
   | Mockup dashboard | `assets/tecnologia-dashboard.jpg` |
   | Mapa de México | `assets/cobertura-mapa.jpg`, con los 8 hubs reales |
   | Foto CTA (izquierda) | `assets/cta-ultima-milla.jpg` |
   | Clientes ideales ×6 | 4 con foto; 2 con panel de marca (ver abajo) |

   **Las seis tarjetas ya tienen foto real.** Los paneles provisionales se
   eliminaron junto con su CSS.

   La foto del hub logístico **no** se usó para "Tiendas de Conveniencia":
   muestra un centro de distribución, no una tienda, y habría sido engañosa.
   Se esperó a la foto correcta.

   > ⚠️ **La foto de Hoteles tiene mal el logotipo.** En la camioneta, el polo,
   > la gorra y la caja se lee **"Dfrut"**: le falta el "ver". Las otras cinco
   > fotos dicen "verDfrut" correctamente, así que en la misma cuadrícula el
   > error salta a la vista. Conviene regenerarla.

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
- **Móvil:** el video **también se reproduce**. Ahí el contenedor tiene casi la
  misma proporción que el video, así que `cover` no recorta nada y se vería el
  cuadro completo. La ampliación `transform:scale(1.75)` deja a la vista solo el
  **57% central (del 21% al 79% del cuadro)**, que está limpio. El póster de
  respaldo hace lo mismo con `background-size:auto 175%`.

Si cambias el alto del hero, `object-position` o ese `scale`, **revisa que no
reaparezcan**. La comprobación rápida: extraer un fotograma del video y recortar
la franja visible; si sale sin logo ni subtítulo, está bien.

### Costo en móvil

Al reproducirse también en celular, se añadieron dos frenos en `main.js`:

- **Ahorro de datos**: si `navigator.connection.saveData` está activo o la red
  es 2g, no se descargan los 2.1 MB — se queda el póster.
- **Pausa fuera de pantalla**: el video se pausa cuando el hero sale de vista,
  para no decodificar mientras el usuario lee el resto.

> El máster es de 464 px y en móvil se amplía 1.75×, así que la imagen queda
> blanda. El velo blanco del hero (opacidad .95 a .8) lo disimula casi todo,
> pero es otra razón para pedir un máster en mejor resolución.

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

### Los datos ya llegaron

El mapa real trae **ocho hubs**: Ciudad de México, Toluca, Guadalajara,
Aguascalientes, León, Guanajuato, Mérida y Campeche. Con eso la sección por fin
responde "¿llegan a donde estoy?".

La leyenda de tres colores (actual / en expansión / próximas) **se eliminó**:
el mapa real no usa ese código, así que describía algo que no existe. En su
lugar van los ocho hubs como **texto** bajo el mapa — en la imagen no se pueden
seleccionar, no los lee un buscador ni un lector de pantalla.

> ⚠️ **La imagen del mapa dice "Mérida, Yucanán".** Es *Yucatán*. En el texto de
> la página ya está corregido, pero **hay que corregir la imagen** antes de
> publicar.
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

> **Por confirmar con el cliente:**
> - **400 km**: se asumió que es el radio desde cada CEDIS. Si en realidad son
>   kilómetros de ruta al día o distancia máxima, hay que cambiar la etiqueta.
> - **99 %**: pasar de "exitosas" a "dentro de la ventana pactada" **acota la
>   promesa**. Es más creíble y más vendible, pero solo si el dato mide eso.
> - **El mockup del dashboard contradice dos datos de la página.** En su
>   pantalla se lee "Entregas a tiempo **98 %**" (la página dice 99 %) y en
>   "Entregas por zona" aparece **Monterrey**, que no es ninguno de los ocho
>   hubs del mapa. Cualquiera que compare las dos imágenes lo nota.

## El mockup va sin encuadre forzado

`.shot-wide` **no lleva `aspect-ratio`** a propósito: manda la proporción de la
imagen. Al principio se le puso 16/10 con `object-fit:cover` y le recortaba
260 px de alto al dashboard. Si se le vuelve a fijar un encuadre, se vuelve a
cortar.

Tampoco se recorta el bloque de texto de la izquierda: se intentó y no hay corte
vertical limpio — los teléfonos se superponen con ese texto, así que cortarlo
parte una palabra a la mitad. Va la imagen completa.

Como el mockup completo es más alto, la columna de tecnología crecía y volvía a
desbalancear la sección. Se compensó con `.95fr 1.05fr` y más separación entre
los ítems de la lista: quedan 589 px contra 689 px, y `align-items:center`
reparte esos 100 px arriba y abajo.

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

---

# Páginas legales

`aviso-privacidad.html` y `terminos-y-condiciones.html`. Reutilizan los tokens,
la tipografía y el footer del sitio; solo cambian a un layout de lectura de
~72 caracteres de ancho.

> ## ⚠️ Son plantillas de demostración, no documentos válidos
>
> Se escribieron **para mostrar cómo se verían las páginas**, no para publicarse.
> Ninguno ha sido revisado por un abogado. Antes de que el sitio salga a
> producción, los dos tienen que pasar por revisión legal.
>
> Cada página lleva un recuadro ámbar visible que lo advierte. **Ese bloque
> (`.legal-draft`) se borra cuando el documento esté revisado** — está marcado
> con un comentario en el HTML.

## De dónde salió el contenido

Solo se usó información que ya estaba en el sitio: giro del negocio, tipos de
cliente, correo de contacto, Ciudad de México, evidencia digital de entrega y
logística inversa. **No se inventaron datos de la empresa.**

Lo que falta va marcado en amarillo (`.legal-pendiente`) dentro del texto:
razón social completa y domicilio fiscal.

El aviso de privacidad sigue la estructura que pide la **LFPDPPP**: responsable,
datos recabados, finalidades separadas en necesarias y adicionales,
transferencias, derechos ARCO con plazos, revocación, cookies y conservación.

Los términos incluyen dos apartados propios del giro, que un contrato genérico
no traería: **revisión del producto al momento de la recepción** (por ser
perecedero, las reclamaciones posteriores sin constancia no proceden) y
**logística inversa**.

## Detalles

- Ambas llevan `noindex`: son borradores, no conviene que los indexen.
- Los enlaces del footer del sitio, que apuntaban a `#`, ya van a estas páginas.
- El teléfono ya es el real: **55 2760 0464**. Está en la banda CTA, en el
  footer del sitio y en el de las dos páginas legales.
