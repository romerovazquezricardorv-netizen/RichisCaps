#!/bin/bash
# Arma una escena en estilo cómic: base de francia.js (todo hasta sus escenas) + partes/<nombre>.js + render de cómic.
# Uso: ./armar.sh <nombre> <tema> [parte_comun]   (genera <nombre>.js)
set -e
cd "$(dirname "$0")"
n=$1; tema=$2
a=$(grep -n "^const SCENES = {" francia.js | head -1 | cut -d: -f1)
b=$(grep -n "^// ------------------------------------------------------------------ convertir todo" francia.js | head -1 | cut -d: -f1)
{ head -n $((a-1)) francia.js | sed -e "1,2c\\// Escena 3D generada con armar.sh: base de francia.js + partes/$n.js (estilo cómic).\n// No editar a mano: se edita partes/$n.js y se vuelve a correr ./armar.sh $n $tema" -e "s#/build/perfume_francia/timeline.json#/build/$tema/timeline.json#"
  [ -n "$3" ] && cat partes/$3.js
  cat partes/$n.js
  sed -n "$b,\$p" francia.js; } > $n.js
node --check $n.js
