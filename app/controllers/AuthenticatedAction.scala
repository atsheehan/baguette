package controllers

import scala.concurrent.Future
import play.api.mvc._

case class Authenticated[A](action: Action[A]) extends Action[A] {
  def apply(request: Request[A]): Future[Result] = {
    request.session.get("user.name") match {
      case Some(username) => action(request)
      case None => Future.successful(Results.Forbidden("Forbidden"))
    }
  }

  lazy val parser = action.parser
}
