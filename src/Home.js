import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";


export default function Home() {
    
  const [limit, setLimit] = useState(20);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const carouselRef = useRef(null);
  const loadbut = useRef(null)

  if (!localStorage.getItem('datacolors')){
     localStorage.setItem('datacolors', JSON.stringify({
      backColor: '#3e3e42',
      elColor: 'white',
      background: '#252526'
    }))
  }

  const [colors, setColors] = useState(JSON.parse(localStorage.getItem('datacolors')))

  useEffect(() => {
    localStorage.setItem('datacolors', JSON.stringify(colors))
  },[colors])

  useEffect(() => {
    fetch('https://api.coinlore.net/api/tickers/?start=0')
    .then(response => response.json())
    .then(all => setCoins(all.data))
    .catch(err => console.log(err));

    let score = 0 
    let timer = setInterval(() => {
     
      let amount = 74;
      score += amount;
      if (score > 444){amount = -444; score = 0; }
      // we use the scrol; function with one argument for the x axis
      // we pass in that we want to 
      if (carouselRef.current != null){
        carouselRef.current.scroll({
          left: carouselRef.current.scrollLeft + amount,
          behavior: 'smooth',
        }
      )} else clearInterval(timer);

      amount = 74;
    }, 3000);
  },[]);
         
  function handleButton(){
    const loader = document.querySelector('.lds-ring');
    loader.style.width = '90px'
    loader.style.height = '90px'
    document.querySelector('.lds-ring > div').style.visibility = 'visible'
    const timer = setInterval(function() {
       if(limit < 100) {
        setLimit(limit + 20)
       } 
       clearInterval(timer);
       loader.style.width = '0px'
       loader.style.height = '0px'
       document.querySelector('.lds-ring > div').style.visibility = 'hidden'
    }, 2000)
  }

  function disButton(){
    loadbut.current.disabled = true
    loadbut.current.style.opacity = '0.5'
    loadbut.current.style.cursor = 'auto'
  }
  function actButton(){
    loadbut.current.disabled = false
    loadbut.current.style.opacity = '1'
    loadbut.current.style.cursor = 'pointer'
  }

  if(search){
    disButton()
  } else {
    if(loadbut.current == null){
       /* do nothing */
    } else {
      actButton();
    }
  }

  if (limit == 100){
    disButton()
  }
  
  function moveUp(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }

  function changeTheme(){
    if (colors.elColor == 'white'){
      setColors({
        backColor: 'white',
        elColor: 'black',
        background: 'white'
      })
    } else {
      setColors({
        backColor: '#3e3e42',
        elColor: 'white',
        background: '#252526'
      })
    }
  }

  return (
    <main style={{backgroundColor: colors.background}}>
      
      <div className='searchfield'>
        <div className='carousel'  ref={carouselRef}>
          <img src="https://img.icons8.com/fluency/96/null/bitcoin.png"/>
          <img src="https://img.icons8.com/fluency/96/null/ethereum.png"/>
          <img src="https://img.icons8.com/color/96/null/tether--v1.png"/>
          <img src="https://img.icons8.com/pastel-glyph/64/null/xrp--v1.png"/>
          <img src="https://img.icons8.com/nolan/96/solana.png"/>
          <img src="https://img.icons8.com/external-black-fill-lafs/64/FAB005/external-Binance-cryptocurrency-black-fill-lafs.png"/>
          <img src="https://img.icons8.com/ios/100/null/cardano.png"/>
          <img src="https://img.icons8.com/cotton/64/null/litecoin--v2.png"/>
          <img src="https://img.icons8.com/external-black-fill-lafs/64/7950F2/external-Polkadot-cryptocurrency-black-fill-lafs.png"/>
          <img src="https://img.icons8.com/external-black-fill-lafs/64/22C3E6/external-Filecoin-cryptocurrency-black-fill-lafs.png"/>
        </div>

        <div className='div2'>
          <input className='inputSearch' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} type="text" />
          {colors.background === 'white' ?
            <img alt='sun' className='theme' onClick={changeTheme} src="https://img.icons8.com/ios-glyphs/30/null/sun--v1.png"/>
            :
            <img alt='sun' className='theme' onClick={changeTheme} src="https://img.icons8.com/ios-glyphs/30/FFFFFF/sun--v1.png"/>
          }
        </div>
         
      </div>

      <div style={{
        color: colors.elColor,
        backgroundColor: colors.backColor
      }} className='dis'>
        <p >#Name</p>
        <p >#Currency Price</p>
        <p className='volumeshow'>#24h Volume</p>
        <p >#Changes</p>
      </div>

      {coins.filter(val => { 
        if (search === ''){
          return true
        } 
        else if (val.name.toLowerCase().includes(search.toLowerCase()) || val.symbol.toLowerCase().includes(search.toLowerCase())){
          return true
        }
        }).slice(0,limit).map((e)=> {
          let color = ''
          let present = e.percent_change_1h;
          if(e.percent_change_1h[0] === '-'){
            color = 'red'
          } else {
            color = 'rgb(0, 255, 34)'
            present =  [...e.percent_change_1h]
            present.unshift('+');
            present.join('')
          }
          return (
            <Link className='rows' style={{
              color: colors.elColor,
              backgroundColor: colors.backColor,              
            }} key={e.id} to="/details" state={{ id: e.id, background: colors.background, backColor: colors.backColor, elColor: colors.elColor}}>
              <p className='name'>{e.name} {e.symbol}</p>
              <p className='price'>${e.price_usd}</p>
              <p className='volume'>${e.volume24}</p>
              <div className='hour'>
                <p className='change1h'>1h change</p>
                <p style={{color: color}}>{present}%</p>
              </div>
            </Link>
          )
        })}
      
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      <div className='act'>
        <button ref={loadbut} style={{
          color: colors.elColor,
          backgroundColor: colors.backColor,              
        }} onClick={handleButton} className='load'>Load more</button>

        {colors.background == 'white' ?
          <img alt='uppage' className='goUp' onClick={moveUp}  src="https://img.icons8.com/ios/100/null/circled-chevron-up.png"/>
          :
          <img alt='uppage' className='goUp' onClick={moveUp} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADtUlEQVR4nO2aS29NURTHj3i0QuhTb4wYSgVfAvWo10wxIzrRNmXqMcZI0sTnQCMMShPEo2gTUdUaoQPBTFVa+cnq/e/Y4dx77j13Hz3EP7m5J3ftsx57r7X32mvdKPqPfxRAE3AAuAQMAq+Az8A3fex5XDQbsx9ojPIAoB44BtwGvlM95oFbwFGgbjEMWAmcBqY9pWaBIeCsVmaTzTiwXJ9G/Wa0c8AdvePwHui3yflTRuwB3ngKPAGOA2tT8GoATgAjHr8pYFfWbnTVE/gU2BGQfwfw3OM/EHx1gIIUN3wBTgFLgwopylkK9AIz3mq3hWK+UcuNdp3NQRiXl7kFmJDMSdOhVoatHsPHQEswbZNlNwL3JNtislBLTDh3egCsCq5tsg6rgIeem1UfM15gmzs1ZaJpZXo0e14xkGaLdYGdeUxUGDMz0qmjmsPOnROnopwA6POCP9nFgDPeORF8i00LYBkwKt36kgbXKVUwbI9yBmC3dJsuuypK3hZ2iCiHAJZ4O2lXuYGWxRqOB8wIRuQShUA8T0rHm+XuE/PKSKtOAEsYYVu3w3gIYygelHa/mYvVU+m1YSiwEeO/PIcw5q747YsjXhbxbGAjCnG/1SjjgnhdjCMOlrSycgFtwAvxsavueo+2zqNN+LQUcg6Kz7U44msRN6VknjjroVYGaHeTFUf8JGJTyJWIGVvzygAtev9DHNF2AsOKrIwIZQzFg9swG8SQNEaEMIYEQ6pyrVqMqNUYihe+kq5VVbADYyG20182gNEQwX5DxP0VMnukqkeIA66gNOZhiO3XHYjnopyDhAMxWIqSNYBh6bq3VDLmksaGKKegmNy6pHFNqUFWUDaciHIKoFs6DpYbdESDRqL8XqyeScfDSQfNOw3cGeUMwF7p9jaxDaHSPrI8b8WHMenWU2mF0dV6e6OcgJ8TPFFxU8j6E3rJimJbMtcyWZ9twFfpVF0rQ/0JNwPNmWlZWV41KV2upGFQr8IxKiQvRhF7tVIh9F1Xy2xYZuvaCq3BtS1/8N2X7KmaGz5q9Ex6brY1mLblY2JSMi0r3xCKcZvnZjMqKC8Lwvz3LbbfC2xzp3WhhdR7G8DC3SFU91UntrUy3DmxENiZ9t7VfXXLjmqxJ9P8i0Fx0O2lHc6VgnWLK1mdPi+dQRmppdfndfFpV7dphT72vBk4pDHDXp3ApR09i/UPCMvNuqygrCtAtZhTYfDwohgQBysoA512awOu6x7+0ftTjT2/tOupxnSWvE/8R/T34wdWz7cYqTkpQgAAAABJRU5ErkJggg=="></img> 
        }
      </div>
    </main>
  )
}
