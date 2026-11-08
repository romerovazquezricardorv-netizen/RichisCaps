"""Tema: el perfume más antiguo del mundo que todavía se vende (cuenta regresiva de 3 candidatos).

Datos (revisados):
- Jicky de Guerlain, 1889: suele citarse como el perfume más antiguo en producción continua (sin contar colonias)
  y uno de los primeros con materias primas sintéticas.
- Agua de Colonia original de Farina, 1709, Colonia (Alemania): dio nombre a la "colonia"; la empresa se considera
  la fábrica de perfumes más antigua que sigue funcionando.
- Acqua della Regina de Santa Maria Novella (Florencia), 1533: según la marca y la tradición, creada para
  Catalina de Médici al casarse con el futuro Enrique II de Francia. Es leyenda, sin documentación independiente.
"""

ESCENA = "historia.js"
SALIDA = "perfume-mas-antiguo.mp4"

GUION = [
    ("gancho", ["¿Cuál es el perfume *más antiguo*", "del mundo que todavía puedes{q} *comprar hoy*?"]),
    ("intro", ["La respuesta depende de a quién le preguntes,", "así que vamos con los *tres*{tres} candidatos."]),
    ("jicky", ["En *tercer lugar*{n3}:", "*Jicky*, de Guerlain,", "creado en *1889*{y}."]),
    ("jicky2", ["Es el perfume moderno *más antiguo*", "que se sigue fabricando,", "y uno de los primeros en usar",
                "ingredientes *sintéticos*{sint}."]),
    ("farina", ["En *segundo lugar*{n2}:", "el *Agua de Colonia* original de Farina,", "de *1709*{y}."]),
    ("farina2", ["Un perfumista italiano en Colonia, Alemania,", "creó un aroma que, según él,",
                 "le recordaba una *mañana de primavera*{prim} en Italia."]),
    ("farina3", ["Le puso el nombre de su ciudad...", "y así nació la palabra *colonia*{col}.",
                 "Su fábrica sigue *abierta*{fab} hasta hoy."]),
    ("reina", ["Y en *primer lugar*{n1}, según la leyenda:", "el *Agua de la Reina*,", "de Santa María Novella, en Florencia."]),
    ("reina2", ["Se dice que fue creada en *1533*{y}", "para *Catalina de Médici*{cat},",
                "cuando se casó con el futuro rey de Francia."]),
    ("reina3", ["Casi *500 años*{qui} después,", "se sigue vendiendo."]),
    ("final", ["¿Y tú,", "*cuál*{cual} de los tres probarías?"]),
]
DICHO = {"1889": "mil ochocientos ochenta y nueve", "1709": "mil setecientos nueve", "1533": "mil quinientos treinta y tres",
         "500": "quinientos", "Jicky": "Yiki", "Guerlain": "Guerlán"}

PILDORAS = {
    "jicky": [("y", "Jicky · Guerlain", "1889 · París")],
    "jicky2": [("sint", "Moléculas sintéticas", "creadas en laboratorio")],
    "farina": [("y", "Agua de Colonia · Farina", "1709 · Colonia, Alemania")],
    "farina2": [("prim", "«Una mañana de primavera en Italia»", None)],
    "farina3": [("col", "Colonia = Köln", "la ciudad alemana"), ("fab", "Abierta desde 1709", "la fábrica más antigua")],
    "reina": [("n1", "Acqua della Regina", "Santa Maria Novella · Florencia")],
    "reina2": [("y", "1533", "para Catalina de Médici · según la leyenda")],
    "reina3": [("qui", "≈ 500 años", "y se sigue vendiendo")],
}


def efectos(segs):
    ev = []
    for esc, c in (("jicky", "n3"), ("farina", "n2"), ("reina", "n1")):
        ev.append((segs[esc]["cues"][c], "boom", None))
    for esc in ("jicky", "farina", "reina2"):
        ev.append((segs[esc]["cues"]["y"] + 0.05, "tin", 0))
    ev += [(segs["intro"]["cues"]["tres"], "tin", 1), (segs["farina3"]["cues"]["col"], "tin", 2),
           (segs["reina2"]["cues"]["cat"], "tin", 3), (segs["final"]["cues"]["cual"], "boom", None),
           (segs["farina2"]["start"] + 0.3, "spray", None)]
    return ev
