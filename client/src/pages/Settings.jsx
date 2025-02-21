"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import { IoEyeOff, IoEye, IoLogOutOutline, IoPencil } from "react-icons/io5"
import { updateProfile, logout } from "../services/operation/auth"
import {useNavigate} from "react-router-dom"
const Settings = () => {
  const { token, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    image: null
  })

  const [preview, setPreview] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        newPassword: "",
        confirmPassword: "",
        image: null
      })
      setPreview(user.image || "https://via.placeholder.com/100")
    }
  }, [user])

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      Swal.fire("Error!", "Passwords do not match!", "error")
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("phone", formData.phone)
    if (formData.newPassword)
      formDataToSend.append("newPassword", formData.newPassword)
    if (formData.image) formDataToSend.append("image", formData.image)

    try {
      await updateProfile(formDataToSend, dispatch, token)
    } catch (error) {
      Swal.fire("Error!", "Network error. Please try again.", "error")
    }
  }

  const handleLogout = () => {
    dispatch(logout(navigate))
  }

  return (
    <div className="text-white w-full max-w-lg mx-auto mt-10 bg-gray-900 p-6 rounded-xl shadow-lg relative">
      <h2 className="text-2xl font-bold text-center mb-6">Settings</h2>

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
      >
        <IoLogOutOutline className="mr-2" />
        Logout
      </button>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center">
          <label className="text-center text-sm mb-2">Profile Image</label>
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-500 mb-2"
            />
            <label
              htmlFor="image-upload"
              className="absolute bottom-2 right-0 bg-gray-800 rounded-full p-2 cursor-pointer"
            >
              <IoPencil className="text-white" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-black rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 text-black rounded-lg"
          />
        </div>

        <div className="relative">
          <label className="block text-sm mb-1">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 text-black rounded-lg"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-400"
          >
            {showPassword ? (
              <IoEyeOff className="w-5 h-5" />
            ) : (
              <IoEye className="w-5 h-5" />
            )}
          </span>
        </div>

        <div className="relative">
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 text-black rounded-lg"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-400"
          >
            {showConfirmPassword ? (
              <IoEyeOff className="w-5 h-5" />
            ) : (
              <IoEye className="w-5 h-5" />
            )}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 py-2 mt-3 rounded-lg hover:bg-green-500 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default Settings
