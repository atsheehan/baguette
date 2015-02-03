package controllers

import play.api.mvc._

object Game extends Controller {
  def index = Action {
    Ok(views.html.game.index())
  }
}
