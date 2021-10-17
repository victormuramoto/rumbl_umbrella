// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"
import socket from "./socket"
import Video from "./video"

Video.init(socket, document.getElementById("video"))

// let video = document.getElementById("video")

// console.log(video)
// if (video) {
//   Player.init(video.id, video.getAttribute("data-player-id"), () => {
//     console.log("player ready")
//   })
// }

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
