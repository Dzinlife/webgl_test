<template>
  <canvas ref="canvas" :style="{width: '200px', height: '200px'}" @mousemove="mouseMoveHandler"/>
</template>

<script>
import webgl from '@/services/webgl'
import Matrix4 from '@/utils/matrix'

export default {
  mounted() {
    const canvas = this.$refs.canvas

    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio

    const gl = webgl(canvas)
    this.gl = gl

    this.clear()
    this.step()
  },

  methods: {
    step() {
      this.draw()
      requestAnimationFrame(this.step)
    },

    clear() {
      const {gl} = this
      gl.clearColor(0.9, 0.9, 0.9, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    },

    draw() {
      const {gl} = this
      this.clear(gl)

      const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
      const aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
      const uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
      const uXformMatrix = gl.getUniformLocation(gl.program, 'u_xfromMatrix')

      const {x, y} = this
      const t = Date.now() / 100
      const vertices = new Float32Array([
        0.0, 0.0, x - 0.3 * Math.sin(t), y - 0.3 * Math.cos(t), x + 0.3 * Math.sin(t), y + 0.3 * Math.cos(t)
      ])

      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(aPosition)

      // gl.vertexAttrib3f(aPosition, this.x, this.y, 0.0)
      gl.vertexAttrib1f(aPointSize, 20.0)
      // gl.uniform4f(uFragColor, Math.random(), Math.random(), Math.random(), Math.random())
      gl.uniform4f(uFragColor, 0.0, 0.0, 0.0, 1.0)
      const xformMatrix = new Matrix4()
      xformMatrix.setRotate(90, 0, 0, 1)
      // xformMatrix.translate(0.5, 0, 0)
      // console.log(xformMatrix.elements)
      gl.uniformMatrix4fv(uXformMatrix, false, xformMatrix.elements)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },

    mouseMoveHandler(e) {
      const {layerX, layerY, target} = e
      const w = target.offsetWidth
      const h = target.offsetHeight
      this.x = (layerX / w) * 2 - 1
      this.y = -(layerY / h) * 2 + 1
    }
  },

  data() {
    return {
      gl: null,
      x: 0.0,
      y: 0.0
    }
  }
}
</script>

<style scoped>
  canvas {
    border: 1px solid #000000;
  }
</style>
