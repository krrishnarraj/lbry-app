import React from 'react';
import {
  Icon,
  Thumbnail,
} from 'component/common';
import FilePrice from 'component/filePrice'
import Link from 'component/link';
import Modal from 'component/modal';

const plyr = require('plyr')

class Video extends React.Component {
  constructor(props) {
    super(props)

    // TODO none of this mouse handling stuff seems to actually do anything?
    this._controlsHideDelay = 3000 // Note: this needs to be shorter than the built-in delay in Electron, or Electron will hide the controls before us
    this._controlsHideTimeout = null
    this.state = {}
  }
  handleMouseMove() {
    if (this._controlsTimeout) {
      clearTimeout(this._controlsTimeout);
    }

    if (!this.state.controlsShown) {
      this.setState({
        controlsShown: true,
      });
    }
    this._controlsTimeout = setTimeout(() => {
      if (!this.isMounted) {
        return;
      }

      this.setState({
        controlsShown: false,
      });
    }, this._controlsHideDelay);
  }

  handleMouseLeave() {
    if (this._controlsTimeout) {
      clearTimeout(this._controlsTimeout);
    }

    if (this.state.controlsShown) {
      this.setState({
        controlsShown: false,
      });
    }
  }

  onWatchClick() {
    this.props.watchVideo().then(() => {
      if (!this.props.modal) {
        this.setState({
          isPlaying: true
        })
      }
    })
  }

  startPlaying() {
    this.setState({
      isPlaying: true
    })
  }

  render() {
    const {
      readyToPlay = false,
      thumbnail,
      metadata,
      isLoading,
      isDownloading,
      fileInfo,
    } = this.props
    const {
      isPlaying = false,
    } = this.state

    let loadStatusMessage = ''

    if (isLoading) {
      loadStatusMessage = "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it"
    } else if (isDownloading) {
      loadStatusMessage = "Downloading stream... not long left now!"
    }

    return (
      <div onMouseMove={this.handleMouseMove.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} className={"video " + this.props.className + (isPlaying && readyToPlay ? " video--active" : " video--hidden")}>{
        isPlaying ?
        !readyToPlay ?
        <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span> :
        <VideoPlayer downloadPath={fileInfo.download_path} /> :
        <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
          <WatchLink icon="icon-play" onWatchClick={this.onWatchClick.bind(this)}
                     startPlaying={this.startPlaying.bind(this)} {...this.props}></WatchLink>
        </div>
      }</div>
    );
  }
}

class VideoPlayer extends React.PureComponent {
  componentDidMount() {
    const elem = this.refs.video
    const {
      downloadPath,
      contentType,
    } = this.props
    const players = plyr.setup(elem)
    players[0].play()
  }

  render() {
    const {
      downloadPath,
      contentType,
    } = this.props

    return (
      <video controls id="video" ref="video">
        <source src={downloadPath} type={contentType} />
      </video>
    )
  }
}

export default Video