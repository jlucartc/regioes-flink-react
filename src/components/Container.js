import React from 'react';
import MapPanel from './MapPanel';
import SideMenu from './SideMenu';
import { Map, Marker, Popup, TileLayer, Polygon, Circle, Tooltip } from 'react-leaflet';

export default class Container extends React.Component {

  constructor(props){
    super(props);

    //this.getRaios = this.getRaios.bind(this)
    //this.getRegioes = this.getRegioes.bind(this)
    this.addRegiao = this.addRegiao.bind(this)
    this.addRaio = this.addRaio.bind(this)
    this.fazConsulta = this.fazConsulta.bind(this)
    this.salvarDados = this.salvarDados.bind(this)
    this.resetarDados = this.resetarDados.bind(this)
    this.cancelarOperacao = this.cancelarOperacao.bind(this)
    this.insertRaioPoint = this.insertRaioPoint.bind(this)
    this.insertRegiaoPoints = this.insertRegiaoPoints.bind(this)
    this.alteraRaio = this.alteraRaio.bind(this)
    this.alteraNome = this.alteraNome.bind(this)
    this.selectArea = this.selectArea.bind(this)
    this.setInicio = this.setInicio.bind(this)
    this.setFim = this.setFim.bind(this)
    this.liberaFormularioConsulta = this.liberaFormularioConsulta.bind(this)

    this.state = {
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
      op : null,
      focusedArea : null,
      focusedAreaType : null,
      dataInicio: '',
      dataFim: '',
      areas : null,
      nome: '',
      raio: '',
      novoRaioPoint : null,
      novaRegiaoPoints: [],
      novaRegiao: null,
      novoRaio: null,
      queryResultPoints : [],
      clickBehaviour: null,
    }

    //this.getRegioes()
    //this.getRaios()
    this.getAreas()

  }

