import css from "./OrderForm.module.css";
import { useState } from "react";
import { MapPicker } from "../MapPicker/MapPicker";

export const OrderForm = ({ totalPrice, onSubmit }) => {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [showMap, setShowMap] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const [addressError, setAddressError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const validateAddress = (val) =>
    val.trim().length > 0 && val.trim().length <= 1000;
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validatePhone = (val) => /^\d{10}$/.test(val.trim());

  const handleLocationSelect = (addressText, coordinates) => {
    setAddress(addressText);
    setAddressError(false);
    setDeliveryLocation(coordinates);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      totalPrice: Number(totalPrice),
      coordinates: deliveryLocation,
    });
  };

  const isSubmitDisabled =
    !address ||
    !email ||
    !phone ||
    !name ||
    addressError ||
    emailError ||
    phoneError;

  return (
    <form className={css.orderDataSection} onSubmit={handleSubmit}>
      <p className={css.totalPrice}>Total Price: ${totalPrice}</p>

      <div className={css.addressWrapper}>
        <label>
          Address:*
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setAddressError(!validateAddress(e.target.value));
            }}
            className={addressError ? css.invalidInput : ""}
          />
        </label>
        <button
          type="button"
          className={css.mapToggleBtn}
          onClick={() => setShowMap((prev) => !prev)}
        >
          🗺️ {showMap ? "Hide Map" : "Select on Map"}
        </button>
      </div>
      {addressError && (
        <p className={css.errorMsg}>Please enter a valid address.</p>
      )}

      {showMap && <MapPicker onLocationSelect={handleLocationSelect} />}

      <label>
        Email:*
        <input
          type="email"
          placeholder="mail@mail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!validateEmail(e.target.value));
          }}
          className={emailError ? css.invalidInput : ""}
        />
      </label>
      {emailError && (
        <p className={css.errorMsg}>Please enter a valid email address.</p>
      )}

      <label>
        Phone:*
        <input
          type="tel"
          placeholder="0991231213"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPhoneError(!validatePhone(e.target.value));
          }}
          className={phoneError ? css.invalidInput : ""}
        />
      </label>
      {phoneError && (
        <p className={css.errorMsg}>
          Please enter a valid phone number (10 digits).
        </p>
      )}

      <label>
        Name:*
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <button
        type="submit"
        className={css.submitBtn}
        disabled={isSubmitDisabled}
      >
        Submit
      </button>
    </form>
  );
};
