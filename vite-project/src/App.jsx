import { Fragment, useState,useEffect,React } from 'react'
import './App.css'

function ButtonWithLoading(){
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const populateList = () => {
    return new Promise(resolve => {
      let pokemon_list=null;
      fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0',{})
      .then(response=>response.json())
      .then((data)=>{
          console.log(`Data Received from API`,data)
        pokemon_list=data.results
        // console.log(pokemon_list)
    
    
        pokemon_list.forEach((item)=>{
          let name=item.name
          let link=item.url
          
          let body=JSON.stringify({
            name:name,
            link:link
          })
             fetch('/db',{
          method:'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:body
          })
        
    
          //populate type
          populateTypes(name);
    
    
          //populate evolution
          findEvolutionStage(name)
    
          
        
        })

        resolve(true);
    
        })
        
        // console.log(`Data Received from API`,data)
    
    });
  };

  const handleClick = async () => {
    setIsVisible(false);
    setIsLoading(true);

    const result = await populateList();

    setIsLoading(false);
    setIsVisible(result);
  };

  return (
    <div>
      {isVisible ? (
        <button class="UpdateBtn" onClick={handleClick}>Update Latest Data!</button>
      ) : null}
      {isLoading ? <button class="UpdatingBtn">Updating</button> : null}
    </div>
  );
};




function InputData({type,evo,updateevo,updatetype,fetchdata}){

  

    return (<div className='input-div'>

    <img src="pokedex.webp" alt="Girl in a jacket" width="200" height="200"/>
     <form>
    
          <input value={type}
           onChange={(e)=>{updatetype(e.target.value)}}
           type='text' 
           placeholder='Type: Eg.fire,grass,flying,fighting '></input>
    
           <input value={evo}
           type='text' 
           placeholder='Evolution stage:1,2,3'
           onChange={(e)=>{updateevo(e.target.value)}}></input>
    
           
        </form>
        <button className='search-btn' onClick={fetchdata}>Search Pokedex</button>
        <ButtonWithLoading/>
        </div>)
  }
  
  
   



function DisplayData({showData,recievedData,heading}){
  const [page,setpage]=useState(1)
  const [limit,setlimit]=useState(10)
  const [totalpage,settotalpage]=useState(2)

  

  if(showData){
    return <div className='Output-red-box'>
      
      <div>
        <h2>Pokemons Found</h2>
        <DisplayTable data={recievedData}
        page={page}
        setpage={setpage}
        limit={limit}
        totalpage={totalpage}
        settotalpage={settotalpage}/>
        
      </div>
    </div>
  }
  else
  return

}

function DisplayTable({data,page,limit,totalpage,setpage,settotalpage}){
  
  let datalength=data.length;
  let newTotalPage=Math.ceil(datalength/limit)
  console.log(`newTotalLength  ${newTotalPage}`)
  settotalpage(newTotalPage)
  // console.log(`Data in Display Table`)
  // console.log(list)
  let startingindex=(page-1)*limit;
  let endingindex=startingindex+(limit);
  let list=data.slice(startingindex,endingindex)
  function handleclickleft(){
    if(page>1)
    setpage((page-1))
  }
  function handleclickright(){
    if(page<totalpage)
    setpage((page+1))
  }
  return(
    <table>
          <thead>
          <tr>
            <th >S.No</th> 
            <th>Name</th> 
          </tr>
          </thead>
          
          <tbody>
            <ListPokemon list={list}></ListPokemon> 
            <tr>
              
              <button className='left' onClick={handleclickleft}>&#8592;</button>
              <span className="pagedetails">{page} of {totalpage}</span>
              <button className='right' onClick={handleclickright}>&#8594;</button>
              
              
              
            </tr>
          </tbody>
        
        </table>
  )
}

function ListPokemon({list}){
  var pokemon_list=list.map((value,index)=>{
    if(index<10)
     return <tr>
      <td>{index+1}</td>
      <td>{value.name}</td>
      </tr>

     
  })

  return <div className='output-list'>{pokemon_list}</div>

}


function populatePokemonList(){
  let pokemon_list=null;
  fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0',{})
  .then(response=>response.json()).then((data)=>{
      console.log(`Data Received from API`,data)
    pokemon_list=data.results
    // console.log(pokemon_list)


    pokemon_list.forEach((item)=>{
      let name=item.name
      let link=item.url
      
      let body=JSON.stringify({
        name:name,
        link:link
      })
         fetch('http://localhost:3000/db',{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body:body
      })
    

      //populate type
      populateTypes(name);


      //populate evolution
      findEvolutionStage(name)

    
    })

    })
    
    // console.log(`Data Received from API`,data)
    
 
  }
  


function populateTypes(pokemon_name){
  let types=[];
  let pokemon_data;
  let newpokemon_data;

//fetch pokemon from API
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`,{})
  .then(response=>response.json())
  .then((data)=>{
    data.types.forEach((item)=>{

      let type=item.type.name;
      types.push(type)
      
    })

    console.log(types)


    //fetch pokemon from Database
    fetch(`http://localhost:3000/db/${pokemon_name}`)
    .then(response=>response.json())
    .then((data)=>{
      pokemon_data=data[0]
      console.log(`data retrived: ${JSON.stringify(pokemon_data)}`)
  
      newpokemon_data=Object.assign(pokemon_data=data[0],{ type:types})
      console.log(`New Data: ${JSON.stringify(newpokemon_data)}`)
  
      //Update pokemon Type in Database
      fetch('http://localhost:3000/db/updateType',{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify(newpokemon_data)
      })
      .then(response=>response.json())
      .then((data)=>{
        console.log(`Recived DAta after Update request ${JSON.stringify(data)}]`)
      })
  
  
    })
  
  

  })

  
}  

