import React from 'react';

export default function Repositorio({ match }) {
  return (
    //Eu sei que é um repositorio pq eu passei na rota /:repositorio
    //E eu decodifiquei, pois eu codifiquei para ele não entender que seja algo de pasta e etc
    <h1 style={{ color: "#FFF" }}>
      {decodeURIComponent(match.params.repositorio)}
    </h1>
  )
}