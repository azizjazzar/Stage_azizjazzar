"use client";
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function SignIn() {
  const { data: session, status } = useSession(); 
  const [userlogin, setUserLogin] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const result = await signIn('credentials', {
      email: userlogin.email,
      password: userlogin.password,
      redirect: false, 
    });
    
    if (result.error) {
      console.error(result.error);
    } else {
      window.location.href = '/'; 
    }
  };
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/profil' }); 
  };
  const handleGITHUBSignIn = () =>{
    signIn('github', { callbackUrl: '/profil' }); 

  }
  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  if (session) {
    return (
      <div className="text-center pt-[90px]">
        <h2 className="font-bold text-3xl">Welcome, {session.user.name}!</h2>
        <button 
          onClick={() => signOut()} 
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4  "
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <section className="flex gap-4 pt-32">
      <div className="w-full lg:w-3/5 mt-24">
      
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2 pt-[100px]">
        <div className="text-center">
          <h2 className="font-bold mb-4 text-3xl">Sign In</h2>
          <p className="text-lg text-blue-gray-600">Enter your email and password to Sign In.</p>
        </div>

          <div className="space-y-4 mt-8 ">
            <button type="button" onClick={handleGoogleSignIn} className="gradient-button flex items-center gap-2 justify-center bg-white shadow-md py-2 px-4 rounded-full w-full">
            <img src="/img/google.webp" height={24} width={24} alt="" />

              <span>Sign in With Google</span>
            </button>
            <button type="button" onClick={handleGITHUBSignIn} className=" gradient-button flex items-center gap-2 justify-center bg-white shadow-md py-2 px-4 rounded-full w-full">
              <img src="/img/git.png" height={24} width={24} alt="" />
              <span>Sign in With GitHub</span>
            </button>
          </div>
          <p className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
          </p>
        </form>
      </div>
      <div className="pt-24 pr-14 w-2/5 h-full hidden lg:block">
        <img
          src="/img/loginimg.jpg"
          className="h-full w-full object-cover rounded-3xl"
          alt="Login"
        />
      </div>
    </section>
  );
}
