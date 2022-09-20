# @diegofrayo/lib/guitar

## Chords variants

```
```

/*
{ "music_notes": "6x,1|4,3,1|3,3,2|2,3,3", "played_strings": "x,0,1,1,1,0" },

{ "music_notes": "6x,6|5,8,3|4,8,4|3,7,2", "played_strings": "0,1,1,1,0,0" }

Fret, String, Finger

Fret = 1-20 + x?
String = 1-6 | [6-4]x | undefined
Finger = 1-4 | undefined
*/

Fmaj7|Fmaj7/F# two chords alternatives
%A% dont parse like chord
chord name: A A[1] A[2]
// indexes starts in 1


REGEX

(A|B|C|D|E|F|G)(m|6|7|\/|#|b|sus)?(([a-z]|[0-9]|(#|\/|°)){1,5})?
https://www.chordpro.org/chordpro/chordpro-file-format-specification/


TODO
- Diferencia entre no undefined, undefined y null
	T_Chord: barreFret? | undefined
- Falsos positivos de acordes (// TODO: % special characters) (Ando ganas)
- Test: isBlankTheLastParsedTextLine
- // TODO: Create a regex: Chords should be like this "{A}"
- // Chord (Cambiar el nombre?) Leer articulo y refinar
