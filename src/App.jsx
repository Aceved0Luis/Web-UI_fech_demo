import { useEffect, useState, } from 'react'
import './App.css'
import axiosInstance from './api';
import Summary from './component/Sumary';
import Carousel from './component/Carousel';


/**
 * 1. Fix Issues on Carrousel : check
 * 2. every card on Carrousel must have image :
 * 3. the image must come from the api
 * you can use UseEffect or UseState to solve the issues on the project
 */

function App() {
  const [pokeList, setPokeList] = useState([])
  const [selectedPoke, setSelectedPoke] = useState({})
  const [imgPoke, setImgPoke] = useState({})
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(()=>{
    const fetchData = async ()=> {
      const data = await axiosInstance.get('/pokemon?limit=8&offset=0');
      setPokeList(data.data.results)
    }
    fetchData()
  },[])

  useEffect(()=>{
    const getImage = async (url)=> {
      const image = await axiosInstance.get(url)
      setImgPoke({name:image.data.name ,img: image.data.sprites.front_default})
    }
    pokeList.map((poke)=>{
      getImage(poke.url)
    })
    
  },[pokeList])

  const getInfo = async (url)=> {
    const data = await axiosInstance.get(url)
    setSelectedPoke({img: data.data.sprites.front_default, stats:data.data.stats})
  } 

  const getPokemonList = ()=> {
    return pokeList.map((pokemon)=>{
      //const img = imgPoke.filter(photo => photo.name === pokemon.name)
      return {
        name: pokemon.name,
        img: imgPoke.img,
        onClick: ()=> getInfo(pokemon.url)
      }
    })
  }
  const onNextPage = async()=> {
    setPage(page + 1);
    const data = await axiosInstance.get(`/pokemon?limit=8&offset=${page}`);
    setPokeList(data.data.results)
  }
  const onPrevPage = async()=> {
    if (page > 0)
      setPage(page - 1);
      const data = await axiosInstance.get(`/pokemon?limit=8&offset=${page}`);
      setPokeList(data.data.results)
  
  }

  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={()=> setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={ isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode? 'text-white': 'text-black' }`}> PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={getPokemonList()}/>
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke}/>}
      </div>
    </div>
  )
}

export default App
