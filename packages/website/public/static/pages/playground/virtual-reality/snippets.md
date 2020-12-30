## vr-snippets

```
<script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
```

```
<!-- Escena con assets -->
<a-scene>
	<a-assets>
		<img src="https://ucarecdn.com/8e652fa5-2fb2-406f-b13f-2b5dc54a2dd7/" id="messi" />
		<img src="https://farm4.staticflickr.com/3580/3648043829_6e7c932c90_o.jpg" id="montana" />
	</a-assets>
	<a-image rotation="0 0 0" position="0 1.6 -3" src="#messi" width="3" height="2" opacity="1">
	</a-image>
	<a-sky src="#montana"></a-sky>
</a-scene>
```

```
<!-- Escena con una esfera y un cielo que tiene una imagen de fondo -->
<a-scene>
	<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
	<a-sky src="https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/"></a-sky>
</a-scene>
```

```
<!-- Dona con un componente creado por mi -->
<a-scene>
	<a-torus position="0 0 -4" color="violet" arc="230" radius="4" radius-tubular="0.2"
	camaleon="defaultColor: skyblue; interval: 100;"></a-torus>
</a-scene>
```

```
<!-- Escena que mueve la camara -->
<a-scene>
	<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
	<a-box position="-1 0.5 -3" rotation="0 45 0" width="1" height="1" depth="1" color="#4CC3D9"></a-box>
	<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
	<a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
	<a-entity>
		<a-camera></a-camera>
		<a-animation attribute="position" from="0 0 0" to="0 0 -2" dur="2000" repeat="indefinite" direction="alternate"></a-animation>
	</a-entity>
	<a-sky color="#ECECEC"></a-sky>
</a-scene>
```

```
<!-- Audios -->
<a-assets timeout="10000">
  <audio src="audio.mp3" id="audio" loop="loop" autoplay></audio>
</a-assets>
<a-sound src="#audio"></a-sound>
```

```
<!-- Cursores -->
<a-entity>
  <a-camera>
    <a-cursor
      position="0 0 -1"
      geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
      material="color: black; shader: flat">
    </a-cursor>
  </a-camera>
</a-entity>
<a-entity id="box" cursor-listener position="0 0 -5" geometry="primitive: box" material="color: blue"></a-entity>
```

```
<!-- Fisica con cannon -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"></script>

<a-entity dynamic-body id="box" cursor-listener position="0 10 -5" geometry="primitive: box" material="color: blue"></a-entity>
<a-ocean static-body></a-ocean>
<a-plane static-body width="100" height="100" position="0 3 0" color="transparent" rotation="-100 10 -10"></a-plane>
```

```
AFRAME.registerComponent("camaleon", {
  schema: {
    interval: {
      type: "number",
      default: 2000,
    },
    defaultColor: {
      type: "color",
      default: "#fff",
    },
  },

  init: function () {
    var el = this.el;
    var interval = this.data.interval;
    var colors = ["red", "green", "blue", "yellow"];
    var i = 0;
    el.setAttribute("color", colors[0]);
    this.colorInterval = setInterval(function () {
      i = (i + 1) % colors.length;
      el.setAttribute("color", colors[i]);
    }, interval);
  },

  update: function () {},

  remove: function () {
    var el = this.el;
    var defaultColor = this.data.defaultColor;
    clearInterval(this.colorInterval);
    el.setAttribute("color", defaultColor);
  },
});

// ------------------------

AFRAME.registerComponent("cursor-listener", {
  init: function () {
    var COLORS = ["red", "green", "blue"];
    this.el.addEventListener("click", function (evt) {
      var randomIndex = Math.floor(Math.random() * COLORS.length);
      this.setAttribute("material", "color", COLORS[randomIndex]);
      console.log("I was clicked at: ", evt.detail.intersection.point);
    });
  },
});
```
