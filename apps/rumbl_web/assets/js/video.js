import Player from "./player";
import {Presence} from "phoenix";

let Video = {
  init(socket, element) {if(!element) {return }
    let playerId = element.getAttribute("data-player-id")
    let videoId = element.getAttribute("data-id")
    socket.connect()
    this.onReady(videoId, socket)

    
    // Player.init(element.id, playerId, () => {
    //   this.onReady(videoId, socket)
    // })
  },

  onReady(videoId, socket) {
    let msgContainer = document.getElementById("msg-container")
    let msginput = document.getElementById("msg-input")
    let postButton = document.getElementById("msg-submit")
    let userList = document.getElementById("user-list")
    let lastSeenId = 0
    let vidChannel = socket.channel("videos:" + videoId, () => {
    return {last_seen_id: lastSeenId}
    })

    let presence = new Presence(vidChannel)

    // presence.onSync(() => {
    //   userList.innerHTML = presence.list((id, {metas: [first, ...rest]}) => {
    //     let count = rest.length + 1
    //     return `<li>${id}: (${count})</li>`
    //   }).join("")
    // })

    presence.onSync(() => {
      userList.innerHTML = presence.list((id, {user: user, metas: [first, ...rest]}) => {
        let count = rest.length + 1
        return `<li>${user.username}: (${count})</li>`
      }).join("")
    })
    
    postButton.addEventListener("click", e => {
      let payload = {body: msginput.value}
      vidChannel.push("new_annotation", payload).receive("error", e => console.log(e))
      msginput.value = ""
    })
  
    vidChannel.on("new_annotations", (resp) => {
      lastSeenId = resp.id
      this.renderAnnotation(msgContainer, resp) 
    })

    vidChannel.on("ping", ({count}) => console.log("PING", count) )



    // funciona
    vidChannel.join()
    .receive("ok", ({annotations}) => {
      annotations.forEach( ann => this.renderAnnotation(msgContainer, ann))
    })
    .receive("error", reason => console.log("join failed", reason))    

    // nao funciona

    // vidChannel.join()
    // .receive("ok", resp => {
    // let ids =resp.annotations.map(ann => ann.id)
    // if(ids.length > 0) { lastSeenId = Math.max(...ids) }
    //   this.scheduleMessages(msgContainer, resp.importations)
    // })
    // .receive("error", reason => console.log("join failed", reason))    

    msgContainer.addEventListener("click", e => {
    e.preventDefault()
    let seconds = e.target.getAttribute("data-seek") || e.targe.parentNode.getAttribute("data-seek")

    if(!seconds) { return }

    Player.seekTo(seconds)
  })
  },

  esc(str) {
    let div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  },

  renderAnnotation(msgContainer, {user, body}) {

// funciona
    let template = document.createElement("div")
    template.innerHTML = `
    <a href="#"">
      <b> ${this.esc(user.username)}</b>: ${this.esc(body)}
      </a>
    `
// nao funciona
    // let template = document.createElement("div")
    // template.innerHTML = `
    // <a href="#" data-seek="${this.esc(at)}">
    //   [${this.formatTime(at)}]
    //   <b> ${this.esc(user.username)}</b>: ${this.esc(body)}
    //   </a>
    // `
    
    msgContainer.appendChild(template)
    msgContainer.scrolltop = msgContainer.scrollHeight
  },

  scheduleMessages(msgContainer, annotations) {
    clearTimeout(this.scheduleTimer)
    this.schedulerTImer = setTimeout(() => {
      let ctime = Player.getCurrentTime()
      let remaining = this.renderAtTime(annotations,ctime, msgContainer)
      this.scheduleMessages(msgContainer, reamining)
    }, 1000) 
  },

  renderAtTime(annotations, seconds, msgContainer) {
    return annotations.filter( ann => {
      if(ann.at > seconds) {
        return true
      } else {
        this.renderAnnotation(msgContainer, ann)
        return false
      }
    })
  },

  formatTime(at) {
    let date = new Date(null)
    date.setSeconds(at/ 1000)
    return date.toISOString(),substr(14, 5)
  },
}

export default Video