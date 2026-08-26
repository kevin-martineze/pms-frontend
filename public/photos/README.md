# Fotografía de la demo

Las imágenes de esta carpeta **no están versionadas**. Son fotos privadas de una
propiedad real y este repositorio es público, así que viven sólo en la máquina de
desarrollo.

Sin ellas la aplicación arranca y navega igual; lo único que se rompe son los
`<Image>` del sitio del huésped.

## Archivos que espera la demo

Cualquier JPEG sirve. Los nombres sí importan: están referenciados desde
`src/lib/mock/property.ts` y desde las páginas de `pool-club` y `sports-bar`.

| Archivo | Dónde aparece |
| --- | --- |
| `property-exterior.jpg` | Hero de la portada, tarjetas de varias unidades |
| `pool-sunset.jpg` | Hero del pool club, galería de la suite y de Casa Palma |
| `suite-living.jpg` | Suite Vista al Mar — foto principal |
| `suite-bath.jpg` | Suite Vista al Mar — galería |
| `family-room.jpg` | Habitación Familiar — foto principal |
| `twin-room.jpg` | Habitación Familiar y Clásica — galería |
| `garden-living.jpg` | Habitación Jardín — foto principal |
| `mola-room.jpg` | Habitación Jardín y Bungalow Palmar |
| `classic-room.jpg` | Habitación Clásica — foto principal |
| `bar-front.jpg` | Hero del sports bar |
| `bar-1.jpg` … `bar-5.jpg` | Galería del sports bar y tarjeta de la portada |
| `villa-1.jpg` … `villa-3.jpg`, `villa-kitchen.jpg` | Casa Tony |
| `casa-1.jpg` … `casa-7.jpg` | Casa Palma |
| `brand-art.jpg` | Página de propuesta |
| `repaint-options.jpg` | Sin usar por ahora — opciones de repintado |

## Reemplazarlas

Al llegar la fotografía definitiva (después del repintado de septiembre), se
sustituyen aquí con los mismos nombres y no hay que tocar código. El texto
alternativo sí vive en `src/lib/mock/property.ts` y hay que actualizarlo: cada
foto lo lleva obligatorio, y describe lo que se ve, no el nombre del archivo.
