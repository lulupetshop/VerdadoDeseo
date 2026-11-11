# Material para anuncios

## Cartas (`cartas/`)

Las 10 cartas de nivel 3 de la landing, en SVG de 1024 × 1430, con el texto convertido a trazos (se abren igual sin las tipografías instaladas).

- `nivel-3-NN-completa.svg`: el texto entero. Es la que se tacha a mano.
- `nivel-3-NN-censurada.svg`: una barra bordó en lugar de cada palabra explícita. La palabra no queda en el archivo.
- `dorso.svg`: el dorso con el monograma V·D.

Las cartas 07 y 08 no tienen palabras marcadas, por eso solo existen completas.

Para regenerarlas o cambiar los textos: `generar-cartas.mjs` (las instrucciones están al principio del archivo).

## Prompt para Firefly

Firefly no escribe bien textos largos y bloquea lo explícito, así que se le pide solo la escena con una carta en blanco y después se pega el SVG encima.

Ajustes: modelo Firefly Image 4 (o el más nuevo), tipo de contenido **Foto**, proporción **4:5** para feed y **9:16** para historias y reels.

```
Fotografía cinematográfica en clave baja, estilo claroscuro, vista desde arriba en ángulo de 45 grados. Escena muy oscura, casi negra: la única fuente de luz es la llama de una vela encendida, ubicada muy cerca de la carta. Una mano adulta sostiene una sola carta de juego vertical, completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo, en el centro del encuadre y bien enfocada; la luz cálida y dorada de la vela ilumina de lleno la carta y roza los dedos. Todo lo demás se pierde en sombra profunda: sobre una mesa de madera casi negra se adivinan apenas un mazo de cartas bordó con filete dorado y dos copas de vino tinto, visibles solo por los reflejos y destellos de la llama en el cristal y en el dorado. Fondo negro puro, sin luz ambiente ni luz de relleno, caída de luz rápida, contraste alto, sombras densas, halo cálido alrededor de la llama, subexpuesta, grano fino de película, lente de 50 mm, poca profundidad de campo, alta resolución.
```

Qué evitar (pegarlo en el campo de exclusión si aparece; si no, agregarlo al final con "Sin:"):

```
luz de día, luz de ventana, luz ambiente, luz pareja, luz de estudio, fondo iluminado, paredes visibles, cortinas, muebles, luz fría, texto, letras, números, logos, marcas de agua, caras, desnudez, lencería, manos deformes, dedos de más, varias cartas en la mano, naipes de póker
```

En el panel de Firefly: Efectos → Iluminación **Poca luz** (o **Luz dramática**) y Color y tono **Tono cálido**. Si una imagen ya gustó por la composición, subirla como **referencia de composición** y generar de nuevo con este prompt: mantiene el encuadre y cambia la luz.

Variante sin mano (más fácil de componer):

```
Fotografía de producto cinematográfica, vista cenital: una sola carta de juego vertical, completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo, apoyada plana y derecha en el centro de una mesa de madera oscura. Alrededor, un mazo de cartas bordó con filete dorado, dos copas de vino tinto y una vela encendida. Luz cálida de vela, penumbra, fondo negro y bordó profundo, reflejos dorados suaves, ambiente íntimo y elegante estilo noir, grano fino de película, alta resolución.
```
