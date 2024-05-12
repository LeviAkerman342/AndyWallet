import React from "react"
import {Button} from "antd"
import './home.css'
import {useNavigate} from "react-router-dom"

export default function Home(){

    const navigate = useNavigate();
    return(
        <>
       <div className="content">
        <img src="https://sun9-51.userapi.com/impg/gp9qZd3_izdZNhlavWyCfX5M5ieUCS4Ezz8mPw/3lD49cakPVU.jpg?size=782x291&quality=96&sign=d7bbacc7f902b53883b1cbcb43bd0b39&type=album" className="frontPageLogo"/>
         <h3>Приветствуем!💵</h3>
        <p className="h4">В нашем крипто кошельке от студентов 414гр 🤫</p>
      
        <Button onClick={() => navigate("/yourwallet")} className="frontPageButton" type="primary">
            Создать кошелёк
        </Button>
        <Button onClick={() => navigate("/recovery")}  className="frontPageButton" type="default">
           Войти по Фразе

        </Button>
        <p className="frontPageBottom">
           Получи при регистрации 1 solana {" "}
            <a href="#" target="_blank" rel="noreferrer">
                Pixel Wizard
            </a>
        </p>
       </div>
        </>
    )
}