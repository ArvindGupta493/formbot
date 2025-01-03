// import React from 'react'
import style from './Features.module.css'
import Cards from './FeaturesCards'
import team from '../../assets/Container.png'

const Featuers = () => {
    return (
        <>
            <div className={style.Main_Container}>
                <div className={style.Feature_Text}>
                    <h1>And many more features</h1>
                    <p>Typebot makes form building easy and comes with powerful features</p>
                </div>

                <div className={style.Feature_Cards}>
                    <Cards />
                </div>

                <div className={style.Feature_Team}>
                    <h3>Loved by teams and creators from all around the world</h3>

                    <div className={style.Feature_TeamNames}>
                        <img src={team} alt="" />
                    </div>
                </div>

            </div>

        </>
    )
}

export default Featuers
