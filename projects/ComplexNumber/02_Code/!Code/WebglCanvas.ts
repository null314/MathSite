

type Vec3 = [number, number, number];

type Mat4 =
	[number, number, number, number,
	 number, number, number, number,
	 number, number, number, number,
	 number, number, number, number];


class Mat
{
	static CreateMat4(): Mat4
	{
		return null;
	}

	static PerspectiveMat4(fieldOfView: number, aspect: number, zNear: number, zFar: number): Mat4
	{
		const f = 1.0 / Math.tan(fieldOfView / 2);
		var out = this.CreateMat4();
		
		out[0] = f / aspect;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = f;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[11] = -1;
		out[12] = 0;
		out[13] = 0;
		out[15] = 0;
		
		if (zFar != null && zFar !== Infinity) 
		{
			const nf = 1 / (zNear - zFar);
			out[10] = (zFar + zNear) * nf;
			out[14] = 2 * zFar * zNear * nf;
		} 
		else 
		{
			out[10] = -1;
			out[14] = -2 * zNear;
		}
		return out;		
	}

	static TranslateM(out: Mat4, v: Vec3) 
	{
		var x = v[0];
		var y = v[1];
		var z = v[2];

		out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
		out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
		out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
		out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
		
		return out;
	}
	
	static Translate(out: Mat4, a: Mat4, v: Vec3) 
	{
		var x = v[0];
		var y = v[1];
		var z = v[2];

		var a00 = a[0];
		var a01 = a[1];
		var a02 = a[2];
		var a03 = a[3];
		var a10 = a[4];
		var a11 = a[5];
		var a12 = a[6];
		var a13 = a[7];
		var a20 = a[8];
		var a21 = a[9];
		var a22 = a[10];
		var a23 = a[11];

		out[0] = a00;
		out[1] = a01;
		out[2] = a02;
		out[3] = a03;
		out[4] = a10;
		out[5] = a11;
		out[6] = a12;
		out[7] = a13;
		out[8] = a20;
		out[9] = a21;
		out[10] = a22;
		out[11] = a23;

		out[12] = a00 * x + a10 * y + a20 * z + a[12];
		out[13] = a01 * x + a11 * y + a21 * z + a[13];
		out[14] = a02 * x + a12 * y + a22 * z + a[14];
		out[15] = a03 * x + a13 * y + a23 * z + a[15];

		return out;
	}

}


class WebglCanvas
{
	Canvas: HTMLCanvasElement;
	Context: WebGLRenderingContext;
	VsSource: string;
	FsSource: string;

	constructor(canvasId: string) 
	{
		this.Canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.Context = this.Canvas.getContext("webgl"); // || canvas.getContext("experimental-webgl");
		
		this.Context.clearColor(1.0, 1.0, 1.0, 1.0);            	          // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
		this.Context.enable(this.Context.DEPTH_TEST);                               // включает использование буфера глубины
		this.Context.depthFunc(this.Context.LEQUAL);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
		this.Context.clear(this.Context.COLOR_BUFFER_BIT|this.Context.DEPTH_BUFFER_BIT);


		this.VsSource = `
			attribute vec4 aVertexPosition;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			void main() 
			{
			  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			}`;

		this.FsSource = `
			void main() 
			{
			  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			} `;
			
		
		var shaderProgram  = this.InitShaderProgram(this.Context, this.VsSource, this.FsSource);
		
		const programInfo = 
		{
			program: shaderProgram,
			attribLocations: 
			{
				vertexPosition: this.Context.getAttribLocation(shaderProgram, 'aVertexPosition'),
			},
			uniformLocations: 
			{
				projectionMatrix: this.Context.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: this.Context.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			},
		};
		
		var buffer = this.InitBuffers(this.Context);

		this.DrawScene(this.Context, buffer, programInfo);
		
//		this.Context = new Context2d(this.Canvas);
		
/*		let thisClosure = this;
		this.Canvas.addEventListener("mousedown", function (e: MouseEvent): void { thisClosure.OnMouseDown(e); }, false);
		this.Canvas.addEventListener("mousemove", function (e: MouseEvent): void { thisClosure.OnMouseMove(e); }, false);
		this.Canvas.addEventListener("mouseup", function (e: MouseEvent): void { thisClosure.OnMouseUp(e); }, false);*/
	}

	InitShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram 
	{
		const vertexShader = this.LoadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.LoadShader(gl, gl.FRAGMENT_SHADER, fsSource);

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
		{
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		return shaderProgram;
	}

	LoadShader(gl: WebGLRenderingContext, type, source: string): WebGLShader 
	{
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
		{
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	InitBuffers(gl: WebGLRenderingContext)
	{
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = 
		[
			-1.0,  1.0,
			 1.0,  1.0,
			-1.0, -1.0,
			 1.0, -1.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		return 
		{
			position: positionBuffer
		};
	}	
	
	DrawScene(gl: WebGLRenderingContext, programInfo, buffers) : void
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);  
		gl.clearDepth(1.0);                 
		gl.enable(gl.DEPTH_TEST);           
		gl.depthFunc(gl.LEQUAL);         

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const fieldOfView = 45 * Math.PI / 180;   
		const aspect = gl.canvas.width / gl.canvas.height;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = Mat.PerspectiveMat4(fieldOfView, aspect, zNear, zFar);

		const modelViewMatrix = Mat.CreateMat4();

		Mat.TranslateM(modelViewMatrix, [-0.0, 0.0, -6.0]); 

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		{
			const numComponents = 2;  // pull out 2 values per iteration
			const type = gl.FLOAT;    // the data in the buffer is 32bit floats
			const normalize = false;  // don't normalize
			const stride = 0;         // how many bytes to get from one set of values to the next
									  // 0 = use type and numComponents above
			const offset = 0;         // how many bytes inside the buffer to start from
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		}

		// Tell WebGL to use our program when drawing

		gl.useProgram(programInfo.program);

		// Set the shader uniforms

		gl.uniformMatrix4fv(
		  programInfo.uniformLocations.projectionMatrix,
		  false,
		  projectionMatrix);
		  
		gl.uniformMatrix4fv(
		  programInfo.uniformLocations.modelViewMatrix,
		  false,
		  modelViewMatrix);
		{
			const offset = 0;
			const vertexCount = 4;
			gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
		}
	}
}









