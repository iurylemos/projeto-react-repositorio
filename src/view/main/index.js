import React, { useState, useCallback } from 'react';
//Fonte é font awesome icons
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './main-styled';
import api from '../../services/api';

export default function Main() {

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false)

  function handleInputChange(event) {
    setNewRepo(event);
  }

  //Como vou manipular e trabalhar com state é interessante
  //A utilização do useCallback
  //Se eu tivesse só atualizando ou atribuindo
  //E não pegando dado de uma state e atualizando

  const handleDelete = useCallback((repo) => {
    //Procurando se existe esse nome no array
    const find = repositorios.filter(r => r.name !== repo);
    setRepositorios(find)
  }, [repositorios]);

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

      <List>
        {
          repositorios.map((repo) => (
            <li key={repo.name}>
              <span>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={14} />
                </DeleteButton>
                {repo.name}
              </span>
              <a href="/">
                <FaBars size={20} />
              </a>
            </li>
          ))
        }
      </List>

    </Container>
  )
}