// function evolveAPIcall(pokemon_name){
//   if(!pokemon_name)
//   return null

//   return new Promise((resolve)=>{
//     fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_name}`,{})
//     .then(response=>response.json())
//     .then((data=>{
//       var evolve_from=data.evolves_from_species;
//       if(evolve_from!==null)
//       return resolve(evolve_from)
//       else
//       return resolve(null);
//     }))
//   })


// }
// async function populateEVolution(pokemon_name){

//     let evoNumber = await evolvefrom(pokemon_name, 0)
//     console.log(evoNumber)        
// }

// async function evolvefrom(pokemon_name, counter){
//   //var counter=0;
  
//   console.log(`Pokemon Name ${pokemon_name}`)
//   // fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_name}`,{})
//   // .then(response=>response.json())
//   // .then((data)=>{

//   //   var evolve_from=data.evolves_from_species;
    
//   //   if(evolve_from!==null)
//   //   {
//   //     console.log(` ${pokemon_name} evolves From: ${JSON.stringify(evolve_from.name)}`)
//   //     var newPokemon_Name=evolve_from.name;
//   //     counter++;
//   //     evolvefrom(newPokemon_Name)
      
//   //   }
//   //   else
//   //   return counter;
    
//   // })

//   var evolve_from = await evolveAPIcall(pokemon_name)
//   if(evolve_from!==null)
//   {
//     counter++;
//     console.log(` ${pokemon_name} evolves From: ${JSON.stringify(evolve_from.name)}`)
//     evolvefrom(evolve_from.name, counter)
//   }
//   else
//   {console.log(`Function ended ${counter}`); 
//   return counter;}


  
// }
async function findEvolutionStage(pokemon_name) {
  try {
    // Make a request to the PokéAPI to get information about the specified Pokemon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`);
    const pokemonData = await response.json();

    // Get the evolution chain URL from the Pokemon's species data
    const speciesUrl = pokemonData.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Make a request to the PokéAPI to get the evolution chain for the specified Pokemon
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    // Recursively traverse the evolution chain to find the specified Pokemon and its stage
    const findStage = (chain, stage = 1) => {
      if (chain.species.name === pokemon_name) {
        console.log(`The ${pokemon_name} is at stage ${stage} of its evolution chain.`);
        populationEvolution(pokemon_name,stage);
        return stage;
      } else if (chain.evolves_to.length > 0) {
        for (let i = 0; i < chain.evolves_to.length; i++) {
          const result = findStage(chain.evolves_to[i], stage + 1);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    findStage(evolutionChainData.chain);
  } catch (error) {
    console.error(`Error occurred while finding evolution stage for ${pokemon_name}: ${error}`);
  }
}




      
async function populationEvolution(pokemon_name,stage){

  fetch(`/db/${pokemon_name}`)
    .then(response=>response.json())
    .then((data)=>{
      let pokemon_data=data[0]
      console.log(`data retrived: ${JSON.stringify(pokemon_data)}`)
  
      let newpokemon_data=Object.assign(pokemon_data=data[0],{evolutionStage:stage})
      console.log(`New Data: ${JSON.stringify(newpokemon_data)}`)
  
      //Update pokemon Type in Database
      fetch('/db/updateEvo',{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify(newpokemon_data)
      })
      .then(response=>response.json())
      .then((data)=>{
        console.log(`Recived DAta after Update request ${JSON.stringify(data)}]`)
      })
  
  
    })
  
  
}

function totalPokemons(){

}

export default function App() {
 
  const [inputType,setinputType]=useState('')
  const [inputEvo,setinputEvo]=useState('')
  const [showData,setshowData]=useState(false)
  const [recievedData,setrecievedData]=useState([])
  const [heading,setheading]=useState('')
  const [loading,setloading]=useState(false)


  useEffect( () => {
    // Anything in here is fired on component mount.
    //populate the data of all pokemons
  //  populatePokemonList()
  

  
 }, []);


  function FetchData(){

   fetch('http://localhost:3000/db/search',{
    method:'POST',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:JSON.stringify({
      type:inputType,
      stage:inputEvo
    })
    
   })
   .then(response=>response.json())
    .then(response=>{
      setrecievedData(response);
      setshowData(true);
      console.log(`Recieved Data:`)
      console.log(response)
    })
    
    

  }
  


  return (<div className='main-div'>
    
    <div className='red-box'>
      <h1 className='heading'>POKEDEX</h1>
      

      <InputData type={inputType} 
      evo={inputEvo} 
      updatetype={setinputType} 
      updateevo={setinputEvo} 
      fetchdata={FetchData}/>




    </div>
    <DisplayData showData={showData}
    recievedData={recievedData}
    heading={heading}/>
  </div>)
    
}







