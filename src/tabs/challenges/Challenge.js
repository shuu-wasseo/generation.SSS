import { format } from "../../extra/mini"
import { grandGravity } from "../../extra/prestige"
import { challenges } from "../../extra/lines"

function enterChallenge(type, num) {
  const currency = JSON.parse(localStorage.getItem("currency"))

  grandGravity(currency.S >= 24 ** 24, currency.S >= 24 ** 24, num ? `you have entered challenge ${num}` : "you have exited the challenge")

  if (!(type === "grand gravity" && num === 1)) {
    let currency = JSON.parse(localStorage.getItem('currency'))
    currency.S = 2
    if (type === "grand gravity" && num === 5) {
      currency.S *= 2
    }
    currency.comoDust = 0
    localStorage.setItem('currency', JSON.stringify(currency))

    let dimObj = JSON.parse(localStorage.getItem('dimensions'))
    const dims = Object.fromEntries(
      [...Array(24).keys()].map(x => ["S" + (x + 1), { bought: 0, total: 0 }])
    )
    dimObj.S = dims
    localStorage.setItem('dimensions', JSON.stringify(dimObj))

    let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
    inChallenge[type] = num
    localStorage.setItem("inchallenge", JSON.stringify(inChallenge))

    let times = JSON.parse(localStorage.getItem('times'))
    times["grand gravity"] = Date.now()
    localStorage.setItem('times', JSON.stringify(times))

    if (type === "grand gravity" && num === 6) {
      let ggc6 = []
      for (var i = 0; i < 8; i++) {
        ggc6.push(0.24 * ((100 / 3) ** Math.random()))
      }
      localStorage.setItem('ggc6', JSON.stringify(ggc6))
    }
  }
}

function handleChallenge(type, num) {
  let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  const challengeDic = {
    "grand gravity": "grandGravity"
  }
  let completedChallenges = JSON.parse(localStorage.getItem('prestige'))[challengeDic[type]].challenges
  if (inChallenge[type] === num) {
    enterChallenge(type, 0)
  } else if (!completedChallenges.includes(num)) {
    enterChallenge(type, num)
  }
}

function Challenge({ type, num }) {
  const challengeDic = {
    "grand gravity": "grandGravity"
  }

  let completedChallenges = JSON.parse(localStorage.getItem('prestige'))[challengeDic[type]].challenges
  let isChallengeCompleted = completedChallenges.includes(num)

  let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  let buttontext = isChallengeCompleted ? "finished" : "start"
  if (inChallenge[type] === num) {
    buttontext = "exit"
  }

  return (
    <div className={`s${num} big ${type}`}>
      <h4 className={`s${num}`}>{challenges[type][num - 1][0]}</h4>
      <h5 className={`s${num}`}>{challenges[type][num - 1][1]}</h5>
      <button className={`challengebutton ${isChallengeCompleted ? "s" + num : ""}`} onClick={() => handleChallenge(type, num)}>{buttontext}</button>
    </div>
  )
}

export function message(type, num) {
  const times = JSON.parse(localStorage.getItem('times'));

  switch (type) {
    case "grand gravity":
      switch (num) {
        case 2:
          let mult = (24 ** ((Date.now() - times["grand gravity"]) / 1000000)) * 1 / 24
          return `S production x${format(mult)}`
        default:
          return ""
      }
    default:
      return ""
  }
}

export default Challenge 
