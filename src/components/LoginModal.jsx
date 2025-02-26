import React, { useState } from 'react'
import logo from '../assets/images/Logo Middle Customer.png'
import {
    Mail as MailIcon,
    Lock as LockIcon
} from "@mui/icons-material"
import { Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { customer_login as CustomerLoginAPI } from '../api/auth';
import { toast } from 'react-toastify';
import { login } from '../redux/customerAuthSlice';


const LoginModal = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(true);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookie, removeCookies] = useCookies()
    const navigate = useNavigate()
    const [warnings, setWarnings] = useState({})
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const toggleLogin = () => {
        setIsLoginOpen(!isLoginOpen)
    };

    const submitForm = (e) => {
        e.preventDefault()
        if (!loading) {
            setLoading(true)
            CustomerLoginAPI({
                username,
                password
            }).then(res => {
                if (res?.ok) {
                    setCookie("customer_authToken", res.data.token)
                    dispatch(login(res?.data))
                    navigate('/orca/chat')
                } else {
                    toast.error(res?.message ?? "Invalid Input!")
                    setWarnings(res?.errors)
                }
            }).finally(() => {
                setLoading(false)
            })
        }
    }
    return (
        <>{
            isLoginOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-[#212121] rounded-lg p-6 w-96 text-white">
                        <div className='flex items-center flex-col'>
                            <img className="size-12 mb-5" src={logo} alt="Logo Orca" />
                            <h2 className="text-2xl font-bold mb-4 text-[32px]">Login</h2>
                        </div>
                        <form onSubmit={submitForm} className='mt-5 px-8' >
                            <div className='mb-3 flex flex-col'>
                                <div className='flex items-center'>
                                    <MailIcon className="absolute size-2 mt-1 ml-3 text-gray-400" />
                                    <input className="w-full p-2 rounded-full pl-12 focus:border-customBtn focus:outline-none text-[12px] sm:text-base bg-[#303030]" type="text" autoFocus autoComplete="true" onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                                </div>
                                {
                                    warnings?.username ? (
                                        <p className='text-red-500 text-center text-[12px] self-start'>{warnings?.username}</p>
                                    ) : null
                                }
                            </div>
                            <div className='mb-8 flex flex-col'>
                                <div>
                                    <LockIcon className="absolute mt-2 ml-3 text-gray-400" />
                                    <input className="w-full p-2 sm:text-base text-[12px] rounded-full pl-12 focus:border-customBtn focus:outline-none bg-[#303030]" type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                                </div>
                                {
                                    warnings?.password ? (
                                        <p className='text-red-500 text-center text-[12px] self-start'>{warnings?.password}</p>
                                    ) : null
                                }
                            </div>
                            <div className='flex items-center flex-col'>
                                <button type="submit" className='font-bold bg-customLightBlue p-2 w-full rounded-full hover:bg-customLightBlue/80'>Login</button>
                                {/* <button className="text-white w-full h-[42px] bg-customBtn rounded-xl hover:shadow-customBtn hover:bg-customBtn50" disabled={loading} type="submit"><span className='font-semibold text-[20px] sm:text-2xl tracking-wider'>Login</span></button> */}
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-70 mt-2 hover:text-white"
                                    onClick={toggleLogin}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )
        }
        </>
    )
}

export default LoginModal