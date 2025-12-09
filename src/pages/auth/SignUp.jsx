
import { Link, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'
import { imageUpload } from '../../utils'

const SignUp = () => {

  //  auth functions
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state || '/'

  //  react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm()


  // ===========================
  // FORM SUBMIT
  // ===========================
  const onSubmit = async data => {
    const { name, image, email, password } = data
    const imageFile = image[0]

    try {
      //  upload main image
      const imageURL = await imageUpload(imageFile)

      //  user create
      const result = await createUser(email, password)

      //  firebase profile update
      await updateUserProfile(name, imageURL)

      navigate(from, { replace: true })
      toast.success('Signup Successful')
      console.log(result)
    }
    catch (err) {
      toast.error(err?.message)
    }
  }


  // ===========================
  // GOOGLE LOGIN
  // ===========================
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate(from, { replace: true })
      toast.success('Signup Successful')
    }
    catch (err) {
      toast.error(err?.message)
    }
  }


  return (
    <>
      {/* ---------------------
          Background
      --------------------- */}
      <div className="min-h-screen flex justify-center items-center 
      bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">


        {/* ---------------------
            Main Card = Glass
        --------------------- */}
        <div className="w-[95%] max-w-md 
        bg-white/10 backdrop-blur-lg 
        p-8 rounded-2xl border border-white/20 
        shadow-xl">


          <h1 className="text-3xl text-white font-semibold text-center mb-2">
            Sign Up
          </h1>

          <p className="text-gray-300 text-center mb-8 text-sm">
            Create a new account
          </p>


          {/* ---------------------
              Form
          --------------------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-gray-200 text-sm">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Your Name"
                className="w-full mt-1 px-4 py-2 rounded-lg 
                bg-white/20 text-white placeholder-gray-200
                outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </div>


            {/* Image */}
            <div>
              <label className="text-gray-200 text-sm">Profile Image</label>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-200
                bg-white/20 rounded-lg p-2 cursor-pointer"
              />
            </div>


            {/* Email */}
            <div>
              <label className="text-gray-200 text-sm">Email</label>
              <input
                {...register("email", { required: "Email required" })}
                type="email"
                placeholder="Your email"
                className="w-full mt-1 px-4 py-2 rounded-lg
                bg-white/20 text-white placeholder-gray-200
                outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>


            {/* Password */}
            <div>
              <label className="text-gray-200 text-sm">Password</label>
              <input
                {...register("password", { required: "Password required" })}
                type="password"
                placeholder="******"
                autoComplete="new-password"
                className="w-full mt-1 px-4 py-2 rounded-lg
                bg-white/20 text-white placeholder-gray-200
                outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>


            {/* Submit */}
            <button
              className="w-full py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-purple-600 to-green-600
              shadow-lg hover:opacity-90 transition">
              {loading ? <TbFidgetSpinner className='animate-spin m-auto' /> : "Continue"}
            </button>
          </form>


          {/* OR */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-500/40"></div>
            <p className="px-3 text-gray-300">Or signup with</p>
            <div className="flex-1 h-px bg-gray-500/40"></div>
          </div>


          {/* Google Button */}
          <div
            onClick={handleGoogleSignIn}
            className="flex justify-center items-center gap-3 py-2
              rounded-xl bg-white/20 text-white cursor-pointer"
          >
            <FcGoogle size={28} />
            Continue with Google
          </div>


          {/* Already? */}
          <p className="text-center text-gray-300 mt-6 text-sm">
            Already have an account?
            <Link to="/login" state={from} className="text-purple-300 ms-1">
              Login
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default SignUp
