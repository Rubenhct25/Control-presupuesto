import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import ListadoGasto from './components/ListadoGasto';
import Filtros from './components/Filtros';
import Modal from './components/Modal';
import { generarId } from './helpers';
import iconoNuevoGasto from './img/nuevo-gasto.svg'

function App() {
  const [gastos, setGastos] = useState(
    [ ...(JSON.parse(localStorage.getItem("gastos")) ?? []) ]
  );

  const [presupuesto, setPresupuesto] = useState(localStorage.getItem('presupuesto') ?? 0 );

  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);

  const [gastoEditar, setGastoEditar] = useState({});

  useEffect(() => {
    if(Object.keys(gastoEditar).length > 0 ){
      setModal(true)

      setTimeout(() => {
        setAnimarModal(true)
      }, 500);
    }
  }, [gastoEditar]);

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto]);

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos]);

  useEffect(() => {
    if(filtro){
      //filtrar por categoria
      const gastosFiltrados = gastos.filter( gasto => gasto.categoria === filtro )

      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro]);

  useEffect(() => {
    const presupuestoLs = Number(localStorage.getItem('presupuesto')) ?? 0

    if(presupuestoLs > 0){
      setIsValidPresupuesto(true)
    }
  }, []);


  const handleNuevoPresupuesto = ()=> {
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 500);
  }

  const guardarGastos = gasto => {

    if(gasto.id){
      //Actualizar
      const gastoActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastoActualizados)
      setGastoEditar({})
    }else {
      //Nuevo gasto
      gasto.id = generarId();
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])

    }

    setAnimarModal(false)

    setTimeout(() => {
        setModal(false)
    }, 500);
  }

  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter( gasto => gasto.id !== id)
    setGastos(gastosActualizados)
  }
  return (
    <div className={modal ? 'fijar' : ''}>
      <Header 
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGasto 
              setGastoEditar={setGastoEditar}
              gastos={gastos}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img 
              src={iconoNuevoGasto}
              alt='icono nuevo gasto'
              onClick={handleNuevoPresupuesto}
            />
          </div>
        </>
        
      )}

      {modal && 
                <Modal 
                  setModal={setModal} 
                  animarModal={animarModal}
                  setAnimarModal={setAnimarModal}
                  guardarGastos={guardarGastos}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                />}

    </div>
  )
}

export default App
