package controllers

import play.api.mvc._

object Home extends Controller {
  def index = Action { implicit request =>
    Ok(views.html.home.index())
  }

  implicit def username(implicit request: RequestHeader): Option[String] =
    request.session.get("user.name")
}
