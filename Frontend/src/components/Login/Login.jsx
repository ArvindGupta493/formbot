import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from '../Register/Register.module.css';
import { userLogin } from '../../../services';
import { toast } from 'react-toastify';
import logo from '../../assets/google.png';
import Polygon1 from '../../assets/Polygon1.png';
import Polygon2 from '../../assets/Polygon2.png';


const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({

    email: '',
    password: '',

  })
  const handleLogin = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userLogin(loginForm);
      console.log(res)
      if (res.status === 200) {

        const data = await res.json();

        setLoginForm({
          email: '',
          password: '',
        })
        localStorage.setItem('token', data.token);
        toast.success("User Logged In Successfully");
        navigate('/Formdashboard')
      }
      else {
        console.log(res)
        toast.error("User Login Failed");
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      toast.success("User Already Logged In");
      navigate('/Formdashboard')
    }
  },[navigate])

  return (
    <>
      <div className={style.register}>

        <div className={style.triangle1}><img src={Polygon1} alt="tri1" /></div>
        <div className={style.triangle2}><img src={Polygon2} alt="tri2" /></div>

        <div className={style.semiCircle1}></div>
        <div className={style.leftArrow}>
          <Link to={'/'}><i className="fa-solid fa-arrow-left"></i></Link>
        </div>

        <form onSubmit={handleLoginSubmit} className={style.registerForm}>

          <div className={style.registerInput}>
            <label >Email:</label><br />
            <input type="email"
              id="email"
              value={loginForm.email}
              onChange={handleLogin}
              name="email"
              placeholder='Enter Email' required

            />
          </div>
          <div className={style.registerInput}>
            <label >Password:</label><br />
            <input type="password"
              id="password"
              value={loginForm.password}
              onChange={handleLogin}
              name="password"
              placeholder='Enter Password' required

            />
          </div>

          <button type='submit'>Login</button>
        </form>
        <div className={style.google}>
          <p>OR</p>
          <button><img src={logo} alt="google" />Sign In with Google</button>
        </div>

        <div className={style.already}>
          <p>Don’t have an account? <Link to={'/register'} >Register Now</Link></p>
        </div>
        <div className={style.semiCircle2}></div>
      </div>
    </>
  )
}

export default Login;
