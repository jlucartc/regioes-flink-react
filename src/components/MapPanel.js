import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';

export default class MainPanel extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      markers: this.props.markers,
      areas: this.props.areas
    }

  }

  render(){
    return(
      <div className="col-9 h-100" style={{backgroundColor:"#bbbbbb"}}>
          <Map
            center={[0,0]}
            zoom={13}
            className="h-100"
            onclick={this.props.clickBehaviour}
          >
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            {!this.props.regioes ? null : this.props.regioes}
            {!this.props.raios ? null : this.props.raios}
            {!this.props.novoRaio ? null : this.props.novoRaio}
            {!this.props.novaRegiao ? null : this.props.novaRegiao}
            <Polygon positions={[[0,0],[1,0],[1,1],[0,1]]}>
            </Polygon>
          </Map>
      </div>
    )
  }

}
