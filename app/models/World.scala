package models

import play.api.libs.json.Json
import akka.actor.Actor
import play.api.libs.iteratee.{Concurrent, Iteratee}
import scala.concurrent.ExecutionContext.Implicits.global

class World extends Actor {
  import World._

  val (enumerator, channel) = Concurrent.broadcast[String]

  private var shipIndex = 0
  private var ships = List[Ship]()

  def json = {
    Json.obj("ships" -> ships.map { ship =>
        Json.obj(
          "id" -> ship.id,
          "pos" -> Json.obj(
            "x" -> ship.pos.x,
            "y" -> ship.pos.y
          )
        )
      }
    )
  }

  def receive = {
    case Update => {
      ships.foreach(_.update)
    }

    case Join() => {
      val ship = new Ship(shipIndex, 100f, 100f)
      shipIndex += 1

      ships = ship :: ships

      val iteratee = Iteratee.foreach[String] { command =>
        ship.accelerate()
        self ! Update

      }.map { _ =>
        self ! Leave(ship.id)
      }

      sender ! (iteratee, enumerator)
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
  case class Join()
  case class Update()
  case class Broadcast()
  case class Leave(id: Int)
}
