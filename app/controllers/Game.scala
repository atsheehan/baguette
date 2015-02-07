package controllers

import akka.actor.{Props, actorRef2Scala}
import akka.pattern.ask
import akka.util.Timeout
import models.World
import play.api.Play.current
import play.api.libs.concurrent.Akka
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.mvc.{Action, Controller, WebSocket}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt
import scala.language.postfixOps

object Game extends Controller {
  implicit val timeout = Timeout(1 seconds)
  val world = Akka.system.actorOf(Props[World])
  Akka.system.scheduler.schedule(0 seconds, 1 seconds, world, World.Update)
  Akka.system.scheduler.schedule(0 seconds, 1 seconds, world, World.Broadcast)

  def index = Action { request =>
    Ok(views.html.game.index(request))
  }

  def gameSocket = WebSocket.async { request =>
    val channel = world ? World.Join()
    channel.mapTo[(Iteratee[String, _], Enumerator[String])]
  }
}
