'use client';
import React, {Component} from 'react';

class VideoCaptureComponent extends Component {
	videoRef = React.createRef<HTMLVideoElement>();

	async componentDidMount() {
		if (navigator.mediaDevices?.getUserMedia) {
			console.log('getUserMedia supported');
			try {
				const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
				if (this.videoRef.current) {
					this.videoRef.current.srcObject = stream;
				}
			} catch {
				console.error('getUserMedia error occurred');
			}
		} else {
			console.log('getUserMedia not supported on your browser');
		}
	}

	render() {
		return (
			<div>
				<video ref={this.videoRef} autoPlay playsInline muted style={{width: '50%', height: 'auto'}}/>
			</div>
		);
	}
}

export default VideoCaptureComponent;

