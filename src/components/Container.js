import React from 'react';
import MapPanel from './MapPanel';
import SideMenu from './SideMenu';
import { Map, Marker, Popup, TileLayer, Polygon, Circle } from 'react-leaflet';

export default class Container extends React.Component {

  constructor(props){
    super(props);
    console.log(this.props);

    var regioes = this.getRegioes()
    var raios  = this.getRaios()

    this.state = {
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
      op : null,
      regioes : regioes,
      raios : raios,
      nome: null,
      raio: '',
      novoRaioPoint : null,
      novaRegiaoPoints: [],
      novaRegiao: null,
      novoRaio: null,
      queryResultPoints : [],
      clickBehaviour: null,
    }

    this.addRegiao = this.addRegiao.bind(this)
    this.addRaio = this.addRaio.bind(this)
    this.fazConsulta = this.fazConsulta.bind(this)
    this.salvarDados = this.salvarDados.bind(this)
    this.resetarDados = this.resetarDados.bind(this)
    this.cancelarOperacao = this.cancelarOperacao.bind(this)
    this.insertRaioPoint = this.insertRaioPoint.bind(this)
    this.insertRegiaoPoints = this.insertRegiaoPoints.bind(this)
    this.alteraRaio = this.alteraRaio.bind(this)

  }

  render(){
    return(
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-3 h-100" style={{backgroundColor:"#dddddd"}}>
            <div className="container-fluid">
              <div className="row">
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRegiao} className="btn btn-primary btn-block">Adicionar região</button> </div>
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRaio} className="btn btn-primary btn-block">Adicionar raio</button> </div>
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.fazConsulta} className="btn btn-primary btn-block">Fazer consulta</button> </div>
              </div>
              { this.state.hideSecondaryButtons ? null :
              <div className="row my-2">
                  <div className="col-12 my-2"> <input className="form-control" placeholder="Nome"/> </div>
                  { this.state.op === "região" ? null : <div className="col-12 my-2"> <input value={this.state.raio} onChange={this.alteraRaio} className="form-control" placeholder="Raio"/></div> }
                  <div className="col-12 my-2"> <button onClick={this.salvarDados} className="btn btn-primary btn-block">Salvar {this.state.op}</button> </div>
                  <div className="col-12 my-2"> <button onClick={this.resetarDados} className="btn btn-primary btn-block">Resetar {this.state.op}</button> </div>
                  <div className="col-12 my-2"> <button onClick={this.cancelarOperacao} className="btn btn-primary btn-block">Cancelar {this.state.op}</button> </div>
              </div>
              }
            </div>
          </div>
          <MapPanel clickBehaviour={this.state.clickBehaviour} regioes={this.state.regioes} raios={this.state.raios} novaRegiao={this.state.novaRegiao} novoRaio={this.state.novoRaio}/>
        </div>
      </div>
    );
  }

  alteraRaio(event){


    this.setState({
      raio : event.target.value,
    },() => {
      var novoRaio = <Circle center={this.state.novoRaioPoint} radius={(this.state.raio == null) ? 0 : this.state.raio}></Circle>
      this.setState({novoRaio : novoRaio})
    })

  }

  addRegiao(){

    this.setState({
      op : 'região',
      disableMainButtons : true,
      hideSecondaryButtons : false,
      hideQueryButtons : true,
      clickBehaviour : this.insertRegiaoPoints,
    })

  }

  addRaio(){

    this.setState({
      op: 'raio',
      disableMainButtons : true,
      hideSecondaryButtons : false,
      hideQueryButtons : true,
      clickBehaviour : this.insertRaioPoint,
    })

  }

  getRegioes(){

    var http = new XMLHttpRequest();
    http.open('GET','http://localhost:8081/getPolygons');
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          this.setState({ existentPolygons : data})
      }
    }

    http.send();


  }

  getRaios(){

    var http = new XMLHttpRequest();
    http.open('GET','http://localhost:8081/getCircles');
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          this.setState({ existentPolygons : data})
      }
    }

    http.send();

  }

  salvarDados(){

    if(this.state.novaRegiaoPoints.length > 0){

      var http = new XMLHttpRequest();
      http.open('GET','http://localhost:8081/saveRegiao');
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            this.setState({novaRegiaoPoints : [], nome : null, op : null},() => {})
        }else{

            alert("Dados inválidos")

        }
      }

      var params = new Object()

      params.regiao = this.state.novaRegiaoPoints
      params.nome = this.state.nome

      http.send(params);

    }else if(this.state.novoRaio.length > 0){

      var http = new XMLHttpRequest();
      http.open('GET','http://localhost:8081/saveRaio');
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            this.setState({novaRegiaoPoints : [], nome : null, op : null},() => {})
        }else{

          alert("Dados inválidos")

        }
      }

      var params = new Object()

      params.raio = this.state.raio
      params.nome = this.state.nome
      params.ponto = this.state.novoRaioPoint

      http.send(params);

    }


  }

  resetarDados(){

    this.setState({
      nome: null,
      raio: '',
      novoRaioPoint : null,
      novaRegiao: null,
      novoRaio: null,
      novaRegiaoPoints: [],
    })

  }

  cancelarOperacao(){

    this.setState({
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
      op : null,
      nome: null,
      raio: '',
      novoRaio: null,
      novaRegiao: null,
      novoRaioPoint : null,
      novaRegiaoPoints: [],
      queryResultPoints : []
    })

  }

  fazConsulta(){

  }

  insertRegiaoPoints(event){

    var currentPoints = this.state.novaRegiaoPoints
    currentPoints.push([event.latlng.lat,event.latlng.lng])
    this.setState({
      novaRegiaoPoints : currentPoints,
    },() => {

      this.setState({novaRegiao : <Polygon color="purple" positions={[this.state.novaRegiaoPoints]}/>})

    })

  }

  insertRaioPoint(event){

    var newRaio = <Circle center={[event.latlng.lat,event.latlng.lng]} radius={(this.state.raio == null) ? 0 : this.state.raio}></Circle>
    this.setState({ novoRaio : newRaio, novoRaioPoint : [event.latlng.lat,event.latlng.lng] }, () => {

      /* ponto foi atualizado */

    })

  }

  alterarRaio(event){

    this.setState({raio : event.target.value},() => {

      /* raio foi atualizado */

    })

  }


}
