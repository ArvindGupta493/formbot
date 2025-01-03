// import React from 'react'
import style from './Platform.module.css';
import calender from './platform_imgs/calender.png'
import CC from './platform_imgs/CC.png'
import chain from './platform_imgs/chain.png'
import cube from './platform_imgs/cube.png'
import drive from './platform_imgs/drive.png'
import email from './platform_imgs/email.png'
import mintra from './platform_imgs/mintra.png'
import monkey from './platform_imgs/monkey.png'
import notion from './platform_imgs/notion.png'
import salesforce from './platform_imgs/salesforce.png'
import shopify from './platform_imgs/shopify.png'
import wix from './platform_imgs/wix.png'
import wordpress from './platform_imgs/wordpress.png'
import XL from './platform_imgs/XL.png'
import zapier from './platform_imgs/zapier.png'


const Platform = () => {
  return (
    <>
        <div className={style.main_PlatForm}>
            <div className={style.sub_Platform1}>
                <div className={style.plortFormBoxes}><img src={email} alt="email" /></div>
                <div className={style.plortFormBoxes}><img src={monkey} alt="monkey" /></div>
                <div className={style.plortFormBoxes}><img src={notion} alt="notion" /></div>
                <div className={style.plortFormBoxes}><img src={wix} alt="wix" /></div>
                <div className={style.plortFormBoxes}><img src={wordpress} alt="wordpress" /></div>
                <div className={style.plortFormBoxes}><img src={calender} alt="calender" /></div>
                <div className={style.plortFormBoxes}><img src={chain} alt="chain" /></div>
                <div className={style.plortFormBoxes}><img src={drive} alt="drive" /></div>
            </div>
            <div className={style.sub_Platform2}>
            <div className={style.plortFormBoxes}><img src={mintra} alt="mintra" /></div>
            <div className={style.plortFormBoxes}><img src={shopify} alt="shopify" /></div>
            <div className={style.plortFormBoxes}><img src={cube} alt="cube" /></div>
            <div className={style.plortFormBoxes}><img src={XL} alt="XL" /></div>
            <div className={style.plortFormBoxes}><img src={zapier} alt="zapier" /></div>
            <div className={style.plortFormBoxes}><img src={CC} alt="CC" /></div>
            <div className={style.plortFormBoxes}><img src={salesforce} alt="salesforce" /></div>
            </div>
            <div className={style.sub_Platform3}>
                <h1>Integrate with any platform</h1>
                <p>Typebot offers several native integrations blocks as well as instructions on
                how to embed typebot on particular platforms</p>
            </div>
        </div>
      
    </>
  )
}

export default Platform
