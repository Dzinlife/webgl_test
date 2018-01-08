attribute vec4 a_Position;
attribute float a_PointSize;
uniform mat4 u_xfromMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
  gl_Position = u_xfromMatrix * a_Position;
  // gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = a_PointSize;
  v_Color = a_Color;
}