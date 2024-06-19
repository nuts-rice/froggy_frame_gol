import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import {redis} from '../lib/redis'
import {abi} from '../lib/FunFunGameOfLifeABI'
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  browserLocation: 'https://froggyframegol-nutsrices-projects.vercel.app/',
  origin: 'https://froggyframegol-nutsrices-projects.vercel.app/',

  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})
const HOST = process.env['HOST'] || 'https://froggyframegol-nutsrices-projects.vercel.app/';

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Create new board'}
        </div>
      </div>
    ),
    intents: [
      <Button.Link href='https://froggyframegol-nutsrices-projects.vercel.app/api/www/page'>New Board</Button.Link>,
    ],
  })
})
app.frame('/board', (c) => {
  // const { boardId } = c
  // const board = 
  return c.res({
    image: (
      <div
      style={{        
      alignItems: 'center',
      background: 'black',
      backgroundSize: '100% 100%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      height: '100%',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
      }}
      >
      <div
      style={{
        color: 'white',
        fontSize: 60,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        lineHeight: 1.4,
        marginTop: 30,
        padding: '0 120px',
        display: 'flex',
        whiteSpace: 'pre-wrap',
      }}
    >
    </div>
  </div>
  ),
  intents: [<Button value="Evolve">Evolve this board</Button>],
    })
})
  

// app.transaction('/evolve_tx', (c) => {
//   const {address} = c;
//   return c.contract ({
//     abi,


//   }) 
// })

app.frame('/evolve', (c) => {
  // const {boardId} = c
  return c.res({
    image: (
      <div
      style={{
        alignItems: 'center',
        background: 'black',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
      >
      <div
        style={{
          color: 'white',
          fontSize: 60,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 30,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
    >
        You evolved this board.
      </div>
      </div>
    ),
    intents: [<Button value="New Board">New Board</Button>],
      })
  })


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })
if (import.meta.env?.MODE === 'development') devtools(app, { serveStatic })  
else devtools(app, { assetsPath: '/.frog' })

export const GET = handle(app)
export const POST = handle(app)

