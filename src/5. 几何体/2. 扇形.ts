import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'
// 创建一个场景
// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene()

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// create a render and set the size
var webGLRenderer = new THREE.WebGLRenderer()
webGLRenderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
webGLRenderer.setSize(window.innerWidth, window.innerHeight)
webGLRenderer.shadowMap.enabled = true

let circle = createMesh(
  new THREE.CircleGeometry(4, 10, 0.3 * Math.PI * 2, 0.3 * Math.PI * 2)
)
scene.add(circle)

// position and point the camera to the center of the scene
camera.position.set(-20, 30, 40)
camera.lookAt(new THREE.Vector3(10, 0, 0))

// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 60, -10)
scene.add(spotLight)

// add the output of the renderer to the html element
document.getElementById('app')!.appendChild(webGLRenderer.domElement)

// call the render function
var step = 0

// setup the control gui
var controls = {
  // we need the first child, since it's a multimaterial

  radius: 4,

  segments: 10,
  thetaStart: 0.3 * Math.PI * 2,
  thetaLength: 0.3 * Math.PI * 2,

  redraw: function () {
    // remove the old plane
    scene.remove(circle)
    // create a new one
    circle = createMesh(
      new THREE.CircleGeometry(
        controls.radius,
        controls.segments,
        controls.thetaStart,
        controls.thetaLength
      )
    )
    // add it to the scene.
    scene.add(circle)
  }
}

var gui = new GUI()
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw)
gui.add(controls, 'segments', 0, 40).onChange(controls.redraw)
gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw)
gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw)
render()

function createMesh(geom: THREE.CircleGeometry) {
  // assign two materials
  var meshMaterial = new THREE.MeshNormalMaterial()
  meshMaterial.side = THREE.DoubleSide
  var wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true

  // create a multimaterial
  var plane = createMultiMaterialObject(geom, [meshMaterial, wireFrameMat])

  return plane
}

function render() {
  circle.rotation.y = step += 0.01

  // render using requestAnimationFrame
  requestAnimationFrame(render)
  webGLRenderer.render(scene, camera)
}
