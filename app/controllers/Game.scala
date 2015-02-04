package controllers

import scala.concurrent.duration.DurationInt

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.iteratee._
import play.api.libs.concurrent.Promise
import play.api.mvc._

object Game extends Controller {
  def index = Action { implicit request =>
    Ok(views.html.game.index(request))
  }

  def gameSocket = WebSocket.using[String] { implicit request =>
    println("connected")
    val in = Iteratee.foreach[String] { chunk =>
      println(chunk)
    }

    val out = Enumerator.repeatM {
      Promise.timeout("hi", 3.seconds)
    }

    (in, out)
  }
}
