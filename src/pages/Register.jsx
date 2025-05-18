import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const { register, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const [err, setErr] = useState(null);
    const password = watch("password");

    const handleFormSubmit = async (formObj) => {
        if (formObj.password !== formObj.confirmPassword) {
            setErr({ message: "Passwords do not match" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formObj.username,
                    email: formObj.email,
                    password: formObj.password
                })
            });

            if (response.status === 201) {
                navigate('/login');
            } else {
                setErr({ message: "Failed to register. Please try again." });
            }
        } catch (error) {
            setErr({ message: error.message });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                {err && <p className="text-red-600 text-sm mb-4">{err.message}</p>}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block font-medium">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-3 py-2 border rounded-lg"
                            {...register('username')}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-lg"
                            {...register('email')}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded-lg"
                            {...register('password')}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-3 py-2 border rounded-lg"
                            {...register('confirmPassword')}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Register</button>
                </form>
                <p className="text-center text-sm mt-4">
                    Already registered? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
