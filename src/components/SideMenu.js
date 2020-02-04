import React from 'react';

export default class SideMenu extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
      op : null,
      raios : this.props.raios,
      regioes : this.props.regioes
    }

    this.addRegiao = this.addRegiao.bind(this)
    this.addRaio = this.addRaio.bind(this)
    this.fazConsulta = this.fazConsulta.bind(this)
    this.salvarOperacao = this.salvarOperacao.bind(this)
    this.resetarOperacao = this.resetarOperacao.bind(this)
    this.cancelarOperacao = this.cancelarOperacao.bind(this)
  }

  render(){
    return(
      <div className="col-3 h-100" style={{backgroundColor:"#dddddd"}}>
        <div className="container-fluid">
          <div className="row">
              <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRegiao} className="btn btn-primary btn-block">Adicionar região</button> </div>
              <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.addRaio} className="btn btn-primary btn-block">Adicionar ponto</button> </div>
              <div className="col-12 my-2"> <button disabled={this.state.disableMainButtons} onClick={this.fazConsulta} className="btn btn-primary btn-block">Fazer consulta</button> </div>
          </div>
          { this.state.hideSecondaryButtons ? null :
          <div className="row my-2">
              <div className="col-12 my-2"> <input className="form-control" placeholder="Nome"/> </div>
              { this.state.op == "regiao" ? null : <div className="col-12 my-2"> <input className="form-control" placeholder="Raio"/></div> }
              <div className="col-12 my-2"> <button onClick={this.addRegiao} className="btn btn-primary btn-block">Salvar {this.state.op}</button> </div>
              <div className="col-12 my-2"> <button onClick={this.addRaio} className="btn btn-primary btn-block">Resetar {this.state.op}</button> </div>
              <div className="col-12 my-2"> <button onClick={this.fazConsulta} className="btn btn-primary btn-block">Cancelar {this.state.op}</button> </div>
          </div>
          }
        </div>
      </div>
    )
  }

  addRegiao(){

      this.setState({
        op : "regiao",
        disableMainButtons : true,
        hideSecondaryButtons : false,
      },() =>{

        this.props.addRegiao()

      })

  }

  addRaio(){

    this.setState({
      op : "raio",
      disableMainButtons : true,
      hideSecondaryButtons : false,
    },() => {

      this.props.addRaio()

    })

  }

  fazConsulta(){

    this.setState({
      op : "consulta",
      disableMainButtons : true,
      hideQueryButtons : false
    },() => {

      this.props.fazConsulta()

    })

  }

  salvarOperacao(){

    this.setState({
      op : null,
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
    },() => {

      this.props.salvarOperacao()

    })

  }

  resetarOperacao(){

    this.props.resetarOperacao()

  }

  cancelarOperacao(){

    this.setState({
      op : null,
      disableMainButtons : false,
      hideSecondaryButtons : true,
      hideQueryButtons : true,
    },() => {

      this.props.cancelarOperacao()

    })

  }





}
