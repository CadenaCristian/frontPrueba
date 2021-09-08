import React, { useState, useEffect } from 'react';
import { address } from "../config/conexion";
import "bootstrap/dist/css/bootstrap.min.css";
import heart from '../../src/source/heart-regular.svg';
import solid from '../../src/source/heart-solid.svg';

const Imagenes = () => {

    const [arrayImg, setArrayImg] = useState([]);
    const [name, setname] = useState('');
    const [base64, setbase64] = useState('');

    // Este service es el encragado de mostrar las imagenes random que retorna el api
    const listarImagenes = async () => {
        const peticion = await fetch(`${address}listImage`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const objeto = await peticion.json()
        setArrayImg(objeto.data)
    }

    // Este service es el encragado de enviarle los datos de la imagen seleccionado como favorita, tambien llama otros service
    const añadirFavoritos = (e) => {
        console.log(e)
        if (arrayImg[e].favorito === false) {
            arrayImg[e].favorito = true
        }
        else if (arrayImg[e].favorito === true) {
            arrayImg[e].favorito = false
        }
        setArrayImg(arrayImg);
        setname(arrayImg[e].name);
        convertirB64(arrayImg[e].url);
    }

    // Este service es el encragado de convertir la imagen seleccionada en el service anterior, esta se convirte en un base64
    const convertirB64 = (file) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", file, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            console.log(this.response);
            var reader = new FileReader();
            reader.onload = function (event) {
                var res = event.target.result;
                setbase64(event.target.result);
            }
            var file = this.response;
            reader.readAsDataURL(file)
        };
        xhr.send()
        addFav();
    };

    // Este service es el encragado de enviar los datos al back despues de que la imagen sea convertida a base64
    const addFav = async () => {
        const obj = {
            "imgName": name,
            "b64": base64
        }
        console.log("obje: ", obj)
        const peticion = await fetch(`${address}addFavoritos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
    }

    // Este service es el encragado de hacer un primer llamado del listado de imagenes que retorna listarImagenes
    useEffect(() => {
        listarImagenes().then(() => { });
    }, [])

    return (
        <div className="container mt-3">
            <div className="row">
                {arrayImg.map((data, index) => {
                    return (
                        <div className="card col-md-3 mt-2" style={{ float: "left" }}>
                            {arrayImg[index].favorito === false
                                ? <img className="mt-3" src={heart} style={{ maxWidth: "20px", maxHeight: "20px" }} onClick={(e) => añadirFavoritos(index)} />
                                : <img className="mt-3" src={solid} style={{ maxWidth: "20px", maxHeight: "20px" }} onClick={(e) => añadirFavoritos(index)} />
                            }
                            <div className="card-body text-center">
                                <img src={`${arrayImg[index].url}`} className="card-img-top" style={{ maxWidth: "150px", maxHeight: "150px" }}></img>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Imagenes;