import React, { useState, useCallback, useEffect } from 'react';
//Fonte é font awesome icons
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './main-styled';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Main() {

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  //DidMount - Buscar todas as vezes que ele iniciar
  useEffect(() => {
    const repoStorage = localStorage.getItem('repos')

    //E se tiver eu passo para o setRepositorios transformando de novo em um array
    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage))
    }

  }, [])



  //DidUpdate - Salvar Alterações
  //Quando ela sofrer alterações ela vai salvar aqui
  //JSON stringify é para transformar em um objeto em string
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositorios))
  }, [repositorios])


  function handleInputChange(event) {
    setNewRepo(event);
    setAlert(null);
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
      setAlert(null)

      try {

        if (newRepo === '') {
          throw new Error('Você precisa indicar um repositório')
        }

        console.log(newRepo)
        const response = await api.get(`repos/${newRepo}`)

        //Verificando se há repositório duplicado
        //Vou varrendo o array verificando se existe o repo.name igual o que eu digitei
        const hasRepo = repositorios.find(repo => repo.name === newRepo)

        if (hasRepo) {
          throw new Error('Repositório duplicado')
        }

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
        setAlert(true)
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

      <Form onSubmit={handleSubmit} error={alert}>
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
              {/* Utilizando o encodeURIComponent para indiciar que isso é um parâmetro para a URL
              Pois se tivesse angular/angular ia dar error pois o react iria entender
              Que está subindo um nível de pasta */}
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                <FaBars size={20} />
              </Link>
            </li>
          ))
        }
      </List>

    </Container>
  )
}
