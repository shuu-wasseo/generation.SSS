import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { maxdim } from './mini'
import close from './close.png'
import { story } from './lines'

function erasePopup(id) {
  document.getElementById(id).style.display = "none"
  const chapter = localStorage.getItem('story')
  localStorage.setItem('story', chapter + 1)
}

export function autostory() {
  const md = maxdim()
  
  const conds = [
    true,
    md >= 1, 
    md >= 2,
    md >= 8,
  ]
   
  for (let i = 0; i < conds.length; i++) {
    if (!conds[i + 1]) {
      return [i, story[i]]
    }
  }

  return [story.length - 1, story.slice(-1)]
}

export function StoryPopup() {
  const chapter = localStorage.getItem('story')
  const [story, setStory] = useState(autostory()[1])

  if (chapter < autostory()[0]) {
    return (
      <div id="story" className="popup">
        <ReactMarkdown children={story} id="storytext" />
        <button className="close" onClick={() => erasePopup("story")}>
          <img className="icon" src={close} />
        </button>
      </div>
    )
  }
}