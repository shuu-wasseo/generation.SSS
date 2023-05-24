import Dimension from './Dimension'
import Challenge from './Challenge'
import Story from './Story'

export function format(num) {
  num = Math.round(num * 1000)/1000
  const str = num.toString()
  if (num >= 1000) {
    return num.toExponential(3).replace("+", "")
  } else {
    return str
  }
}
export function price(type, num) {
  const bought = JSON.parse(localStorage.getItem('dimensions'))[type][num.toString()].bought
  return 2 ** (num * (num + bought))
}

export function maxdim() {
  const dims = JSON.parse(localStorage.getItem('dimensions'));

  /* number of dimensions to render */
  for (let d = 1; d <= 24; d++) {
    if (!dims["S"][d.toString()].total) {
      return d
    }
  }
}

export function tick(tickspeed) {
  const dims = JSON.parse(localStorage.getItem('dimensions'));
  const currency = JSON.parse(localStorage.getItem('currency'));

  for (const dim in dims) {
  
    const maxDim = maxdim()
    const boosts = (maxDim ** maxDim)
    currency[dim] += Number(dims[dim]["1"].total) * boosts / 1000 * tickspeed

    for (const gen in dims[dim]) {
      if (gen < 24) {
        const boosts = (25/24) ** dims[dim][Number(gen).toString()].bought
        dims[dim][gen].total += Number(dims[dim][(Number(gen) + 1).toString()].total) * boosts / 1000 * tickspeed
      }
    }
  }

  localStorage.setItem('dimensions', JSON.stringify(dims))
  localStorage.setItem('currency', JSON.stringify(currency))

  return currency.S
}

export function getSubTabs(tab) {
  switch(tab) {
    case 0:
      return ["S", "como"]
    case 1:
      return ["grand gravity"]
    case 2:
      return ["part 1"]
    case 3:
      return ["keybinds", "colors", "misc"]
    case 4:
      return ["credits", "about tripleS", "cast"]
    default:
      return
  }
}

export function renderTab(tab, subtab, renderDim) {
  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))

  switch(tab) {
    case 0:
      return [...Array(renderDim).keys()].map(i =>{
        return <Dimension type={getSubTabs(tab)[subtab]} num={i+1} tickspeed={tickspeed} />
      })
    case 1:
      return <div class="grid"> {
        [...Array(8).keys()].map(i =>{
          return <Challenge type={getSubTabs(tab)[subtab]} num={i+1} />
        })
      } </div>
    case 2:
      return
    default:
      return
  }
}
