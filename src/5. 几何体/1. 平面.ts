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
webGLRenderer.shadowMapEnabled = true

var plane = createMesh(new THREE.PlaneGeometry(10, 14, 4, 4))
// add the sphere to the scene
scene.add(plane)

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

  width: 10,
  height: 14,

  widthSegments: 4,
  heightSegments: 4,

  redraw: function () {
    // remove the old plane
    scene.remove(plane)
    // create a new one
    plane = createMesh(
      new THREE.PlaneGeometry(
        controls.width,
        controls.height,
        Math.round(controls.widthSegments),
        Math.round(controls.heightSegments)
      )
    )
    // add it to the scene.
    scene.add(plane)
  }
}

var gui = new GUI()
gui.add(controls, 'width', 0, 40).onChange(controls.redraw)
gui.add(controls, 'height', 0, 40).onChange(controls.redraw)
gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw)
gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw)
render()

function createMesh(geom: THREE.PlaneGeometry) {
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
  plane.rotation.y = step += 0.01

  // render using requestAnimationFrame
  requestAnimationFrame(render)
  webGLRenderer.render(scene, camera)
}
