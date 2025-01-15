// import React, { startTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import Platform from '../PlatForm/Platform';
// import ChatPage from '../ChatPage/ChatPage';
// import Featuers from '../Features/Featuers';
import style from './LandingPage.module.css';
import logo from '../../assets/logo.png';
import image from '../../assets/image1.png';
// import gif from '../../assets/giphy.gif';
// import cross from '../../assets/cross.png';
// import right from '../../assets/right.png';
// import profile from '../../assets/chatProfile.jpg';
// import content2 from '../../assets/content3img.png';
// import content1 from '../../assets/content3img1.png';
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
