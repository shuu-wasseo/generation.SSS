import Dimension from '../tabs/dimensions/Dimension'
import Challenge from '../tabs/challenges/Challenge'
import Story from '../tabs/story/Story'
import ColorInput from '../tabs/settings/ColorInput'
import { buyDim } from '../tabs/dimensions/Dimension'
import { autostory } from '../extra/StoryPopup'
import { grandGravity } from '../extra/prestige'

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
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'));
  const bought = JSON.parse(localStorage.getItem('dimensions'))[type][num].bought
  const base = (inChallenge["grand gravity"] === 5 && type === "S") ? 3 : 2
  return base ** ((num * (num + bought)))
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
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'));
  const times = JSON.parse(localStorage.getItem('times'));
  const ggc6 = JSON.parse(localStorage.getItem('ggc6'));

  const generatedCurrency = {
    S: "S",
    como: "comoDust"
  }

  for (const dim of ["S", "como"]) {
    const maxDim = maxdim()
    const boosts = (maxDim ** maxDim)
    let defCurrencyGain = Number(dims[dim][1].total) * boosts / 1000 * tickspeed
    if (currency.comoDust) {
      defCurrencyGain *= (currency.comoDust ** (1/24))
    }
    if (inChallenge["grand gravity"] === 2) {
      defCurrencyGain *= (24 ** ((Date.now() - times["grand gravity"])/1000000)) * 1/24
    } else if (inChallenge["grand gravity"] === 6) {
      defCurrencyGain *= ggc6[0]
    }
    currency[generatedCurrency[dim]] += defCurrencyGain
    if (currency[generatedCurrency[dim]] > 24**24 && dim === "S") {
      currency[generatedCurrency[dim]] = 24**24
    }
    
    for (const gen in dims[dim]) {
      if (gen < 24 && gen <= maxdim()) {
        const boosts = (25/24) ** dims[dim][Number(gen).toString()].bought
        let next = Number(gen) + 1
        switch (inChallenge["grand gravity"]) {
          case 7:
            next = Number(gen) + 2
            break
          case 8:
            let list = [3, 5, 4, 6, 7, 0, 8, 0]
            next = list[gen - 1]
            break
          default:
            next = Number(gen) + 1
        }
        if (next) {
          let defGain = Number(dims[dim][(next).toString()].total) * boosts / 1000 * tickspeed
          if (inChallenge["grand gravity"] === 6) {
            defCurrencyGain *= ggc6[gen]
          }
          dims[dim][gen].total += defGain
        }
      }
    }
  }

  localStorage.setItem('dimensions', JSON.stringify(dims))
  localStorage.setItem('currency', JSON.stringify(currency))
}

export function autobuy() {
  const autobuyers = JSON.parse(localStorage.getItem('autobuyers'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))

  let dims = ["S", "como"]
  let clss = ["first class"]

  for (var j = 0; j < 1; j++) {
    for (var i in objekts["atom"][clss[j]]) {
      if (Date.now() - autobuyers[dims[j]][i] >= 2 ** (9 - objekts["atom"][clss[j]][i].length)) {
        buyDim(dims[j], i, true)
      }
    }
  }
}

export function getSubTabs(tab) {
  const subTabs = [
    ["S", "como"],
    ["grand gravity"],
    ["single class", "double class"],
    ["part 1"],
    ["colors"],
    ["credits", "about tripleS", "cast"],
    []
  ]
  return subTabs[tab]
}

export function renderTab(tab, subtab, renderDim) {
  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))
  const currency = JSON.parse(localStorage.getItem('currency'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))

  function reset_colors() {
      const colors = {
        s1 : "#22aeff",
        s2 : "#9200ff",
        s3 : "#fff800",
        s4 : "#98f21d",
        s5 : "#d80d76",
        s6 : "#ff7fa4",
        s7 : "#729ba1",
        s8 : "#ffe3e2",
        s9 : "#ffc931",
        s10 : "#fb98dc",
        s11 : "#ffe000",
        s12 : "#5975fd",
        s13 : "#ff953f",
        s14 : "#1222b5"
      }
      localStorage.setItem('colors', JSON.stringify(colors))
  }

  if (currency.S < 24**24) {
    switch(tab) {
      case 0:
        let limit = 8
        if (inChallenge["grand gravity"] === 4) {
          limit = 6
        }
        return (
          <div>
            {[...Array(renderDim < limit ? renderDim : limit).keys()].map(i => {
              return <Dimension type={getSubTabs(tab)[subtab]} num={i+1} tickspeed={tickspeed} />
            })}
          </div>
        )
      case 1:
        return <div className="challenge-grid"> {
          [...Array(8).keys()].map(i => {
            return <Challenge type={getSubTabs(tab)[subtab]} num={i+1} />
          })
        } </div>
      case 3:
        return [...Array(autostory()[0]+1).keys()].map(i => {
          return <Story num={i} />
        }) 
      case 4:
        switch (subtab) {
          case 0:
            return (
              <div>
                {[...Array(24).keys()].map(i => {
                  return (
                    <ColorInput s={i+1} />
                  )
                })}
                <button onClick={reset_colors} className="center">reset</button>
              </div>
            )
          default:
            break
        }
        break
      default:
        return
    }
  } else {
    return (
      <div className="grandgrav">
        <h1>boom!</h1>
        <h2>too much S!</h2>
        <button onClick={grandGravity}>grand gravity!</button>
      </div>
    )
  }
}

export function changeColor(className, color) {
  const items = document.querySelectorAll("." + className)

  if (/^#[0-9A-F]{6}$/i.test(color) || /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    const int = (color.length - 1) / 3
    const sep = [...Array(3).keys()].map((i) => {
      let val = parseInt(color.slice(i*int+1, i*int+int+1), 16)
      if (int === 2) {
        val /= 16
      }
      return val
    })
    const avg = sep.reduce( ( p, c ) => p + c, 0 ) / sep.length

    items.forEach(item => {
      item.style.backgroundColor = color
      if (avg >= 8) {
        item.style.color = "black"
      } else {
        item.style.color = "white"
      }
    })
  }
}
