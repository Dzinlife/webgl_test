<template>
  <canvas ref="canvas" width="200px" height="200px" @mousemove="mouseMoveHandler"/>
</template>

<script>
import webgl from '@/services/webgl'

export default {
  mounted() {
    const canvas = this.$refs.canvas
    const gl = webgl(canvas)
    this.gl = gl
    this.clear(gl)
  },

  methods: {
    clear(gl) {
      gl.clearColor(0.9, 0.9, 0.9, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    },

    draw(gl) {
      this.clear(gl)

      const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
      const aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
      const uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

      gl.vertexAttrib3f(aPosition, this.x, this.y, 0.0)
      gl.vertexAttrib1f(aPointSize, 20.0)
      gl.uniform4f(uFragColor, Math.random(), Math.random(), Math.random(), Math.random())

      gl.drawArrays(gl.POINTS, 0, 1)
    },

    mouseMoveHandler(e) {
      const {layerX, layerY, target} = e
      const w = target.width
      const h = target.height
      this.x = (layerX / w) * 2 - 1
      this.y = -(layerY / h) * 2 + 1
      this.draw(this.gl)
    }
  },

  data() {
    return {
      gl: null
    }
  }
}
</script>

<style scoped>
  canvas {
    border: 1px solid #000000;
  }
</style>
