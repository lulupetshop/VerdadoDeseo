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

## Otros ángulos

Tres escenas pensadas para que la carta ocupe más lugar y el texto se lea en el celular. Sirven igual en Firefly y en ChatGPT. Proporción 4:5 en todas.

En ChatGPT, adjuntar `dorso.svg` exportado a PNG y pegar esto antes de la escena:

```
Generá una fotografía realista en formato vertical 4:5. Te adjunto el dorso de las cartas de mi marca: usá exactamente ese diseño (bordó, rombos dorados y monograma V·D en un círculo) en el dorso del mazo, sin cambiar las letras ni agregar ornamentos. La carta protagonista tiene que quedar completamente en blanco, sin texto ni dibujos: el texto lo agrego yo después. No incluyas ningún otro texto, logo ni marca de agua. Escena:
```

### A · Primer plano de frente

```
Fotografía cinematográfica en clave baja, estilo claroscuro, primer plano a la altura de los ojos. Una mano adulta sostiene una sola carta de juego vertical, de frente a la cámara, perfectamente plana y derecha, que ocupa casi la mitad del encuadre. La carta está completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo. Los dedos la sujetan solo por el borde inferior, sin tapar el centro. La única fuente de luz es la llama de una vela, fuera de foco a un costado, que ilumina de lleno la carta con luz cálida y dorada. Detrás, muy desenfocados, una copa de vino tinto y un mazo de cartas de dorso bordó liso con filete dorado fino. Fondo negro puro, sin luz ambiente, contraste alto, sombras densas, lente de 85 mm, poca profundidad de campo, grano fino de película, alta resolución.
```

### B · Carta apoyada en el mazo, sin manos

```
Fotografía de producto cinematográfica en clave baja, estilo claroscuro, cámara a la altura de la mesa. Una sola carta de juego vertical está parada, apoyada contra un mazo de cartas de dorso bordó liso con filete dorado fino, de frente a la cámara, plana y derecha, en el centro del encuadre y ocupando casi la mitad de la imagen. La carta está completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo, y nada la tapa. A un costado, una vela encendida es la única fuente de luz: ilumina la carta con luz cálida y dorada y deja reflejos en dos copas de vino tinto desenfocadas al fondo. Mesa de madera casi negra, fondo negro puro, sin luz ambiente, contraste alto, sombras densas, lente de 85 mm, poca profundidad de campo, grano fino de película, alta resolución. Sin personas ni manos.
```

### C · Cenital, las dos manos de la pareja

```
Fotografía cinematográfica en clave baja, estilo claroscuro, vista cenital exacta desde arriba. En el centro de una mesa de madera casi negra hay una sola carta de juego vertical, apoyada plana y derecha, que ocupa un tercio del encuadre. La carta está completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo, y nada la tapa. Desde lados opuestos de la mesa entran dos manos adultas, una de cada persona, que rozan apenas los bordes de la carta sin cubrirla. Alrededor, un mazo de cartas de dorso bordó liso con filete dorado fino, dos copas de vino tinto y una vela encendida que es la única fuente de luz: luz cálida y dorada sobre la carta y las manos, el resto en sombra profunda. Fondo negro, sin luz ambiente, contraste alto, grano fino de película, alta resolución.
```

### D · Primer plano con silueta al fondo

Igual que la A, con una mujer adulta apenas sugerida en la penumbra. Tiene que quedar como silueta: sin cara, sin piel iluminada, sin detalle.

```
Fotografía cinematográfica en clave baja, estilo claroscuro, primer plano a la altura de los ojos. En primer plano, una mano adulta sostiene una sola carta de juego vertical, de frente a la cámara, perfectamente plana y derecha, que ocupa casi la mitad del encuadre. La carta está completamente en blanco, color rosa crema muy claro con un borde fino bordó, sin ningún texto ni dibujo; los dedos la sujetan solo por el borde inferior. Al fondo, muy desenfocada y casi fundida con la oscuridad, la silueta de una mujer adulta de pie, vista de costado, de la cintura a los hombros: es solo un contorno oscuro, recortado por un hilo de luz cálida de vela que dibuja la curva de la cintura, el hombro y el borde de encaje de una prenda de lencería. No se ve la cara ni ningún detalle del cuerpo, solo la línea del contorno. La única fuente de luz es la llama de una vela a un costado, que ilumina de lleno la carta. Sobre la mesa, desenfocados, una copa de vino tinto y un mazo de cartas de dorso bordó liso con filete dorado fino. Fondo negro puro, sin luz ambiente, contraste alto, sombras densas, lente de 85 mm, muy poca profundidad de campo, grano fino de película, alta resolución.
```

Si la herramienta bloquea "lencería", cambiar esa parte por: `el borde de encaje de un camisón corto de satén`.
