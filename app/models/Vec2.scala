package models

class Vec2(val x: Float, val y: Float) {
  def add(that: Vec2): Vec2 = Vec2(this.x + that.x, this.y + that.y)

  def magnitude: Float = Math.sqrt(x * x + y * y).asInstanceOf[Float]

  def normalize: Vec2 =
    if (magnitude == 0f) Vec2.ZERO
    else Vec2(x / magnitude, y / magnitude)

  def scale(factor: Float): Vec2 = Vec2(x * factor, y * factor)

  def lengthTo(length: Float): Vec2 = normalize.scale(length)

  def rotate(radians: Float): Vec2 = {
    val cos = Math.cos(radians).asInstanceOf[Float]
    val sin = Math.sin(radians).asInstanceOf[Float]

    Vec2(x * cos - y * sin, x * sin + y * cos)
  }
}

object Vec2 {
  def apply(x: Float, y: Float) = new Vec2(x, y)

  val ZERO = Vec2(0f, 0f)
}
