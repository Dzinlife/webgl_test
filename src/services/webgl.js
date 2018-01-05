import {initShaders} from '@/utils'
import VSHADER_SOURCE from './VShaderSource.vs'
import FSHADER_SOURCE from './FShaderSource.fs'

export default function(canvas) {
  const gl = canvas.getContext('webgl')

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert('Failed to get the rendering context for WebGL')
    return
  }

  return gl
}
