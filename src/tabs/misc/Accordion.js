import ReactMarkdown from 'react-markdown'

function openPanel(num) {
  const panel = document.getElementById(`ch${num}`)
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
}

function Accordion({ num, head, body }) {
  return (
    <div className="chapter">
      <button className={`accordion s${num + 1}`} onClick={() => {openPanel(num)}}>{head}</button>
      <div className="story panel" id={`ch${num}`}>
        <ReactMarkdown children={body} id="accordion" />
      </div>
    </div>
  )
}

export default Accordion
