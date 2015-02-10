package models

import play.api.libs.json.Json
import akka.actor.Actor
import play.api.libs.iteratee.{Concurrent, Iteratee}
import scala.compat.Platform
import scala.concurrent.ExecutionContext.Implicits.global

class World extends Actor {
  import World._

  val (enumerator, channel) = Concurrent.broadcast[String]

  private var ships = List[Ship]()
  private val framesPerSecond = 30.0
  private val millisecondsPerFrame = ((1.0 / framesPerSecond) * 1000L).asInstanceOf[Long]
  private var millisecondsLastTick = Platform.currentTime
  private var timeCounter = 0L

  def json = {
    Json.obj("ships" -> ships.map { ship =>
        Json.obj(
          "id" -> ship.id,
          "heading" -> Json.obj(
            "x" -> ship.heading.x,
            "y" -> ship.heading.y
          ),
          "accel" -> Json.obj(
            "x" -> ship.accel.x,
            "y" -> ship.accel.y
          ),
          "vel" -> Json.obj(
            "x" -> ship.vel.x,
            "y" -> ship.vel.y
          ),
          "pos" -> Json.obj(
            "x" -> ship.pos.x,
            "y" -> ship.pos.y
          )
        )
      }
    )
  }

  var counter = 0

  def receive = {
    case Update() => {
      val milliseconds = Platform.currentTime
      val timeElapsed = milliseconds - millisecondsLastTick
      millisecondsLastTick = milliseconds;
      timeCounter += timeElapsed

      while (timeCounter > millisecondsPerFrame) {
        ships.foreach(_.update)
        timeCounter -= millisecondsPerFrame
        counter += 1
      }
    }

    case Join(id) => {
      if (!ships.exists(_.id == id)) {
        val ship = new Ship(id, 100f, 100f)

        ships = ship :: ships

        val iteratee = Iteratee.foreach[String] { command =>
          command match {
            case "engineOn" => ship.toggleEngine(true)
            case "engineOff" => ship.toggleEngine(false)
            case "startTurnCC" => ship.startTurning(Rotation.CounterClockwise)
            case "startTurnC" => ship.startTurning(Rotation.Clockwise)
            case "stopTurnCC" => ship.stopTurning(Rotation.CounterClockwise)
            case "stopTurnC" => ship.stopTurning(Rotation.Clockwise)
          }

          ship.accelerate()
        }.map { _ =>
          self ! Leave(ship.id)
        }

        sender ! (iteratee, enumerator)
      }
    }

    case Broadcast() => {
      channel.push(json.toString)
    }

    case Leave(id) => {
      ships = ships.filter(_.id != id)
    }
  }
}

object World {
  case class Join(id: String)
  case class Update()
  case class Broadcast()
  case class Leave(id: String)
}
