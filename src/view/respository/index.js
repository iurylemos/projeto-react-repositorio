import React, { useState, useEffect } from 'react';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions } from './styles';
import api from '../../services/api';
import { FaArrowLeft } from 'react-icons/fa';
// {decodeURIComponent(match.params.repositorio)}
export default function Repositorio({ match }) {

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    //Requisição
    //nome do repositorio é o mesmo que estou recebendo por parãmetro
    async function load() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      // const response = await api.get(`/repos/${nomeRepo}`)
      // const issues = await api.get(`/repos/${nomeRepo}/issues`)
      //Para não ter que fazer duas requisições igual iria fazer
      //Acima para pegar os detalhes e depois as issues
      //Eu faço um array de promisse que assim ele vai executar as duas
      //E devolve para mim em um array só!
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ])

      setRepositorio(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false);

      console.log(repositorioData.data)
      console.log(issuesData.data)
    }

    load();
  }, [match.params.repositorio])


  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: 'open',
          page: page,
          per_page: 5,
        }
      });

      setIssues(response.data);

    }

    loadIssue()
  }, [match.params.repositorio, page])

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }

  return (
    //Eu sei que é um repositorio pq eu passei na rota /:repositorio
    //E eu decodifiquei, pois eu codifiquei para ele não entender que seja algo de pasta e etc
    <Container style={{ color: "#FFF" }}>

      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repositorio.owner.avatar_url}
          alt={repositorio.owner.login}
        />
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
      </Owner>

      <IssuesList>
        {
          issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {
                    issue.labels.map((label) => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))
                  }
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))
        }
      </IssuesList>
      <PageActions>
        <button disabled={page < 2} type='button' onClick={() => handlePage('back')}> Voltar</button>
        <button type='button' onClick={() => handlePage('next')}>Próxima</button>
      </PageActions>

    </Container>
  )
}