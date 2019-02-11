window.onload = function() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x191919);

  document.getElementById('model').appendChild(renderer.domElement);

  camera.position.z = 5;
  camera.position.y = 1.7;
  camera.rotation.x = -0.6;

  const light = new THREE.DirectionalLight(0xfff7e8, 0.5);
  scene.add(light);

  const amColor = "#faffe3";
  const amLight = new THREE.AmbientLight(amColor);
  scene.add(amLight);

  const manager = new THREE.LoadingManager();


  const meshes = [];

  var rotateAroundWorldAxis = function(object, axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    var newPos = currentPos.applyMatrix4(rotWorldMatrix);

    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);

    object.position.x = newPos.x;
    object.position.y += newPos.y;
    object.position.z = newPos.z;
  };

  const mtlLoader = new THREE.MTLLoader(manager);
  mtlLoader.setPath('/models/');
  mtlLoader.load('skodal.mtl', function(materials) {
    console.log(materials);
    materials.baseUrl = '/models/';
    materials.preload();

    const objLoader = new THREE.OBJLoader(manager);
    objLoader.setMaterials(materials);
    objLoader.setPath('/models/')
    objLoader.load('skodal.obj', function(object) {
      console.log(object);

      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      })

      const body = meshes[0];
      const glass = meshes[2];
      
      body.position.z = 1.4;
      glass.position.z = 1.4;

      const circle1Geometry = new THREE.RingGeometry( 1.51, 1.5, 50 );
      const circle1Material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
      const circle1 = new THREE.Mesh( circle1Geometry, circle1Material );
      circle1.rotation.x = -(Math.PI / 2);

      const circle2Geometry = new THREE.RingGeometry( 2.01, 2, 50 );
      const circle2Material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
      const circle2 = new THREE.Mesh( circle2Geometry, circle2Material );
      circle2.rotation.x = -(Math.PI / 2);

      const placeGeometry = new THREE.PlaneGeometry(100, 100, 32);
      const placeMaterial = new THREE.MeshBasicMaterial( {color: 0x191919, side: THREE.DoubleSide} );
      const place = new THREE.Mesh(placeGeometry, placeMaterial);
      place.rotation.x = -(Math.PI / 2);

      setInterval(function() {
        rotateAroundWorldAxis(body, new THREE.Vector3(0,1,0), Math.PI / 720);
        rotateAroundWorldAxis(glass, new THREE.Vector3(0,1,0), Math.PI / 720);
      }, 10)

      scene.add(body);
      scene.add(glass);
      scene.add(circle1);
      scene.add(circle2);
      //scene.add(place);

      glass.material = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        opacity: 0.1,
        transparent: true
      });
    })

    renderer.sortObjects = true;
    
    // var bumpMapBody = new THREE.TextureLoader().load('/models/body_s.jpg');
    // var bumpMapPlace = new THREE.TextureLoader().load('/models/place_s.jpg');

    // body.material = new THREE.MeshPhongMaterial({
    //   map: textureBody,
    //   bumpMap: bumpMapBody,
    //   bumpScale: 1
    // });
    // place.material = new THREE.MeshPhongMaterial({
    //   map: texturePlace,
    //   bumpMap: bumpMapPlace,
    //   bumpScale: 1
    // });

  })

 // const controls = new THREE.OrbitControls(camera, document, renderer.domElement);

	// controls.rotateSpeed = 3.0;
	// controls.panSpeed = 0.8;

  var axisHelper = new THREE.AxisHelper( 5 );
  //scene.add( axisHelper );

  const rendering = function() {
    requestAnimationFrame(rendering);
    //controls.update();
    renderer.render(scene, camera);
  }

  rendering();

}