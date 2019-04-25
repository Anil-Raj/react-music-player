import React, { Component } from 'react';
import albumData from './../data/albums.js';
import PlayerBar from './PlayerBar.js';

 var Direction = {
  ASCENDING:1, DESCENDING:2
 }
 
class Album extends Component {
  constructor(props){
    super(props);

    const album = albumData[0]
    this.state = {
      album: album,
      currentSong: album.songs[0],
      isHovered: false,
      isPlaying: false,
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0,
      sortBy: {value:0,direction:Direction.ASCENDING}
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    console.log(this.audioElement.volume);
  }

  componentDidMount(){
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime});
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ volume: this.audioElement.volume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }
  sort(a,b,direction){
    return (direction === Direction.DESCENDING ) ? (a>b?1:-1):(b>a?1:-1) ;
  }
  handleSort(sortByKey){
    const oppDirection =  this.state.sortBy.direction == Direction.ASCENDING?Direction.DESCENDING: Direction.ASCENDING;
    const sortedSongs = sortByKey == 1?
                        this.state.album.songs.sort((a,b)=> this.sort(parseFloat(a.duration),parseFloat(b.duration),oppDirection)) : 
                        this.state.album.songs.sort((a,b)=>this.sort(a.title,b.title,oppDirection));
    this.setState({album:{...this.state.album,songs:sortedSongs},sortBy:{value:sortByKey,direction:oppDirection}})
  }
  handleSearch(e){
    this.setState({album:{...this.state.album,songs:albumData[0].songs.filter(song=>song.title.toLowerCase().indexOf(e.target.value.toLowerCase())!=-1)}})
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  play(){
    this.audioElement.play();
    this.setState( {isPlaying: true} );
  }

  pause(){
    this.audioElement.pause();
    this.setState( {isPlaying: false} );
  }

  setSong(song){
    this.audioElement.src = song.audioSrc;
    this.setState( {currentSong: song} );
  }

  toggleSongNumber(song, index){
    if (song === this.state.isHovered) {
      if (song === this.state.currentSong && this.state.isPlaying){
        return <span className="icon ion-md-pause" />
      } else {
        return <span className="icon ion-md-play" />
      }
    } else {
      if (song === this.state.currentSong && this.state.isPlaying){
        return <span className="icon ion-md-pause" />
      } else {
        return index + 1;
      }
    }
  }

// handlers
  handleSongClick(song){
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong){
      this.pause();
    } else {
      if (!isSameSong){
        this.setSong(song);
      }
      this.play();
    }
  }

  handleSongEnter(song){
    this.setState({isHovered: song});
  }

  handleSongLeave(){
    this.setState({isHovered: false});
  }

  handlePrevClick(){
    const currentIndex = this.state.album.songs.findIndex( song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex-1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick(){
    const currentIndex = this.state.album.songs.findIndex( song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length-1, currentIndex+1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e){
    const newTime = this.audioElement.duration*e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState( {currentTime: newTime} );
  }

  handleVolumeChange(e){
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState( {volume: newVolume} );
  }

// formatting time
  formatTime(time){
    let stringTime = "";
    let minutes = Math.trunc(time/60);
    let seconds = Math.floor(time%60);

    if (time >= 0 && !isNaN(time)){
      if (seconds < 10){
        stringTime = minutes+":0"+seconds;
      } else {
        stringTime = minutes+":"+seconds;
      }
      return stringTime;
    } else {
      return "-:--";
    }
  }

  render(){
    return (
      <section className="album">
        <section id="album-info">
          <img id='album-cover-art'
               src={this.state.album.albumCover}
               alt={this.state.album.title} />
          <div className='album-details'>
            <h1 id='album-title'>{this.state.album.title}</h1>
            <h2 className='artist'>{this.state.album.artist}</h2>
          </div>
        </section>

        <table id='song-list'>
          <colgroup>
            <col id='song-number-column' />
            <col id='song-title-column' />
            <col id='song-duration-column' />
          </colgroup>
          <tbody>
            <tr  >            
              <td className="song-index"></td>
              <td className="song-title-td" onClick={()=>this.handleSort(0)}>Song Title {this.state.sortBy.value == 0 && (this.state.sortBy.direction == Direction.ASCENDING ? 'V' : '^')} <input type="text" onChange={(e)=>this.handleSearch(e)}/></td>
              <td className="song-duration-td" onClick={()=>this.handleSort(1)}>Duration {this.state.sortBy.value == 1 && (this.state.sortBy.direction == Direction.ASCENDING ? 'V' : '^')}</td>
              </tr> 
          {this.state.album.songs.map( (song, index) =>
            <tr className="song" className={index%2 == 0 ? 'even-song-row' : 'odd-song-row'}
                key={index}
                onClick={() => this.handleSongClick(song)}
                onMouseEnter={() => this.handleSongEnter(song)}
                onMouseLeave={() => this.handleSongLeave()}>
              <td className="song-index">{this.toggleSongNumber(song, index)}</td>
              <td className="song-title-td">{song.title}</td>
              <td className="song-duration-td">{this.formatTime(song.duration)}</td>
            </tr>)}
          </tbody>
        </table>

        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          volume={this.audioElement.volume}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(time) => this.formatTime(time)}
        />
      </section>
    );
  }
}

export default Album;
