// import React from 'react'
import style from './ChatPage.module.css'
import profile from '../../assets/chatProfile.jpg'


const ChatPage = () => {
    return (
        <>
            <div className={style.main_Chatcontent}>
                <div className={style.innerChatcontent}>
                    <div className={style.ChatText}>
                        <h1>Collect results in real-time</h1>
                        <p>One of the main advantage of a chat application is that you collect the user s responses on each question.
                            <br/><b>You won lose any valuable data.</b></p>
                    </div>

                    <div className={style.ChatResult}>
                        <div className={style.ChatresultText}>
                            <span>As you answer this chat, you will see your result in the real
                                Airtable spreadsheet</span>
                            <span>You can think of it as a guestbook 😂</span>
                            <span>Ready?</span>
                        <div className={style.chatProfile}>
                            <img src={profile} alt="Profile" />
                        </div>
                        </div>
                        <button>Yeah!</button>
                    </div>
                </div>

            </div>

        </>
    )
}   

export default ChatPage
