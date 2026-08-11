/* Единая точка входа к данным Dolmenwood Player's Book. */
export * from './util.js'
export * from './glossary.js'
export * from './classes.js'
export * from './magic.js'
export * from './goods.js'
export * from './equipment.js'
export * from './moon.js'
export * from './players.js'

import { breggle } from './kindreds/breggle.js'
import { elf } from './kindreds/elf.js'
import { grimalkin } from './kindreds/grimalkin.js'
import { human } from './kindreds/human.js'
import { mossling } from './kindreds/mossling.js'
import { woodgrue } from './kindreds/woodgrue.js'

export const KINDREDS = { breggle, elf, grimalkin, human, mossling, woodgrue }
