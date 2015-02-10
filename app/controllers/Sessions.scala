package controllers

import play.api.Play.current
import play.api.libs.json._
import play.api.libs.ws.{WS, WSResponse}
import play.api.mvc._
import scala.concurrent.{Await, Future}
import scala.concurrent.duration._

object Sessions extends Controller {
  def start = Action {
    Redirect(OAuthRedirectUrl)
  }

  def close = Action { request =>
    Redirect(routes.Home.index).withSession(request.session - "user.name")
  }

  def authenticate(code: String) = Action { request =>
    getUsername(code) match {
      case Some(username) => saveUserAndRedirect(request, username)
      case None => InternalServerError("Sorry, something went wrong.")
    }
  }

  private def getUsername(code: String): Option[String] = {
    getAccessToken(code) match {
      case Some(token) => {
        val request = WS.url(UserDetailsUrl)
          .withHeaders("Authorization" -> s"token $token")
          .get()

        requestJsonValue(request, "login")
      }
      case None => None
    }
  }

  private def saveUserAndRedirect(request: Request[AnyContent], username: String) =
    Redirect(routes.Home.index).withSession(request.session + ("user.name" -> username))

  private def getAccessToken(code: String): Option[String] = {
    val request = WS.url(OAuthAccessTokenUrl)
      .withHeaders("Accept" -> "application/json")
      .post(Map(
        "client_id" -> Seq(OAuthClientId),
        "client_secret" -> Seq(OAuthClientSecret),
        "code" -> Seq(code)))

    requestJsonValue(request, "access_token")
  }

  private def requestJsonValue(request: Future[WSResponse], key: String): Option[String] = {
    val response = Await.result(request, 10 seconds)
    val json = Json.parse(response.body)

    (json \ key) match {
      case value: JsString => Some(value.as[String])
      case _ => None
    }
  }

  private def readConfig(key: String): String =
    current.configuration.getString(key) match {
      case Some(value) => value
      case None => ""
    }

  val OAuthClientId = readConfig("oauth.github.client_id")
  val OAuthClientSecret = readConfig("oauth.github.client_secret")
  val OAuthRedirectUrl =
    s"https://github.com/login/oauth/authorize?client_id=$OAuthClientId"
  val OAuthAccessTokenUrl = "https://github.com/login/oauth/access_token"
  val UserDetailsUrl = "https://api.github.com/user"
}
