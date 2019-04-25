import React, { Component } from 'react';

class PlayerBar extends Component {
  checkVolume(){
    let volumeIcon = '';
    if (this.props.volume === 0 ){
      volumeIcon = 'icon ion-md-volume-mute';
    } else if (this.props.volume <= 0.75){
      volumeIcon = 'icon ion-md-volume-low';
    } else {
      volumeIcon = 'icon ion-md-volume-high';
    }
    return volumeIcon;
  }

  render(){
    return(
      <section className="player-bar">
          <button id="time-control">
            <div className="current-time">{this.props.formatTime(this.props.currentTime)}</div>
            <input
              type="range"
              className="seek-bar"
              id='time-seek'
              value={(this.props.currentTime / this.props.duration) || 0}
              min="0"
              max="1"
              step="0.01"
              onChange={this.props.handleTimeChange}
            />
            <div className="total-time">{this.props.formatTime(this.props.duration)}</div>
          </button>
          
          <div className = "controlButtons">
          <button id="previous"
                  onClick={this.props.handlePrevClick}>
            <span className="icon ion-md-rewind"></span>
          </button>

          <button id="play-pause"
                  onClick={this.props.handleSongClick}>
            <span className={this.props.isPlaying ? 'icon ion-md-pause' : 'icon ion-md-play'}></span>
          </button>

          <button id="next"
                  onClick={this.props.handleNextClick}>
            <span className="icon ion-md-fastforward"></span>
          </button>
          </div>

          <button id="volume-control">
            <div className={this.checkVolume()}></div>
            <input
              type="range"
              className="seek-bar"
              value={this.props.volume}
              min="0"
              max="1"
              step="0.01"
              onChange={this.props.handleVolumeChange}
            />
          </button>
      </section>
    );
  }
}

export default PlayerBar;
