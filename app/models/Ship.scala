package models

class Ship(val id: Int, x: Float, y: Float) {
  private var _pos = Vec2(x, y)
  private var _vel = Vec2.ZERO
  private var _accel = Vec2.ZERO
  private var _heading = Vec2(1f, 0f)

  def pos = _pos
  def vel = _vel
  def accel = _accel

  def update() {
    _vel = vel.add(accel)
    _pos = pos.add(vel)
  }

  def accelerate() {
    _accel = Vec2(0.01f, 0f)
  }
}
