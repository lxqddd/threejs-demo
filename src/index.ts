import * as THREE from 'three'
// 创建一个场景
const scene = new THREE.Scene()
// 创建一个相机
/**
 * 透视相机
 * fov： 可视角度
 * aspect：实际窗口的纵横比
 * near：近处的裁面距离
 * far： 远处的裁面距离
 * 只有离相机的距离大于near值，小于far值，且在相机的可视角度之内，才能被相机投影到。
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
// 创建一个渲染器
const renderer = new THREE.WebGLRenderer()

// 设置背景色
renderer.setClearColor(new THREE.Color(0x000000))
// 指定渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight)
// 启用阴影
renderer.shadowMap.enabled = true

// 创建一个坐标系，大小为20
const axes = new THREE.AxesHelper(20)
scene.add(axes)


// 创建一个平面
// 创建一个矩形平面，宽度为60，高度为20
const planeGeometry = new THREE.PlaneGeometry(60, 20)
// 设置矩形平面的材质，颜色设置为0xffffff
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff
})
// 通过Mesh，将形状和材质组合在一起
const plane = new THREE.Mesh(planeGeometry, planeMaterial)

plane.receiveShadow = true

// 将平面绕x轴旋转-90度
plane.rotation.x = -0.5 * Math.PI
// 设置平面在场景中的位置
plane.position.set(15, 0, 0)
// 将矩形平面添加到场景中
scene.add(plane)

// 创建一个球体
// 半径为4，x方向的细分数为20，y方向的细分数为20，细分数越大表示经纬线越密集 
const sphereGeometry = new THREE.SphereGeometry(4, 15, 15)
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x009990,
  wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
sphere.position.set(20, 4, 0)
scene.add(sphere)


// 设置相机的位置
camera.position.set(-30, 40, 30)
// 设置相机看向的位置，这里设置为看向场景的中心
camera.lookAt(scene.position)

// 选中要渲染场景的容器
const container = document.getElementById('app')!
// 将渲染的内容插入到页面中
container.appendChild(renderer.domElement)


// 让小球跳起来
const MaxHeight = 10
let step = 0.08
function renderScene() {
  sphere.position.y += step
  if (sphere.position.y > MaxHeight || sphere.position.y < 4) {
    step = -step
  }
  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)  
}
renderScene()
