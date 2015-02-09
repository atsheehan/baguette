package models

object Rotation extends Enumeration {
  val Clockwise = Value("Clockwise")
  val CounterClockwise = Value("CounterClockwise")
}

class Ship(val id: Int, x: Float, y: Float) {
  private var _pos = Vec2(x, y)
  private var _vel = Vec2.ZERO
  private var _accel = Vec2.ZERO
  private var _heading = Vec2(1f, 0f)

  private var _engineOn = false
  private var _rotating: Option[Rotation.Value] = None

  private val Thrust = 0.1f
  private val RotationSpeed = (Math.PI / 20f).asInstanceOf[Float]

  def pos = _pos
  def vel = _vel
  def accel = _accel
  def heading = _heading
  def engineOn = _engineOn
  def rotating = _rotating

  def update() {
    if (engineOn) {
      _accel = heading.scale(Thrust)
    } else {
      _accel = Vec2.ZERO
    }

    rotating match {
      case Rotation.Clockwise => _heading = heading.rotate(RotationSpeed)
      case Rotation.CounterClockwise => _heading = heading.rotate(-RotationSpeed)
    }

    _vel = vel.add(accel)
    _pos = pos.add(vel)
  }

  def accelerate() {
    _accel = Vec2(0.01f, 0f)
  }

  def startTurning(rotation: Rotation.Value) {
    _rotating = Some(rotation)
  }

  def stopTurning(rotation: Rotation.Value) {
    if (_rotating == rotation) {
      _rotating = None
    }
  }

  def toggleEngine(value: Boolean) {
    _engineOn = value;
  }
}
