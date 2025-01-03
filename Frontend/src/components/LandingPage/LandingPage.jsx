// import React, { startTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Platform from '../PlatForm/Platform';
import ChatPage from '../ChatPage/ChatPage';
import Featuers from '../Features/Featuers';
import style from './LandingPage.module.css';
import logo from '../../assets/logo.png';
import image from '../../assets/image1.png';
import gif from '../../assets/giphy.gif';
import cross from '../../assets/cross.png';
import right from '../../assets/right.png';
import profile from '../../assets/chatProfile.jpg';
import content2 from '../../assets/content3img.png';
import content1 from '../../assets/content3img1.png';
import tri3 from '../../assets/triangle3.png';
import UU from '../../assets/UU.png';
import orange from '../../assets/orangeBg.png';
import blue from '../../assets/blueBg.png';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className={style.MainContainer}>
                {/* navbar */}
                <div className={style.Navbar}>
                    <div className="leftNav">
                        <div className={style.NavbarLogo}>
                            <img src={logo} alt="Logo" />
                            <h5>FormBot</h5>
                        </div>
                    </div>
                    <div className={style.rightNav}>
                        <Link to={'/login'} className={style.NavLogin}>Sign in</Link>
                        <button className={style.NavCreate} onClick={()=>navigate('/login')}>Create a FormBot</button>
                    </div>
                </div>
                {/* content1 */}
                <div className={style.Content1}>
                    <div className={style.InnerContent1}>
                        <img src={tri3} alt="" />

                        <div className={style.InnerHeading}>
                            <div className={style.content1Hading}>
                                <h1>Build advanced chatbots <br /> visually</h1>
                            </div>
                            <div className={style.content1Para}>
                                <p>Typebot gives you powerful blocks to create unique chat experiences. Embed them
                                    anywhere on your web/mobile apps and start collecting results like magic.</p>
                            </div>
                            <div className={style.content1Btn}>
                                <button>Create a FormBot  for free</button>
                            </div>
                        </div>
                        <img src={UU} alt="" />

                    </div>
                    <div className={style.ParentImg}>
                        <div className={style.BackgroundImg1}>
                            <img src={orange} alt="" />
                            <img src={blue} alt="" />
                        </div>
                        <div className={style.content1Image}>
                            <img src={image} alt="Image" />
                        </div>

                    </div>
                </div>

                {/* content2 */}
                <div className={style.FormContent}>
                    <div className={style.InnerFormContent}>
                        <div className={style.FormContentHeading}>
                            <h1>Replace your old school forms <br /> with <br />
                                chatbots</h1>
                        </div>
                        <div className={style.FormContentPara}>
                            <p>
                                Typebot is a better way to ask for information. It leads to an increase in
                                customer satisfaction and retention and multiply by <br /> 3 <br />
                                your conversion rate compared to classical forms.
                            </p>
                        </div>
                        <div className={style.FormIcons}>
                            <div className={style.crossIcon}>
                                <img src={cross} alt="X icon" />

                            </div>
                            <div className={style.rightIcon}>
                                <img src={right} alt="right icon" />
                            </div>
                        </div>
                        <div className={style.FormContent_Form}>
                            <div className={style.FormLeft}>
                                <form>
                                    <div className={style.name}>
                                        <label htmlFor="name">Full name <span>*</span></label>
                                        <input type="text" placeholder="Full Name" />
                                    </div>
                                    <div className={style.email}>
                                        <label htmlFor="name">Email <span>*</span></label>
                                        <input type="email" placeholder="Email" />
                                    </div>

                                    <div className={style.CheckBoxes}>
                                        <h2>
                                            What services are you interested in? <span>*</span>
                                        </h2>
                                        <div className={style.checkbox}>
                                            <input type="checkbox" id="webdev" className={style.check} required />
                                            <label htmlFor="webdev">Website Dev</label>
                                        </div>
                                        <div className={style.checkbox}>
                                            <input type="checkbox" required className={style.check} />
                                            <label>Content Marketing</label>
                                        </div>
                                        <div className={style.checkbox}>
                                            <input type="checkbox" required className={style.check} />
                                            <label>Social Media</label>
                                        </div>
                                        <div className={style.checkbox}>
                                            <input type="checkbox" required className={style.check} />
                                            <label>UX/UI Design</label>
                                        </div>
                                    </div>
                                    <div className={style.FormContent_textarea}>
                                        <h4>Additional Information <span>*</span></h4>
                                        <textarea placeholder="Additional Information" required></textarea>
                                    </div>
                                    <div className={style.FormBtn}>
                                        <button type="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                            <div className={style.FormRight}>
                                <div className={style.chat_section}>
                                    <div className={style.welcom}>
                                        <span>Welcome to <b>AA </b>(Awesome Agency)</span>
                                    </div>
                                    <div className={style.ChatSection_video}>
                                        <img src={gif} alt="gif" />
                                    </div>
                                    <div className={style.chatText}>
                                        <img src={profile} alt="Profile" />
                                        <button>Hi</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            

            {/* content 3 */}
            <div className={style.container3}>
                <div className={style.innerContainer3}>
                    <img src={content1} alt="content1" />
                    <div className={style.container3Text}>
                        <h1>Easy building
                            experience</h1>
                        <p>All you have to do is drag and
                            drop blocks to create your app.
                            Even if you have custom needs,
                            you can always add custom
                            code.</p>
                    </div>
                </div>
            </div>

            {/* container 4 */}
            <div className={style.container4}>
                <div className={style.innerContainer4}>
                    <div className={style.container4Text}>
                        <h1>Embed it in a click</h1>
                        <p>Embedding your typebot in
                            your applications is a walk in
                            the park. Typebot gives you
                            several step-by-step platform-
                            specific instructions. Your
                            typebot will always feel native.</p>
                    </div>
                    <img src={content2} alt="content2" />
                </div>
            </div>

            {/* container 5 */}
            <div className={style.container5}>
                <Platform />
            </div>

            {/* container 6 */}
            <div className={style.container6}>
                <ChatPage />
            </div>

            {/* container 7 */}
            <div className={style.container7}>
                <Featuers />
            </div>

            {/* container 8 */}
            <div className={style.container8}>

                <div className={style.InnerContainer8}>
                    <div className={style.backgroundTri}>
                        <img src={tri3} alt="triangle" />
                    </div>
                    <div className={style.UserEngagement}>
                        <h1>Improve conversion and user engagement
                            with FormBots </h1>
                        <div className={style.userBtn}>
                            <button>Create a FormBot </button>
                        </div>
                        <p>No trial. Generous <b>free</b> plan.</p>
                    </div>
                    <div className={style.backgroundUU}>
                        <img src={UU} alt="" />
                    </div>
                </div>

            </div>

            {/* container 9 */}

            <div className={style.footer}>
                <div className={style.cuvette}>
                    <p>Made with ❤️ by @kumar</p>
                </div>
                <div className={style.footer_flex}>
                    <div className={style.FooterLinks}>
                        <Link to="#">status <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">Documentation <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">Roadmap <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">Pricing</Link>
                    </div>
                </div>
                <div className={style.footer_flex}>
                    <div className={style.FooterLinks}>
                        <Link to="#">Discord <i className="fa">&#xf08e;</i> </Link>
                        <Link to="#">GitHub repository <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">Twitter <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">LinkedIn <i className="fa">&#xf08e;</i></Link>
                        <Link to="#">OSS Friends</Link>
                    </div>
                </div>
                <div className={style.footer_flex}>
                    <div className={style.FooterLinks}>
                        <Link to="#">About </Link>
                        <Link to="#">Contact </Link>
                        <Link to="#">Terms of Service</Link>
                        <Link to="#">Privacy Policy </Link>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default LandingPage;
