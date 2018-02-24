import React from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import { DiceD6, DiceManager } from 'threejs-dice'
import OrbitControls from 'three-orbitcontrols'

class Dice extends React.Component{

	// This is the component to keep tract current number of gamer
	// Possibly extend to broadcast the result of each game
	constructor(props) {
		super(props);
		this.state = {
			dice: []
		}
	}

	componentDidMount(){
		// SCENE
		const scene = new THREE.Scene();
		this.scene = scene;
		// CAMERA
		const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		const VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.01, FAR = 20000;
		const camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.camera = camera;
		scene.add(camera);
		camera.position.set(0,30,30);
		// RENDERER
	    const renderer = new THREE.WebGLRenderer( {antialias:true} );
	    this.renderer = renderer;
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	    renderer.shadowMap.enabled = true;
	    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// EVENTS
		// CONTROLS
		const controls = new OrbitControls( camera, renderer.domElement );

		
		let ambient = new THREE.AmbientLight('#ffffff', 0.3);
		scene.add(ambient);
	    let directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
	    directionalLight.position.x = -1000;
	    directionalLight.position.y = 1000;
	    directionalLight.position.z = 1000;
	    scene.add(directionalLight);
	    let light = new THREE.SpotLight(0xefdfd5, 1.3);
	    light.position.y = 100;
	    light.target.position.set(0, 0, 0);
	    light.castShadow = true;
	    light.shadow.camera.near = 50;
	    light.shadow.camera.far = 110;
	    light.shadow.mapSize.width = 1024;
	    light.shadow.mapSize.height = 1024;
	    scene.add(light);
		// FLOOR
		var floorMaterial = new THREE.MeshPhongMaterial( { color: '#00aa00', side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.receiveShadow  = true;
		floor.rotation.x = Math.PI / 2;
		scene.add(floor);
		// SKYBOX/FOG
		var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
		var skyBoxMaterial = new THREE.MeshPhongMaterial( { color: 0x9999ff, side: THREE.BackSide } );
		var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
		// scene.add(skyBox);
		scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
		////////////
		// CUSTOM //
		////////////
	    const world = new CANNON.World();
	    this.world = world;
	    world.gravity.set(0, -9.82 * 20, 0);
	    world.broadphase = new CANNON.NaiveBroadphase();
	    world.solver.iterations = 16;
	    DiceManager.setWorld(world);
	    //Floor
	    let floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
	    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
	    world.add(floorBody);
	    //Walls
	    var colors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
	    for (var i = 0; i < 5; i++) {
	        var die = new DiceD6({size: 1.5, backColor: colors[i]});
	        scene.add(die.getObject());
	        this.state.dice.push(die);
	    }

	    this.mount.appendChild(this.renderer.domElement);
    	requestAnimationFrame( this.animate.bind(this) );
	}

    //Animate everything
    animate() {
        this.world.step(1.0 / 60.0);
        
	    for (var i in this.state.dice) {
	        this.state.dice[i].updateMeshFromBody();
	    }

        this.renderer.render(this.scene, this.camera);
        
        requestAnimationFrame(this.animate.bind(this));
    }
	    
	componentWillReceiveProps(nextProps){
  	}

	componentWillUnmount() {
	}



	render(){

	    return (
	      <div
	        style={{ width: '200px', height: '200px' }}
	        ref={(mount) => { this.mount = mount }}
	      />
	    )
	}

}

export default Dice