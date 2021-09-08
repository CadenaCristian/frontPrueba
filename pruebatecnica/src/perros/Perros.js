import React, { useState, useEffect, Fragment } from 'react';
import { address } from "../config/conexion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { Button, Modal } from 'react-bootstrap';

const Perros = () => {

    const [arrayImg, setArrayImg] = useState([]);
    const [arrayImgFav, setarrayImgFav] = useState([]);
    const [actualId, setactualId] = useState();
    const [mosBotones, setmosBotones] = useState(true);
    const [show, setShow] = useState(false);

    const [perroActual, setperroActual] = useState({})

    // Este service es el encragado de cerrar el modal
    const handleClose = () => {
        setmosBotones(true);
        setShow(false);
    }

    // Este service es el encragado de mostrar el modal con los datos especificos para el perro seleccionado
    const handleShow = (index, id) => {
        setperroActual({
            "id": arrayImg[index].id,
            "dogName": arrayImg[index].dogName,
            "race": arrayImg[index].race,
            "age": arrayImg[index].age,
            "picture": arrayImg[index].picture
        })
        setactualId(index)
        setShow(true);
    }


    // Este service es el encragado de listar los perros creados los cuales son retornados por el back, estos mismos estan alamacenados en la 
    // base de datos
    const listarPerros = async () => {
        const peticion = await fetch(`${address}listDog`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const objeto = await peticion.json()
        setArrayImg(objeto.data)
    }

    // Este service es el encargado de capturar los datos diligenciados por el usuario
    const actualizar = (e) => {
        const { name, value } = e.target
        setperroActual({
            ...perroActual,
            [name]: value,
        }
        )
        setmosBotones(false)
        console.log("perroActual:: ", perroActual)
    }

    // Este service es el encragado de guardar y actualizar los datos del perro
    const guardar = async () => {
        const peticion = await fetch(`${address}updateDog`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(perroActual)
        });
        handleClose();
        listarPerros();
    }

    // Este service es el encragado de eliminar el perro seleccionado
    const eliminar = async (e) => {
        const peticion = await fetch(`${address}deleteDog/${e}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        listarPerros();
    }

    // Este service es el encragado de llamar por primera vez al service de listarPerros
    useEffect(() => {
        listarPerros().then(() => { });
    }, [])

    return (
        <div className="container-fluid mt-3">
            <div className="row" style={{ paddingLeft: "65px" }}>
                {arrayImg.map((data, index) => {
                    return (
                        <div className="card col-md-2 m-2" style={{ float: "left" }}>
                            <div className="card-body">
                                <div>
                                    <button className="btn btn-warning col-md-4 offset-1 mb-1" onClick={() => handleShow(index, arrayImg[index].id)}><FontAwesomeIcon icon={faPencilAlt} /></button>
                                    <button className="btn btn-danger col-md-4 offset-1 mb-1" onClick={() => eliminar(arrayImg[index].id)} ><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div>
                                <div className="text-center">
                                    <embed src={`data:image/jpeg;base64,${arrayImg[index].picture}`} style={{ maxWidth: "150px", maxHeight: "150px" }}
                                        type="image/jpeg" alt="Nombre" />
                                </div>
                                <div className="text-left">
                                    <p>{arrayImg[index].dogName}</p>
                                    <p>{arrayImg[index].race}</p>
                                    <p>{arrayImg[index].age}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Modal
                size="ms"
                show={show} onHide={handleClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Editar Perro
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6 text-center">
                                {actualId == undefined ? null :
                                    <Fragment>
                                        <input className="form-control mt-1" name="dogName" type="text" value={perroActual.dogName} onChange={(e) => actualizar(e)} />
                                        <input className="form-control mt-1" name="race" type="text" value={perroActual.race} onChange={(e) => actualizar(e)} />
                                        <input className="form-control mt-1" name="age" type="number" value={perroActual.age} onChange={(e) => actualizar(e)} />
                                        <embed className="mt-2" src={`data:image/jpeg;base64,${perroActual.picture}`} style={{ maxWidth: "150px", maxHeight: "150px" }}
                                            type="image/jpeg" alt="Nombre" />
                                    </Fragment>
                                }
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mt-2">
                                <button disabled={mosBotones} className="btn btn-success col-md-4 offset-2" onClick={() => guardar()}>Actualizar</button>
                                <button className="btn btn-danger col-md-4 offset-1" onClick={() => handleClose()} >Cancelar</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Perros;