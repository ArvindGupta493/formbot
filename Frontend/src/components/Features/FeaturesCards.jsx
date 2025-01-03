// import React from 'react'
import style from './FeaturesCards.module.css'

const FeaturesCards = () => {
    return (
        <>
            <div className={style.cards}>
                <div className={style.flex_cards}>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                        <i className="fa-solid fa-child-reaching"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Hidden fields</h3>
                            <p>Include data in your form URL to segment
                                your user and use its data directly in your
                                form.</p>
                        </div>
                    </div>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                            {/* <i className="fa-regular fa-user-plus"></i> */}
                            <i className="fa-solid fa-user-plus"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Team collaboration</h3>
                            <p>Invite your teammates to work on your
                                typebots with you</p>
                        </div>
                    </div>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                            <i className="fa-solid fa-code-branch"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Link to sub typebots</h3>
                            <p>Reuse your typebots in different parent
                                bots.</p>
                        </div>
                    </div>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                            <i className="fa-solid fa-calculator"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Custom code</h3>
                            <p>Customize everything with your own
                                Javascript & CSS code</p>
                        </div>
                    </div>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                            <i className="fa-solid fa-share-nodes"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Custom domain</h3>
                            <p>Connect your typebot to the custom URL
                                of your choice</p>
                        </div>
                    </div>
                    <div className={style.flex_icon}>
                        <div className={style.icons}>
                        <i className="fa-solid fa-folder-closed"></i>
                        </div>
                        <div className={style.Boxes}>
                            <h3>Folder management</h3>
                            <p>Organize your typebots in specific folders
                                to keep it clean and work with multiple
                                clients</p>
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
}

export default FeaturesCards
