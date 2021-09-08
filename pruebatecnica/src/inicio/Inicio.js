import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Perros from '../perros/Perros';
import Imagenes from '../imagenes/Imagenes';
import { address } from "../config/conexion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import defaultImg from '../../src/source/default-placeholder.png';

const Inicio = () => {

    const [inicio, setIncio] = useState(false);
    const [perros, setPerros] = useState(true);
    const [imagenes, setImagenes] = useState(true);
    const [arrayImg, setArrayImg] = useState([]);
    const [mosBotones, setmosBotones] = useState(true);
    const [imgSelect, setimgSelect] = useState(true);
    const [posImag, steposImag] = useState(0);

    // Este service es el encragado de mostrar el contenido de Inicio y ocultar el contenido de perros e imagenes
    const mostrarInicio = () => {
        setIncio(false);
        setPerros(true);
        setImagenes(true);
    }
    // Este service es el encragado de mostrar el contenido de Perros y ocultar el contenido de inicio e imagenes
    const mostrarPerros = () => {
        setIncio(true);
        setPerros(false);
        setImagenes(true);
    }
    // Este service es el encragado de mostrar el contenido de imagenes y ocultar el contenido de inicio y perros
    const mostrarImagenes = () => {
        setIncio(true);
        setPerros(true);
        setImagenes(false);
    }

    // Este service es el encragado de mostrar las imagenes almacenas como favoritas en la base de datos
    const listarFav = async () => {
        const peticion = await fetch(`${address}listFavoritos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const objeto = await peticion.json()
        console.log("Listar favoritos: ", objeto)
        setArrayImg(objeto.data)
        setmosBotones(false)
    }

    // Este service ayuda a identifcar la imagen que se selecciono como favorita
    const fotoSelec = (e) => {
        steposImag(e)
        setimgSelect(false)
    }

    // Este service es el encragado de estructurar el objeto que espera el back para almacenar los datos del perro que se haya creado
    const guardar = async () => {
        let nombrePerro = document.getElementById("nombrePerro").value
        let razaPerro = document.getElementById("razaPerro").value
        let edadPerro = document.getElementById("edadPerro").value
        let fotoPerro = arrayImg[posImag].b64
        const obj = {
            "dogName": nombrePerro,
            "race": razaPerro,
            "age": edadPerro,
            "picture": fotoPerro
        }
        const peticion = await fetch(`${address}createDog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
        limpiar()
    }

    // Este service es el encragado de limpiar los campos del formulario
    const limpiar = () => {
        document.getElementById("nombrePerro").value = ""
        document.getElementById("razaPerro").value = ""
        document.getElementById("edadPerro").value = ""
        setimgSelect(true)
    }
    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="row"><h3 className="text-center bg-danger text-white">Perros</h3></div>
                <div className="row">
                    <div>
                        <button className="btn btn-outline-primary col-md-1" onClick={() => mostrarInicio()}>Inicio</button>
                        <button className="btn btn-outline-primary col-md-1" onClick={() => mostrarPerros()}>Perros</button>
                        <button className="btn btn-outline-primary col-md-1" onClick={() => mostrarImagenes()}>Imágenes</button>
                    </div>
                </div>
                <div className="row">
                    {!inicio ?
                        <div>
                            <div className="col-md-3 mt-4 offset-1" style={{ float: "left" }}>
                                <form>
                                    <div className="mb-3">
                                        <label for="nombre" className="form-label">Nombre</label>
                                        <input type="text" className="form-control" id="nombrePerro" aria-describedby="emailHelp" />
                                    </div>
                                    <div className="mb-3">
                                        <label for="raza" className="form-label">Raza</label>
                                        <input type="text" className="form-control" id="razaPerro" />
                                    </div>
                                    <div className="mb-3">
                                        <label for="edad" className="form-label">Edad</label>
                                        <input type="number" className="form-control" id="edadPerro" />
                                    </div>
                                    <div className="text-center">
                                        {imgSelect == true ? <img src={defaultImg} style={{ maxWidth: "150px", maxHeight: "150px" }} />
                                            : <embed src={`data:image/jpeg;base64,${arrayImg[posImag].b64}`} style={{ maxWidth: "150px", maxHeight: "150px" }}
                                                type="image/jpeg" alt="Nombre" />}
                                        <FontAwesomeIcon className="m-5" icon={faPlusCircle} onClick={() => listarFav()} />
                                    </div>
                                </form>

                            </div>
                            <div className="col-md-7 offset-1" style={{ float: "left" }}>
                                <div className="col-md-12" style={{ maxHeight: "500px", overflow: "auto" }} >
                                    {arrayImg.map((data, index) => {
                                        return (
                                            <div className="card col-md-4 mt-1" key={index} style={{ float: "left" }}>
                                                <div className="card-body text-center">
                                                    <embed src={`data:image/jpeg;base64,${arrayImg[index].b64}`} width="100%" style={{ height: "100px" }}
                                                        type="image/jpeg" alt="Nombre" />
                                                </div>
                                                <div className="form-check m-2">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id={`radio${index}`} onClick={(e) => fotoSelec(index)} />
                                                    <label className="form-check-label" for="flexRadioDefault1">
                                                        Seleccionar
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="col-md-12 mt-2">
                                    <button hidden={mosBotones} className="btn btn-success col-md-4 offset-2" onClick={() => guardar()}>Guardar</button>
                                    <button hidden={mosBotones} className="btn btn-danger col-md-4 offset-1" onClick={() => limpiar()} >Cancelar</button>
                                </div>
                            </div>
                        </div> : null
                    }
                    {!perros ? <Perros /> : null}
                    {!imagenes ? <Imagenes /> : null}
                </div>
            </div>
        </React.Fragment >
    );
}

export default Inicio;