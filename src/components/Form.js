import React, { use, useEffect, useState } from "react"

export default function Form()  {
    const createErrorText = (error) => {
      return (
        <p className="text-red-500 text-xs italic">{error}</p>
      )
    }

    const createSubTitleText = (text) => {
      return (
        <p className="text-gray-600 text-xs italic">{text}</p>
      )
    }

    const formInput = ({label, placeholder, error, setValue, value, subTitleText, isHalf=false}) => {

      return (
        <div className={`w-full px-3 mb-6 md:mb-0 ${isHalf?"md:w-1/2":"mx-3"}`}>
          <label className={"block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "} for="grid-first-name" >
            {label}
          </label>
          <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${error? "border-red-500":"border-gray-200"}`} id="grid-first-name" type={'text'} placeholder={placeholder} onChange={val=>setValue(val)} value={value}/>
          {error?createErrorText(error): subTitleText?createSubTitleText(subTitleText):<></>}
        </div>
      )
    }

    const formSelect = ({label, options, error, setValue, value, name}) => {
      return (
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className={"block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"} htmlFor={name}>
            {label}
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id={name}
              value={value}
              onChange={e => setValue(e.target.value)}
            >
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option> 
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
        </div>
      )
    }
    
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      password: '',
      city: '',
      state: "Missouri",
      zip: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
    city: "",
    zip: "",
    state: ""
});


  const handleInputChange = (key, val) => {
    const { value } = val;
    setFormData(prevState => ({
        ...prevState,
        [key]: value
    }));
};

const validateForm = () => {
      let newErrors = {};

      // Check firstName
      if (!formData.firstName || formData.firstName.trim() === "") {
          newErrors.firstName = "First Name cannot be empty.";
      }

      // Check lastName
      if (!formData.lastName || formData.lastName.trim() === "") {
          newErrors.lastName = "Last Name cannot be empty.";
      }

      // Check password
      if (!formData.password || formData.password.trim() === "") {
          newErrors.password = "Password cannot be empty.";
      }

      // Check city
      if (!formData.city || formData.city.trim() === "") {
          newErrors.city = "City cannot be empty.";
      }

      // Check state
      if (!formData.state || formData.state.trim() === "") {
          newErrors.state = "State cannot be empty.";
      }

      // Check zip
      if (!formData.zip || formData.zip.trim() === "") {
          newErrors.zip = "Zip cannot be empty.";
      }

      // ... You can add more validations as per your needs ...

      setErrors(newErrors);

      // Return true if no errors, false otherwise.
      return Object.keys(newErrors).length === 0;
};


return (
  <form className="w-full max-w-lg">
      <div className="flex flex-wrap mb-6">
          {formInput({
              label: "First Name",
              placeholder: "Jane",
              error: errors.firstName,
              setValue: (val) => handleInputChange('firstName', val.target.value),
              value: formData.firstName,
              subTitleText: "Enter your first name",
              isHalf: true
          })}
          {formInput({
              label: "Last Name",
              placeholder: "Doe",
              error: errors.lastName,
              setValue: (val) => handleInputChange('lastName', val.target.value),
              value: formData.lastName,
              subTitleText: "Enter your last name",
              isHalf: true
          })}
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
          {formInput({
              label: "Password",
              placeholder: "******************",
              error: errors.password,
              setValue: (val) => handleInputChange('password', val.target.value),
              value: formData.password,
              subTitleText: "Make it as long and as crazy as you'd like"
          })}
      </div>
      {formSelect({
        label: "State",
        options: ["New Mexico", "Missouri", "Texas"],
        error: errors.state,
        setValue: value => handleInputChange("state", value),
        value: formData.state,
        name: "state"
      })}
      {/* <div className="flex flex-wrap -mx-3 mb-2">
          {formInput({
              label: "City",
              placeholder: "Albuquerque",
              error: errors.city,
              setValue: (val) => handleInputChange('city', val.target.value),
              value: formData.city,
              subTitleText: "Enter your city"
          })}
          {formInput({
              label: "State",
              placeholder: "New Mexico",
              error: errors.state,
              setValue: (val) => handleInputChange('state', val.target.value),
              value: formData.state,
              subTitleText: "Select your state"
          })}
          {formInput({
              label: "Zip",
              placeholder: "90210",
              error: errors.zip,
              setValue: (val) => handleInputChange('zip', val.target.value),
              value: formData.zip,
              subTitleText: "Enter your zip code"
          })}
      </div> */}
  </form>
);
  
}