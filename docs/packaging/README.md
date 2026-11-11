# Estuche del mazo

Propuesta de caja para el mazo físico: estuche de cartulina con solapa (tipo naipes), con la identidad de la portada.

| | |
|---|---|
| Medida | 65 × 90 × 20 mm (ancho × alto × fondo) |
| Para | 60 cartas de 63 × 88 mm |
| Colores | Negro, bordó `#8c1c3a`, dorado `#e3b465`, crema `#f6eadb` |
| Tipografías | Cormorant Garamond y Manrope, convertidas a trazos |

## Archivos

- `caja/troquel.svg`: plano completo en milímetros, con 3 mm de sangrado. Corte en magenta, pliegues en celeste punteado. Las líneas están en el grupo `troquel` y el arte en el grupo `arte`, para separarlos en capas.
- `caja/frente.svg`, `dorso.svg`, `lateral-derecho.svg`, `lateral-izquierdo.svg`, `tapa-superior.svg`, `tapa-inferior.svg`: cada cara suelta.
- `vista-3d.jpg` y `vista-plano.jpg`: vistas previas.
- `generar-caja.mjs`: genera todo. Las medidas y los textos están al principio del archivo.

## A confirmar antes de imprimir

- **Fondo de 20 mm.** Depende del gramaje de las cartas: 60 cartas de 300 g miden unos 18 mm; con otro papel cambia.
- **Troquel de la imprenta.** Cada imprenta usa el suyo. Este plano sirve para aprobar el diseño y como base; el arte se acomoda sobre el troquel que ellos pasen.
- **Dorado.** Está como color plano. Si se quiere stamping o tinta metalizada, va como tinta aparte.
- **Cantidad de cartas.** La caja dice 60, igual que la landing; el brief lo tiene como número a confirmar.
- **Datos legales.** No hay web, contacto, país de origen ni código de barras: el dorso tiene lugar si hacen falta.