  render(){
    return(
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-3 h-100" style={{backgroundColor:"#dddddd"}}>
            <div className="container-fluid">
              <div className="row h-25">
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRegiao} className="btn btn-primary btn-block">Adicionar região</button> </div>
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRaio} className="btn btn-primary btn-block">Adicionar raio</button> </div>
                  <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.liberaFormularioConsulta} className="btn btn-primary btn-block">Fazer consulta</button> </div>
              </div>
              { this.state.hideSecondaryButtons ? null :
                <div className="row my-2 h-25">
                    <div className="col-12 my-2 h-100"> <input onChange={this.alteraNome} value={this.state.nome} className="form-control" placeholder="Nome"/> </div>
                    { this.state.op === "região" ? null : <div className="col-12 my-2"> <input value={this.state.raio} onChange={this.alteraRaio} className="form-control" placeholder="Raio"/></div> }
                    <div className="col-12 my-2"> <button onClick={this.salvarDados} className="btn btn-primary btn-block">Salvar {this.state.op}</button> </div>
                    <div className="col-12 my-2"> <button onClick={this.resetarDados} className="btn btn-primary btn-block">Resetar {this.state.op}</button> </div>
                    <div className="col-12 my-2"> <button onClick={this.cancelarOperacao} className="btn btn-primary btn-block">Cancelar {this.state.op}</button> </div>
                </div>
              }
              { (this.state.areas == null) ? null :
                <div className="row my-2 mh-75">
                  <div className="col-12">
                    <h5 className="mt-2">Áreas</h5>
                    <select onChange={this.selectArea} className="form-control">
                    {(this.state.areas == null) ? null : this.state.areas.map((val) => {

                      return <option className="form-control" key={val.key} value={val.key}>{val.key}</option>

                    })
                    }
                    </select>
                  </div>
                </div>
              }
              {this.state.hideQueryButtons ? null :
                <div className="row my-2 mh-75">
                  <div className="col-12">
                    <h5 className="mt-2">Inicio</h5>
                    <input onChange={this.setInicio} value={this.state.dataInicio} className="form-control" type="date"/>
                  </div>
                  <div className="col-12">
                    <h5 className="mt-2">Fim</h5>
                    <input onChange={this.setFim} value={this.state.dataFim} className="form-control" type="date"/>
                  </div>
                  <div className="col-12">
                    <button onClick={this.fazConsulta} className="btn btn-block btn-primary">Confirmar consulta</button>
                  </div>
                </div>
              }
            </div>
          </div>
          <MapPanel clickBehaviour={this.state.clickBehaviour} areas={this.state.areas} novaRegiao={this.state.novaRegiao} novoRaio={this.state.novoRaio}/>
        </div>
      </div>
    );
  }

  alteraRaio(event){

    this.setState({
      raio : event.target.value,
    },() => {
      if(this.state.novoRaioPoint != null){
        var n = <Circle center={this.state.novoRaioPoint} radius={(this.state.raio == '') ? 0 : this.state.raio}></Circle>
        this.setState({novoRaio : n})
      }else{
      }
    })

  }

  alteraNome(event){

    this.setState({
      nome : event.target.value,
    },() => {

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

  /*getRegioes(){

    var http = new XMLHttpRequest();
    http.open('GET','http://localhost:8081/getRegioes');
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = (e) => {
      if (e.srcElement.readyState == 4 && e.srcElement.status == 200) {
          var data = JSON.parse(e.srcElement.responseText);
          data = data.map((val,index) => {
            console.log("index: ",index)
            if(index == 0){
              var focusColor = "#ff3355"
              var positions = JSON.parse(val.regiao.replace(/\(/g,'[').replace(/\)/g,']'))
              return <Polygon color={focusColor} key={val.nome} positions={positions}><Tooltip>{val.nome}</Tooltip></Polygon>
            }else{
              var positions = JSON.parse(val.regiao.replace(/\(/g,'[').replace(/\)/g,']'))
              return <Polygon key={val.nome} positions={positions}><Tooltip>{val.nome}</Tooltip></Polygon>
            }

          })
          this.setState({ regioes : data, focusedRegiao : data[0].key})
      }
    }

    http.send();


  }

  getRaios(){

    var http = new XMLHttpRequest();
    http.open('GET','http://localhost:8081/getRaios');
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = (e) => {
      if (e.srcElement.readyState == 4 && e.srcElement.status == 200) {
          var data = JSON.parse(e.srcElement.responseText);
          data = data.map((val,index) => {

            var ponto = [val.raio.x,val.raio.y]
            var radius = val.raio.radius
            var key = val.nome
            if(index == 0){
              var focusColor = "#ff3355"
              return <Circle key={key} center={ponto} radius={radius}>
                          <Tooltip>{val.nome}<br/>Coordenadas:{val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Tooltip>
                          <Popup>{val.nome}<br/>Coordenadas: {val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Popup>
                     </Circle>
            }else{
              return <Circle key={key} center={ponto} radius={radius}>
                          <Tooltip>{val.nome}<br/>Coordenadas:{val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Tooltip>
                          <Popup>{val.nome}<br/>Coordenadas: {val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Popup>
                     </Circle>
            }

          })

          console.log(data)

          this.setState({ raios : data, focusedRaio : data[0].key})
      }
    }

    http.send();

  }
  */

  getAreas(){

      var focusColor = "#ff3355"

      var http = new XMLHttpRequest();
      http.open('GET','http://localhost:8081/getAreas');
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = (e) => {
        if (e.srcElement.readyState == 4 && e.srcElement.status == 200) {
            var areas = JSON.parse(e.srcElement.responseText);
            areas = areas.map((val,index) => {

              if(index == 0){

                if(val.hasOwnProperty('raio')){

                  var ponto = [val.raio.x,val.raio.y]
                  var radius = val.raio.radius
                  var key = val.nome

                  return <Circle key={key} center={ponto} radius={radius} color={focusColor} type="raio">
                              <Tooltip>{val.nome}<br/>Coordenadas:{val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Tooltip>
                              <Popup>{val.nome}<br/>Coordenadas: {val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Popup>
                         </Circle>

                }else{

                  var positions = JSON.parse(val.regiao.replace(/\(/g,'[').replace(/\)/g,']'))
                  return <Polygon color={focusColor} key={val.nome} positions={positions} type="regiao" ><Tooltip>{val.nome}</Tooltip></Polygon>

                }

              }else{

                if(val.hasOwnProperty('raio')){

                  var ponto = [val.raio.x,val.raio.y]
                  var radius = val.raio.radius
                  var key = val.nome

                  return <Circle key={key} center={ponto} radius={radius} type="raio">
                              <Tooltip>{val.nome}<br/>Coordenadas:{val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Tooltip>
                              <Popup>{val.nome}<br/>Coordenadas: {val.raio.x},{val.raio.y}<br/>Raio: {radius}m</Popup>
                         </Circle>

                }else{

                  var positions = JSON.parse(val.regiao.replace(/\(/g,'[').replace(/\)/g,']'))
                  return <Polygon key={val.nome} positions={positions} type="regiao"><Tooltip>{val.nome}</Tooltip></Polygon>

                }

              }

            })

            this.setState({areas : areas, focusedArea : areas[0].nome})

        }
      }

      http.send();

  }

  salvarDados(){

    if(this.state.novaRegiaoPoints.length > 0){

      var http = new XMLHttpRequest();
      http.open('POST','http://localhost:8081/saveRegiao');
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = (e) => {

        if (e.srcElement.readyState == 4 && e.srcElement.status == 200) {
            alert(JSON.parse(e.srcElement.responseText).msg)
            this.setState({
              disableMainButtons : false,
              hideSecondaryButtons : true,
              hideQueryButtons : true,
              novaRegiaoPoints : [],
              novaRegiao : null,
              nome : '',
              op : null,
              clickBehaviour : null,

            },() => {})
        }else if(e.srcElement.status != 200){

            alert("Dados inválidos")
            http.abort()

        }
      }

      var params = new Object()

      params.regiao = this.state.novaRegiaoPoints
      params.nome = this.state.nome

      http.send(JSON.stringify(params))

    }else if(this.state.novoRaioPoint.length > 0){

      var http = new XMLHttpRequest();
      http.open('POST','http://localhost:8081/saveRaio');
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = (e) => {
        if (e.srcElement.readyState == 4 && e.srcElement.status == 200) {
            alert(JSON.parse(e.srcElement.responseText).msg)
            this.setState({
              disableMainButtons : false,
              hideSecondaryButtons : true,
              hideQueryButtons : true,
              novoRaioPoint : [],
              novoRaio : null,
              raio : '',
              nome : '',
              op : null,
              clickBehaviour : null,
            },() => {})
        }else if(e.srcElement.status != 200){

          alert("Dados inválidos")
          http.abort()

        }
      }

      var params = new Object()

      params.raio = this.state.raio
      params.nome = this.state.nome
      params.ponto = this.state.novoRaioPoint

      http.send(JSON.stringify(params));

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
      nome: '',
      raio: '',
      novoRaio: null,
      novaRegiao: null,
      novoRaioPoint : null,
      novaRegiaoPoints: [],
      queryResultPoints : []
    })

  }

  liberaFormularioConsulta(event){

    this.setState({hideQueryButtons : false})

  }

  fazConsulta(event){

    var http = new XMLHttpRequest()
    http.open('POST','http://localhost:8081/fazConsulta');
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = (e) => {

      if(e.srcElement.readyState == 4 && e.srcElement.status == 200){

        var rows = e.srcElement.responseText

        console.log(rows)

      }else if(e.srcElement.status != 200){

        /* failed request */

      }

    }

    var params = new Object()

    params.key = this.state.focusedArea
    params.type = this.state.focusedAreaType
    params.inicio = this.state.dataInicio
    params.fim = this.state.dataFim

    http.send(JSON.stringify(params))

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

    var n = <Circle center={[event.latlng.lat,event.latlng.lng]} radius={(this.state.raio == '') ? 0 : this.state.raio}></Circle>
    this.setState({
      novoRaio : n,
      novoRaioPoint : [event.latlng.lat,event.latlng.lng],
    },() => {

    })

  }

  alterarRaio(event){

    this.setState({raio : event.target.value},() => {

      /* raio foi atualizado */

    })

  }
  /*
  selectRaio(event){

    console.log(event.target.value)

    var newFocusedRaio = ""

    var raios = this.state.raios.map((val) => {

      var focusColor = "#ff3355"
      var defaultColor = "#3388ff"

      if(val.key == event.target.value){

        var key = val.key
        var center = val.props.center
        var radius = val.props.radius
        newFocusedRaio = val.key

        return <Circle color={focusColor} key={key} center={center} radius={radius}>
                  <Tooltip>{val.nome}<br/>Coordenadas:{center}<br/>Raio: {radius}m</Tooltip>
                  <Popup>{val.nome}<br/>Coordenadas: {center}<br/>Raio: {radius}m</Popup>
               </Circle>


      }else if(val.key == this.state.focusedRaio){

        var key = val.key
        var center = val.props.center
        var radius = val.props.radius

        return <Circle color={defaultColor} key={key} center={center} radius={radius}>
                  <Tooltip>{val.nome}<br/>Coordenadas:{center}<br/>Raio: {radius}m</Tooltip>
                  <Popup>{val.nome}<br/>Coordenadas: {center}<br/>Raio: {radius}m</Popup>
               </Circle>

      }else{

        return val

      }


    })

    this.setState({raios : raios, focusedRaio : newFocusedRaio})

  }

  selectRegiao(event){

    console.log(event.target.value)

    var newFocusedRegion = ""

    var regioes = this.state.regioes.map((val) => {

      var focusColor = "#ff3355"
      var defaultColor = "#3388ff"

      if(val.key == event.target.value){

        console.log("newFocusedRegion: ",val.key)
        newFocusedRegion = val.key

        var key = val.key
        var positions = val.props.positions

        return <Polygon color={focusColor} key={key} positions={positions}>
                  <Tooltip>{val.key}</Tooltip>
                  <Popup>{val.key}</Popup>
               </Polygon>


      }else if(val.key == this.state.focusedRegiao){

        console.log("focusedRegiao: ",val.key)

        var key = val.key
        var positions = val.props.positions

        return <Polygon color={defaultColor} key={key} positions={positions}>
                  <Tooltip>{val.key}</Tooltip>
                  <Popup>{val.key}</Popup>
               </Polygon>

      }else{

        return val

      }


    })

    this.setState({regioes : regioes, focusedRegiao : newFocusedRegion})

  }
  */
  selectArea(event){

    console.log(event.target.value)

    var newFocusedArea = ""
    var areas = this.state.areas
    var newFocusedAreaType = ""

    areas = areas.map((val) => {

      var focusColor = "#ff3355"
      var defaultColor = "#3388ff"

      if(val.key == event.target.value){

        newFocusedArea = val.key
        newFocusedAreaType = val.props.type

        if(val.props.hasOwnProperty('radius')){

          var key = val.key
          var center = val.props.center
          var radius = val.props.radius
          var type = val.props.type

          return <Circle color={focusColor} key={key} center={center} radius={radius} type={type}>
                    <Tooltip>{val.nome}<br/>Coordenadas:{center}<br/>Raio: {radius}m</Tooltip>
                    <Popup>{val.nome}<br/>Coordenadas: {center}<br/>Raio: {radius}m</Popup>
                 </Circle>

        }else{

          var positions = val.props.positions
          var key = val.key
          var type = val.props.type

          return <Polygon color={focusColor} key={key} positions={positions} type={type}>
                    <Tooltip>{val.key}</Tooltip>
                    <Popup>{val.key}</Popup>
                 </Polygon>

        }


      }else if(val.key == this.state.focusedArea){

        if(val.props.hasOwnProperty('radius')){

          var key = val.key
          var center = val.props.center
          var radius = val.props.radius
          var type = val.props.type

          return <Circle color={defaultColor} key={key} center={center} radius={radius} type={type}>
                    <Tooltip>{val.nome}<br/>Coordenadas:{center}<br/>Raio: {radius}m</Tooltip>
                    <Popup>{val.nome}<br/>Coordenadas: {center}<br/>Raio: {radius}m</Popup>
                 </Circle>

        }else{

          var key = val.key
          var positions = val.props.positions
          var type = val.props.type

          return <Polygon color={defaultColor} key={key} positions={positions} type={type}>
                    <Tooltip>{val.key}</Tooltip>
                    <Popup>{val.key}</Popup>
                 </Polygon>

        }

      }else{

        return val

      }


    })

    this.setState({areas : areas, focusedArea : newFocusedArea, focusedAreaType : newFocusedAreaType})

  }

  setInicio(event){

    console.log(event.target.value)
    this.setState({dataInicio : event.target.value})

  }

  setFim(event){

    console.log(event.target.value)
    this.setState({dataFim : event.target.value})

  }

}
