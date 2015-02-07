package models

class Vec2(val x: Float, val y: Float) {
  def add(that: Vec2) = Vec2(this.x + that.x, this.y + that.y)
}

object Vec2 {
  def apply(x: Float, y: Float) = new Vec2(x, y)

  val ZERO = Vec2(0f, 0f)
}
