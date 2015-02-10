package controllers

import akka.actor.{Props, actorRef2Scala}
import akka.pattern.ask
import akka.util.Timeout
import models.World
import play.api.Play.current
import play.api.libs.concurrent.Akka
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.mvc.RequestHeader
import play.api.mvc.{Action, Controller, WebSocket, Result}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration.DurationInt
import scala.language.postfixOps

object Game extends Controller {
  implicit val timeout = Timeout(1 seconds)
  val world = Akka.system.actorOf(Props[World])
  Akka.system.scheduler.schedule(0 seconds, 1 seconds,
    world, World.Broadcast())
  Akka.system.scheduler.schedule(0 milliseconds, 50 milliseconds,
    world, World.Update())

  def index = Authenticated {
   Action { implicit request =>
      Ok(views.html.game.index())
    }
  }

  def gameSocket = WebSocket.tryAccept[String] { request =>
    request.session.get("user.name") match {
      case None => Future.successful(Left(Forbidden("Forbidden")))
      case Some(username) => {
        val channel = world ? World.Join(username)
        channel.mapTo[(Iteratee[String, _], Enumerator[String])].map(Right(_))
      }
    }
  }

  implicit def username(implicit request: RequestHeader): String =
    request.session.get("user.name").getOrElse("")
}
