<template>
  <canvas ref="canvas" :style="{width: '100%', height: '500px'}" @mousemove="mouseMoveHandler"/>
</template>

<script>
import {initShaders} from '@/utils'
import VSHADER_SOURCE from '@/services/VShaderSource.vs'
import FSHADER_SOURCE from '@/services/FShaderSource.fs'
import Matrix4 from '@/utils/matrix'

export default {
  mounted() {
    const canvas = this.$refs.canvas

    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio

    const gl = canvas.getContext('webgl')
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      alert('Failed to get the rendering context for WebGL')
      return
    }
    this.gl = gl

    window.addEventListener('optimizedResize', this.resize)

    this.aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    this.aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    this.aColor = gl.getAttribLocation(gl.program, 'a_Color')
    this.uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    this.uXformMatrix = gl.getUniformLocation(gl.program, 'u_xfromMatrix')
    this.uWidth = gl.getUniformLocation(gl.program, 'u_Width')
    this.uHeight = gl.getUniformLocation(gl.program, 'u_Height')

    gl.uniform1f(this.uWidth, gl.drawingBufferWidth)
    gl.uniform1f(this.uHeight, gl.drawingBufferHeight)

    this.initVertexBuffer()

    requestAnimationFrame(this.tick)
  },

  beforeMount() {
    window.removeEventListener('optimizedResize', this.resize)
  },

  methods: {
    resize() {
      const canvas = this.$refs.canvas
      const {gl} = this
      const devicePixelRatio = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = canvas.clientHeight * devicePixelRatio
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    },

    tick() {
      this.draw()
      requestAnimationFrame(this.tick)
    },

    clear() {
      const {gl} = this
      gl.clearColor(0.9, 0.9, 0.9, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    },

    initVertexBuffer() {
      const {gl} = this

      this.vertices = new Float32Array(15)
      const FSIZE = this.vertices.BYTES_PER_ELEMENT

      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)
      gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0)
      gl.vertexAttribPointer(this.aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
      gl.enableVertexAttribArray(this.aPosition)
      gl.enableVertexAttribArray(this.aColor)

      const xformMatrix = new Matrix4()
      xformMatrix.setRotate(0, 0, 0, 1)
      xformMatrix.scale(1.5, 1, 1)
      gl.uniformMatrix4fv(this.uXformMatrix, false, xformMatrix.elements)
    },

    draw() {
      const {gl} = this
      this.clear(gl)

      const {x, y} = this
      const t = Date.now() / 100
      this.vertices.set([
        0.0, 0.0, 1.0, 1.0, 1.0,
        x - 0.3 * Math.sin(t), y - 0.3 * Math.cos(t), 1.0, 0.0, 1.0,
        x + 0.3 * Math.sin(t), y + 0.3 * Math.cos(t), 0.0, 1.0, 1.0
      ])
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)

      // gl.vertexAttrib3f(aPosition, this.x, this.y, 0.0)
      // gl.vertexAttrib1f(this.aPointSize, 20.0)
      // gl.uniform4f(this.uFragColor, Math.random(), Math.random(), Math.random(), Math.random())
      // gl.uniform4f(this.uFragColor, 0.0, 0.0, 0.0, 1.0)

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
