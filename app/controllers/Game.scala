
package controllers

import scala.concurrent.duration.DurationInt
import scala.concurrent.ExecutionContext.Implicits.global

import akka.actor.{ Actor, Props, actorRef2Scala }
import akka.actor.Actor._
import akka.pattern.ask
import akka.util.Timeout
import play.api.Play.current
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Promise
import play.api.libs.iteratee.{ Concurrent, Enumerator, Iteratee }
import play.api.mvc.{ Action, Controller, WebSocket }
import scala.language.postfixOps

object Game extends Controller {
  implicit val timeout = Timeout(1 seconds)
  val world = Akka.system.actorOf(Props[World])
  Akka.system.scheduler.schedule(0 seconds, 1 seconds, world, Broadcast())

  def index = Action { request =>
    Ok(views.html.game.index(request))
  }

  def gameSocket = WebSocket.async { request =>
    println("bloop")
    val channel = world ? Join()
    channel.mapTo[(Iteratee[String, _], Enumerator[String])]
  }
}

case class Player(val id: Int, var x: Float, var y: Float)
case class Join()
case class Broadcast()

class World extends Actor {
  var playerIndex = 0
  var players = List[Player]()
  val (enumerator, channel) = Concurrent.broadcast[String]

  def receive = {
    case Join() => {
      println("player joined")

      val player = new Player(playerIndex, 100f, 100f)
      players = player :: players
      playerIndex += 1

      val iteratee = Iteratee.foreach[String] { command =>
        var matched = true
        val SPEED = 10f

        command match {
          case "left" => player.x -= SPEED
          case "right" => player.x += SPEED
          case "up" => player.y -= SPEED
          case "down" => player.y += SPEED
          case _ => matched = false
        }

        if (matched) {
          self ! Broadcast()
        }
      }

      sender ! (iteratee, enumerator)
    }

    case Broadcast() => {
      channel.push(Json.toJson(players).toString)
    }
  }

  implicit val playerWrites: Writes[Player] = (
    (JsPath \ "id").write[Int] and
      (JsPath \ "x").write[Float] and
      (JsPath \ "y").write[Float]
  )(unlift(Player.unapply))
}
