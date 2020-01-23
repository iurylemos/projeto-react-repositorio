import React, { useState, useCallback } from 'react';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa'
import { Container, Form, SubmitButton } from './main-styled';
import api from '../../services/api';

export default function Main() {

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false)

  function handleInputChange(event) {
    setNewRepo(event);
  }

  const handleSubmit = useCallback((evento) => {

    evento.preventDefault()

    async function submit() {
      setLoading(true)

      try {

        console.log(newRepo)
        const response = await api.get(`repos/${newRepo}`)

        //Aqui eu tinha um array
        //E fiz a descontrução atribuindo ao data

        // console.log(response.data)

        const data = {
          name: response.data.full_name,
        }

        //Como eu quero apenas concatenar, vou botando o operador expred
        //com o que já existe, e atribuindo o data

        setRepositorios([...repositorios, data]);
        setNewRepo('')
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }

    }

    //Chamanado ela para ser executada
    submit();
  }, [newRepo, repositorios])


  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input type="text" placeholder="Adicionar repositórios" value={newRepo} onChange={(e) => handleInputChange(e.target.value)} />
        <SubmitButton loading={loading ? 1 : 0} >
          {
            loading ? (<FaSpinner color="#FFF" size={14} />) : <FaPlus color="#FFF" size={14} />
          }
        </SubmitButton>
      </Form>

    </Container>
  )
}
