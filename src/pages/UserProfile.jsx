import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginContextObj } from '../contexts/LoginContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/UserProfile.css';
import { motion } from 'framer-motion';
import {
    FaUser, FaEnvelope, FaPhone, FaHome, FaBirthdayCake, FaVenusMars, FaInfoCircle, FaCheckCircle
} from 'react-icons/fa';

function UserProfile() {
    const { currentUser, setCurrentUser } = useContext(loginContextObj);
    const [isEdit, setEdit] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Set initial values
    useEffect(() => {
        if (currentUser) {
            setValue('username', currentUser.username);
            setValue('email', currentUser.email);
            setValue('phone', currentUser.phone || '');
            setValue('address', currentUser.address || '');
            setValue('bio', currentUser.bio || '');
            setValue('dob', currentUser.dob || '');
            setValue('gender', currentUser.gender || '');
        }
    }, [currentUser, setValue]);

    const countFilled = [
        currentUser.phone, currentUser.address,
        currentUser.dob, currentUser.gender,
        currentUser.bio, currentUser.email
    ].filter(Boolean).length;

    const completionPercent = Math.floor((countFilled / 6) * 100);

    function onEdit() {
        setEdit(true);
        setError(null);
        setSuccess(null);
    }

    async function onSave(newObj) {
        setLoading(true);
        setError(null);
        setSuccess(null);
        newObj.id = currentUser.id;

        try {
            const response = await fetch(`http://localhost:5000/users/${newObj.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newObj),
            });

            if (!response.ok) throw new Error('Update failed');

            const data = await response.json();
            setCurrentUser(data);
            setEdit(false);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update user. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(id) {
        if (!window.confirm('Are you sure you want to delete your account?')) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Delete failed');

            setCurrentUser(null);
            navigate('/');
        } catch (err) {
            setError('Failed to delete user.');
        } finally {
            setLoading(false);
        }
    }

    if (!currentUser) return <p className="text-center text-warning">User not found.</p>;

    return (
        <motion.div
            className="user-profile-container container my-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>}
            {loading && <div className="text-center text-info">Processing...</div>}

            <div className="card shadow-lg p-4">
                <h1 className="text-center text-primary mb-3">User Profile</h1>

                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Profile Completion</span>
                        {completionPercent === 100 && (
                            <span className="badge bg-success">
                                <FaCheckCircle className="me-1" /> Completed
                            </span>
                        )}
                    </div>
                    <div className="progress mt-1" style={{ height: '8px' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${completionPercent}%` }} />
                    </div>
                </div>

                {!isEdit ? (
                    <div className="profile-view">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaUser className="me-2 text-primary" />
                                    <strong>Username:</strong>&nbsp;{currentUser.username}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaEnvelope className="me-2 text-primary" />
                                    <strong>Email:</strong>&nbsp;{currentUser.email}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaPhone className="me-2 text-primary" />
                                    <strong>Phone:</strong>&nbsp;{currentUser.phone || 'N/A'}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaHome className="me-2 text-primary" />
                                    <strong>Address:</strong>&nbsp;{currentUser.address || 'N/A'}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaBirthdayCake className="me-2 text-primary" />
                                    <strong>DOB:</strong>&nbsp;{currentUser.dob || 'N/A'}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <FaVenusMars className="me-2 text-primary" />
                                    <strong>Gender:</strong>&nbsp;{currentUser.gender || 'N/A'}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="d-flex align-items-start">
                                    <FaInfoCircle className="me-2 text-primary mt-1" />
                                    <div>
                                        <strong>Bio:</strong><br />
                                        <span>{currentUser.bio || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <button className="btn btn-warning mx-2" onClick={onEdit}>Edit Profile</button>
                            <button className="btn btn-danger mx-2" onClick={() => deleteUser(currentUser.id)}>Delete Account</button>
                        </div>
                    </div>

                ) : (
                    <form onSubmit={handleSubmit(onSave)} className="profile-edit">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Username</label>
                                <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    {...register('username', { required: 'Username is required' })} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Email</label>
                                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'Email is required' })} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Phone</label>
                                <input type="text" className="form-control" {...register('phone')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Address</label>
                                <input type="text" className="form-control" {...register('address')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" {...register('dob')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Gender</label>
                                <select className="form-select" {...register('gender')}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="col-12 mb-4">
                                <label>Bio</label>
                                <textarea className="form-control" rows="3" {...register('bio')} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-success" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => setEdit(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    );
}

export default UserProfile;
