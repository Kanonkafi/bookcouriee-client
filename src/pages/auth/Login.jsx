import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom' // Link import from react-router-dom
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { TbFidgetSpinner } from 'react-icons/tb'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import useAuth from '../../hooks/useAuth'
import axios from 'axios' // 🔑 MongoDB সেভের জন্য ইম্পোর্ট


const Login = () => {

    // auth theke data nicchi
    const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth()

    const [show, setShow] = useState(false); // password show toggle

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state || '/'
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000' // 🔑 API URL যোগ করা হয়েছে

    // already load hoye gele spinner
    if (loading) return <LoadingSpinner />
    // user thakle redirect
    if (user) return <Navigate to={from} replace={true} />


    // 🔑 MongoDB তে ইউজার সেভ করার ফাংশন
    const saveUserToDB = async (userData) => {
        try {
            const res = await axios.put(`${API_URL}/user`, userData);
            console.log('User saved/updated in DB:', res.data);
        } catch (error) {
            console.error('Error saving user to DB:', error);
        }
    }


    // ========================
    // FORM SUBMIT
    // ========================
    const handleSubmit = async event => {
        event.preventDefault()
        const form = event.target
        const email = form.email.value
        const password = form.password.value

        try {
            await signIn(email, password)
            // Note: Email/Password login এর পর DB তে সেভ করার দরকার নেই, কারণ Signup এ তা already হয়ে গেছে।
            // কিন্তু JWT টোকেন সেট করার লজিক (যদি থাকে) এখানে আসতে পারে। 
            
            navigate(from, { replace: true })
            toast.success('Login Successful')
        } catch (err) {
            toast.error(err?.message)
        }
    }

    // ========================
    // GOOGLE LOGIN
    // ========================
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle() // result capture

            // 🔑 MongoDB তে ইউজার সেভ করা (Login পেজ থেকে Google সাইনইন)
            await saveUserToDB({
                email: result.user.email,
                name: result.user.displayName,
            });

            navigate(from, { replace: true })
            toast.success('Login Successful')
        } catch (err) {
            setLoading(false)
            toast.error(err?.message)
        }
    }

    return (
        <>
            {/* --------------------------
     MAIN BACKGROUND 
     glass + gradient
     --------------------------- */}
            <div className="min-h-screen flex justify-center items-center 
   bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">

                {/* --------------------------
      Main Card
      --------------------------- */}
                <div
                    className="w-[95%] max-w-md 
     backdrop-blur-lg bg-white/10
     rounded-2xl shadow-2xl p-8
     border border-white/20">

                    {/* Title */}
                    <h2 className="text-3xl text-white font-semibold text-center">
                        Log In
                    </h2>

                    <p className="text-gray-300 text-center text-sm mb-8">
                        Access your account
                    </p>


                    {/* --------------------------
       FORM HERE
     --------------------------- */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="text-gray-200 text-sm">Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full mt-1 px-4 py-2 rounded-lg 
        bg-white/20 text-white placeholder-gray-200 
        outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-gray-200 text-sm">Password</label>

                            <div className="relative mt-1">
                                <input
                                    type={show ? "text" : "password"}
                                    name='password'
                                    required
                                    placeholder="******"
                                    className="w-full px-4 py-2 rounded-lg 
         bg-white/20 text-white placeholder-gray-200
         outline-none focus:ring-2 focus:ring-purple-400"
                                />

                                {/* Eye icon */}
                                <span
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-2 text-xl cursor-pointer text-purple-300"
                                >
                                    {show ? <FaEye /> : <IoEyeOff />}
                                </span>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg
       bg-gradient-to-r from-purple-600 to-green-600
       text-white font-semibold shadow-lg hover:opacity-90
       transition"
                        >
                            {loading ? <TbFidgetSpinner className="animate-spin m-auto" /> : "Continue"}
                        </button>

                    </form>


                    {/* Forget */}
                    <button className="text-xs text-gray-300 mt-3">
                        Forgot password?
                    </button>


                    {/* OR */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-gray-500/40"></div>
                        <p className="px-3 text-gray-300">Or login with</p>
                        <div className="flex-1 h-px bg-gray-500/40"></div>
                    </div>


                    {/* Google Button */}
                    <div
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-3 py-2
       rounded-xl bg-white/20 text-white cursor-pointer"
                    >
                        <FcGoogle size={28} />
                        Continue with Google
                    </div>


                    {/* Sign Up */}
                    <p className="text-center text-gray-300 text-sm mt-6">
                        Don't have an account?
                        <Link to="/signup" state={from} className="text-purple-300 ms-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login