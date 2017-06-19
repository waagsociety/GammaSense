import { markdown } from '../../../controller'

const data = require.context('!markdown-with-front-matter!../../../../content', true, /.md$/)

export default markdown(data, [
  'introduction', 
  'gamma-radiation-explained',
  'measuring-gamma-radiation',
  'help',
  'support',
  'contribute',
  'colophon',
])