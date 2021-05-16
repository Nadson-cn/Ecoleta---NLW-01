import React, { useEffect, useState, ChangeEvent, FormEvent} from "react";
import logo from '../../assets/logo.svg';
import { Link, useHistory } from "react-router-dom";
import '../CreatePoint/styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer,TileLayer, Marker, /*useMapEvents*/ } from "react-leaflet";
import api from '../../services/api';
import axios from 'axios';

interface Item {
  id: number,
  title: string,
  image_url: string;
}
interface IBGEUFresponse {
  sigla: string;
}
interface IBGECityresponse {
  nome: string;
}

function CreatePoint() {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUFs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  //const [InitialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    whatsapp: ""
  })

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();
  //Sempre que criar um array ou um objeto: informar manualmente o tipo de variavel
  
  /*useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  });
  */
  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUFs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    };

    axios
      .get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      });

  }, [selectedUF]);

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUF(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number){
    const alredySelected = selectedItems.findIndex(item => item === id);

    if( alredySelected >=0 ){
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    }else{
      setSelectedItems([ ...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const items = selectedItems;
    const [latitude, longitude] = selectedPosition;

    const data ={
      name,
      email,
      whatsapp,
      uf,
      city,
      items,
      latitude,
      longitude
    }

    await api.post('points', data);

    alert('Cadastrado!');

    history.push('/');
  }



 // function handleMapClick(event: LeafletMouseEvent) {
  //  const { lat: latidude, lng: longitude } = event.latlng;
 //   setSelectedPosition([latidude, longitude]);
 // }
 
 return (
   <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Whatsapp</label>
            <input 
              type="text"
              name="whatsapp"
              id="whatsapp"
              onChange={handleInputChange}
            />
          </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <small>Selecione o endereço no mapa</small>
          </legend>
      
          <MapContainer 
          
          center={[-27.2092052, -49.6401092]} 
            zoom={15}
            >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-27.2092052, -49.6401092]}  />
          </MapContainer>
       

            <div className="field-group">
              <div className="field">
                  <label htmlFor="uf">Estado (UF)</label>
                  <select 
                    name="uf" 
                    id="uf" 
                    value={selectedUF} 
                    onChange={handleSelectUF}
                  >
                      <option value="0">Selecione uma UF</option>
                        {ufs.map( uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                  </select>
              </div>   

              <div className="field">
                  <label htmlFor="city">Cidade</label>
                  <select 
                    name="city" 
                    id="city" 
                    value={selectedCity}
                    onChange={handleSelectCity}
                    > 
                    <option value="0">Selecione uma cidade</option>
                    {cities.map( city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
              </div>     
            </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <small>Selecione um ou mais ítens abaixo</small>
          </legend>

            <ul className="items-grid">
              { items.map( item => (
                  <li 
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                  >
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>))
              }
            </ul>

            <button type="submit">
              Cadastrar ponto de coleta 
            </button>
        </fieldset>

      </form>
    </div>
                    
  );
};

export default CreatePoint;